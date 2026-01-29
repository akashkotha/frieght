using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FreightERP.API.Data;
using FreightERP.API.DTOs;

namespace FreightERP.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly FreightERPContext _context;

    public DashboardController(FreightERPContext context)
    {
        _context = context;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<DashboardSummaryDto>> GetSummary()
    {
        var now = DateTime.UtcNow;
        var firstDayOfMonth = new DateTime(now.Year, now.Month, 1);

        var totalShipmentsThisMonth = await _context.Shipments
            .CountAsync(s => s.BookingDate >= firstDayOfMonth);

        var activeShipments = await _context.Shipments
            .CountAsync(s => s.Status == "Booked" || s.Status == "In Transit");

        var delayedShipments = await _context.Shipments
            .CountAsync(s => s.Status != "Delivered" && 
                           s.Status != "Cancelled" && 
                           s.ExpectedDeliveryDate < now);

        var totalRevenueThisMonth = await _context.Invoices
            .Where(i => i.InvoiceDate >= firstDayOfMonth)
            .SumAsync(i => (decimal?)i.TotalAmount) ?? 0;

        var pendingInvoices = await _context.Invoices
            .CountAsync(i => i.PaymentStatus == "Pending" || i.PaymentStatus == "Overdue");

        var pendingInvoiceAmount = await _context.Invoices
            .Where(i => i.PaymentStatus == "Pending" || i.PaymentStatus == "Overdue")
            .SumAsync(i => (decimal?)i.TotalAmount) ?? 0;

        return Ok(new DashboardSummaryDto
        {
            TotalShipmentsThisMonth = totalShipmentsThisMonth,
            ActiveShipments = activeShipments,
            DelayedShipments = delayedShipments,
            TotalRevenueThisMonth = totalRevenueThisMonth,
            PendingInvoices = pendingInvoices,
            PendingInvoiceAmount = pendingInvoiceAmount
        });
    }

    [HttpGet("revenue-trend")]
    public async Task<ActionResult<IEnumerable<RevenueTrendDto>>> GetRevenueTrend()
    {
        var sixMonthsAgo = DateTime.UtcNow.AddMonths(-6);

        var invoices = await _context.Invoices
            .Where(i => i.InvoiceDate >= sixMonthsAgo)
            .ToListAsync();

        var trend = invoices
            .GroupBy(i => new { i.InvoiceDate.Year, i.InvoiceDate.Month })
            .Select(g => new RevenueTrendDto
            {
                Month = $"{g.Key.Year}-{g.Key.Month:D2}",
                Revenue = g.Sum(i => i.TotalAmount),
                ShipmentCount = g.Count()
            })
            .OrderBy(t => t.Month)
            .ToList();

        return Ok(trend);
    }

    [HttpGet("shipments-by-mode")]
    public async Task<ActionResult<IEnumerable<ShipmentModeDistributionDto>>> GetShipmentsByMode()
    {
        var totalShipments = await _context.Shipments.CountAsync();

        var distribution = await _context.Shipments
            .GroupBy(s => s.TransportMode)
            .Select(g => new ShipmentModeDistributionDto
            {
                TransportMode = g.Key,
                Count = g.Count(),
                Percentage = totalShipments > 0 ? (decimal)g.Count() / totalShipments * 100 : 0
            })
            .ToListAsync();

        return Ok(distribution);
    }

    [HttpGet("top-customers")]
    public async Task<ActionResult<IEnumerable<TopCustomerDto>>> GetTopCustomers([FromQuery] int limit = 5)
    {
        var topCustomers = await _context.Invoices
            .GroupBy(i => new { i.CustomerId, i.Customer.CustomerName })
            .Select(g => new TopCustomerDto
            {
                CustomerId = g.Key.CustomerId,
                CustomerName = g.Key.CustomerName,
                TotalRevenue = g.Sum(i => i.TotalAmount),
                ShipmentCount = g.Count()
            })
            .OrderByDescending(c => c.TotalRevenue)
            .Take(limit)
            .ToListAsync();

        return Ok(topCustomers);
    }

    [HttpGet("delayed-shipments")]
    public async Task<ActionResult<IEnumerable<object>>> GetDelayedShipments()
    {
        var now = DateTime.UtcNow;

        var delayedShipments = await _context.Shipments
            .Where(s => s.Status != "Delivered" && 
                       s.Status != "Cancelled" && 
                       s.ExpectedDeliveryDate < now)
            .Include(s => s.Customer)
            .Include(s => s.Vendor)
            .OrderBy(s => s.ExpectedDeliveryDate)
            .Select(s => new
            {
                s.ShipmentId,
                s.ShipmentNumber,
                CustomerName = s.Customer.CustomerName,
                VendorName = s.Vendor.VendorName,
                s.OriginCity,
                s.DestinationCity,
                s.ExpectedDeliveryDate,
                s.Status,
                DaysDelayed = (now - s.ExpectedDeliveryDate).Days
            })
            .ToListAsync();

        return Ok(delayedShipments);
    }
}
