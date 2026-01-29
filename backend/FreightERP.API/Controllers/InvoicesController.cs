using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using FreightERP.API.Data;
using FreightERP.API.Models;

namespace FreightERP.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class InvoicesController : ControllerBase
{
    private readonly FreightERPContext _context;

    public InvoicesController(FreightERPContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Invoice>>> GetInvoices(
        [FromQuery] string? paymentStatus = null,
        [FromQuery] int? customerId = null)
    {
        var query = _context.Invoices
            .Include(i => i.Customer)
            .Include(i => i.Shipment)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(paymentStatus))
        {
            query = query.Where(i => i.PaymentStatus == paymentStatus);
        }

        if (customerId.HasValue)
        {
            query = query.Where(i => i.CustomerId == customerId.Value);
        }

        var invoices = await query
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();

        return Ok(invoices);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Invoice>> GetInvoice(int id)
    {
        var invoice = await _context.Invoices
            .Include(i => i.Customer)
            .Include(i => i.Shipment)
            .FirstOrDefaultAsync(i => i.InvoiceId == id);

        if (invoice == null)
        {
            return NotFound();
        }

        return Ok(invoice);
    }

    [HttpPost]
    public async Task<ActionResult<Invoice>> CreateInvoice([FromBody] CreateInvoiceRequest request)
    {
        var shipment = await _context.Shipments.FindAsync(request.ShipmentId);
        if (shipment == null)
        {
            return NotFound(new { message = "Shipment not found" });
        }

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "1");

        // Generate invoice number
        var today = DateTime.UtcNow;
        var count = await _context.Invoices
            .CountAsync(i => i.InvoiceDate.Date == today.Date);
        var invoiceNumber = $"INV-{today:yyyyMMdd}-{(count + 1):D3}";

        // Calculate amounts
        var subTotal = shipment.ActualCost > 0 ? shipment.ActualCost : shipment.EstimatedCost;
        var taxRate = 0.18m; // 18% GST
        var taxAmount = subTotal * taxRate;
        var totalAmount = subTotal + taxAmount;

        var invoice = new Invoice
        {
            InvoiceNumber = invoiceNumber,
            ShipmentId = request.ShipmentId,
            CustomerId = shipment.CustomerId,
            InvoiceDate = DateTime.UtcNow,
            DueDate = DateTime.UtcNow.AddDays(30),
            SubTotal = subTotal,
            TaxAmount = taxAmount,
            TotalAmount = totalAmount,
            PaymentStatus = "Pending",
            PaidAmount = 0,
            CreatedBy = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Invoices.Add(invoice);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetInvoice), new { id = invoice.InvoiceId }, invoice);
    }

    [HttpPut("{id}/payment")]
    public async Task<IActionResult> UpdatePaymentStatus(int id, [FromBody] UpdatePaymentRequest request)
    {
        var invoice = await _context.Invoices.FindAsync(id);
        if (invoice == null)
        {
            return NotFound();
        }

        invoice.PaymentStatus = request.PaymentStatus;
        invoice.PaidAmount = request.PaidAmount;
        
        if (request.PaymentStatus == "Paid")
        {
            invoice.PaidDate = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("customer/{customerId}")]
    public async Task<ActionResult<IEnumerable<Invoice>>> GetCustomerInvoices(int customerId)
    {
        var invoices = await _context.Invoices
            .Where(i => i.CustomerId == customerId)
            .Include(i => i.Shipment)
            .OrderByDescending(i => i.InvoiceDate)
            .ToListAsync();

        return Ok(invoices);
    }
}

public class CreateInvoiceRequest
{
    public int ShipmentId { get; set; }
}

public class UpdatePaymentRequest
{
    public string PaymentStatus { get; set; } = string.Empty;
    public decimal PaidAmount { get; set; }
}
