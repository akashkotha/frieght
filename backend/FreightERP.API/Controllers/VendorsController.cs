using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FreightERP.API.Data;
using FreightERP.API.Models;

namespace FreightERP.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class VendorsController : ControllerBase
{
    private readonly FreightERPContext _context;

    public VendorsController(FreightERPContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Vendor>>> GetVendors(
        [FromQuery] string? search = null,
        [FromQuery] string? serviceType = null)
    {
        var query = _context.Vendors.Where(v => v.IsActive);

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(v =>
                v.VendorName.Contains(search) ||
                v.Email.Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(serviceType))
        {
            query = query.Where(v => v.ServiceType == serviceType);
        }

        var vendors = await query
            .OrderByDescending(v => v.CreatedAt)
            .ToListAsync();

        return Ok(vendors);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Vendor>> GetVendor(int id)
    {
        var vendor = await _context.Vendors
            .Include(v => v.Shipments)
            .FirstOrDefaultAsync(v => v.VendorId == id);

        if (vendor == null)
        {
            return NotFound();
        }

        return Ok(vendor);
    }

    [HttpPost]
    public async Task<ActionResult<Vendor>> CreateVendor([FromBody] Vendor vendor)
    {
        _context.Vendors.Add(vendor);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetVendor), new { id = vendor.VendorId }, vendor);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateVendor(int id, [FromBody] Vendor vendor)
    {
        if (id != vendor.VendorId)
        {
            return BadRequest();
        }

        _context.Entry(vendor).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.Vendors.AnyAsync(v => v.VendorId == id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVendor(int id)
    {
        var vendor = await _context.Vendors.FindAsync(id);
        if (vendor == null)
        {
            return NotFound();
        }

        vendor.IsActive = false;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
