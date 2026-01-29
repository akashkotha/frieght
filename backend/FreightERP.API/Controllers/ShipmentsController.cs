using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using FreightERP.API.Data;
using FreightERP.API.Models;
using FreightERP.API.DTOs;
using FreightERP.API.Services;

namespace FreightERP.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ShipmentsController : ControllerBase
{
    private readonly FreightERPContext _context;
    private readonly ICostCalculationService _costService;

    public ShipmentsController(FreightERPContext context, ICostCalculationService costService)
    {
        _context = context;
        _costService = costService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Shipment>>> GetShipments(
        [FromQuery] string? status = null,
        [FromQuery] int? customerId = null,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        var query = _context.Shipments
            .Include(s => s.Customer)
            .Include(s => s.Vendor)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(s => s.Status == status);
        }

        if (customerId.HasValue)
        {
            query = query.Where(s => s.CustomerId == customerId.Value);
        }

        if (fromDate.HasValue)
        {
            query = query.Where(s => s.BookingDate >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            query = query.Where(s => s.BookingDate <= toDate.Value);
        }

        var shipments = await query
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();

        return Ok(shipments);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Shipment>> GetShipment(int id)
    {
        var shipment = await _context.Shipments
            .Include(s => s.Customer)
            .Include(s => s.Vendor)
            .Include(s => s.StatusHistory.OrderByDescending(h => h.UpdatedAt))
            .FirstOrDefaultAsync(s => s.ShipmentId == id);

        if (shipment == null)
        {
            return NotFound();
        }

        return Ok(shipment);
    }

    [HttpPost]
    public async Task<ActionResult<Shipment>> CreateShipment([FromBody] Shipment shipment)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "1");

        // Generate shipment number
        var today = DateTime.UtcNow;
        var count = await _context.Shipments
            .CountAsync(s => s.BookingDate.Date == today.Date);
        shipment.ShipmentNumber = $"SHP-{today:yyyyMMdd}-{(count + 1):D3}";

        shipment.CreatedBy = userId;
        shipment.CreatedAt = DateTime.UtcNow;
        shipment.UpdatedAt = DateTime.UtcNow;

        _context.Shipments.Add(shipment);

        // Add initial status history
        var statusHistory = new ShipmentStatusHistory
        {
            ShipmentId = shipment.ShipmentId,
            Status = shipment.Status,
            Remarks = "Shipment created",
            UpdatedBy = userId,
            UpdatedAt = DateTime.UtcNow
        };
        _context.ShipmentStatusHistories.Add(statusHistory);

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetShipment), new { id = shipment.ShipmentId }, shipment);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateShipment(int id, [FromBody] Shipment shipment)
    {
        if (id != shipment.ShipmentId)
        {
            return BadRequest();
        }

        shipment.UpdatedAt = DateTime.UtcNow;
        _context.Entry(shipment).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.Shipments.AnyAsync(s => s.ShipmentId == id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateShipmentStatus(int id, [FromBody] UpdateStatusRequest request)
    {
        var shipment = await _context.Shipments.FindAsync(id);
        if (shipment == null)
        {
            return NotFound();
        }

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "1");

        shipment.Status = request.Status;
        shipment.UpdatedAt = DateTime.UtcNow;

        if (request.Status == "Delivered" && !shipment.ActualDeliveryDate.HasValue)
        {
            shipment.ActualDeliveryDate = DateTime.UtcNow;
        }

        // Add status history
        var statusHistory = new ShipmentStatusHistory
        {
            ShipmentId = id,
            Status = request.Status,
            Remarks = request.Remarks ?? string.Empty,
            UpdatedBy = userId,
            UpdatedAt = DateTime.UtcNow
        };
        _context.ShipmentStatusHistories.Add(statusHistory);

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("calculate-cost")]
    public async Task<ActionResult<CostCalculationResponse>> CalculateCost([FromBody] CostCalculationRequest request)
    {
        try
        {
            var result = await _costService.CalculateCost(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}/history")]
    public async Task<ActionResult<IEnumerable<ShipmentStatusHistory>>> GetShipmentHistory(int id)
    {
        var history = await _context.ShipmentStatusHistories
            .Where(h => h.ShipmentId == id)
            .Include(h => h.UpdatedByUser)
            .OrderByDescending(h => h.UpdatedAt)
            .ToListAsync();

        return Ok(history);
    }
}

public class UpdateStatusRequest
{
    public string Status { get; set; } = string.Empty;
    public string? Remarks { get; set; }
}
