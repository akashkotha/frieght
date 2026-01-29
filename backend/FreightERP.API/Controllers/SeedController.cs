using Microsoft.AspNetCore.Mvc;
using FreightERP.API.Data;
using FreightERP.API.Models;

namespace FreightERP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeedController : ControllerBase
{
    private readonly FreightERPContext _context;

    public SeedController(FreightERPContext context)
    {
        _context = context;
    }

    [HttpPost("populate")]
    public async Task<IActionResult> PopulateTestData()
    {
        try
        {
            // Check if data already exists
            if (_context.Customers.Any())
            {
                return BadRequest("Database already has data. Clear it first if you want to reseed.");
            }

            // Add Customers
            var customers = new List<Customer>
            {
                new Customer { CustomerName = "Acme Corporation", ContactPerson = "John Smith", Email = "john@acme.com", Phone = "+1-555-0101", Address = "123 Business St", City = "New York", Country = "USA", IsActive = true, CreatedAt = DateTime.UtcNow.AddDays(-60) },
                new Customer { CustomerName = "Global Traders Ltd", ContactPerson = "Sarah Johnson", Email = "sarah@globaltraders.com", Phone = "+44-20-7946-0958", Address = "456 Commerce Ave", City = "London", Country = "UK", IsActive = true, CreatedAt = DateTime.UtcNow.AddDays(-45) },
                new Customer { CustomerName = "Tech Solutions Inc", ContactPerson = "Michael Chen", Email = "michael@techsolutions.com", Phone = "+86-10-6554-3210", Address = "789 Innovation Blvd", City = "Beijing", Country = "China", IsActive = true, CreatedAt = DateTime.UtcNow.AddDays(-30) },
                new Customer { CustomerName = "Euro Imports GmbH", ContactPerson = "Hans Mueller", Email = "hans@euroimports.de", Phone = "+49-30-1234-5678", Address = "321 Export Strasse", City = "Berlin", Country = "Germany", IsActive = true, CreatedAt = DateTime.UtcNow.AddDays(-20) },
                new Customer { CustomerName = "Pacific Logistics Co", ContactPerson = "Yuki Tanaka", Email = "yuki@pacificlog.jp", Phone = "+81-3-5555-1234", Address = "654 Harbor Road", City = "Tokyo", Country = "Japan", IsActive = true, CreatedAt = DateTime.UtcNow.AddDays(-15) }
            };
            _context.Customers.AddRange(customers);
            await _context.SaveChangesAsync();

            // Add Vendors
            var vendors = new List<Vendor>
            {
                new Vendor { VendorName = "SkyFreight Airlines", ServiceType = "Air", ContactPerson = "David Wilson", Email = "david@skyfreight.com", Phone = "+1-555-0201", Address = "100 Airport Rd", IsActive = true, CreatedAt = DateTime.UtcNow.AddDays(-50) },
                new Vendor { VendorName = "Ocean Shipping Lines", ServiceType = "Sea", ContactPerson = "Maria Garcia", Email = "maria@oceanship.com", Phone = "+1-555-0202", Address = "200 Port Ave", IsActive = true, CreatedAt = DateTime.UtcNow.AddDays(-50) },
                new Vendor { VendorName = "Express Road Transport", ServiceType = "Road", ContactPerson = "Robert Brown", Email = "robert@expressroad.com", Phone = "+1-555-0203", Address = "300 Highway Blvd", IsActive = true, CreatedAt = DateTime.UtcNow.AddDays(-50) },
                new Vendor { VendorName = "Global Air Cargo", ServiceType = "Air", ContactPerson = "Lisa Anderson", Email = "lisa@globalair.com", Phone = "+44-20-7946-0959", Address = "400 Terminal St", IsActive = true, CreatedAt = DateTime.UtcNow.AddDays(-40) },
                new Vendor { VendorName = "FastTrack Trucking", ServiceType = "Road", ContactPerson = "James Taylor", Email = "james@fasttrack.com", Phone = "+1-555-0204", Address = "500 Logistics Ln", IsActive = true, CreatedAt = DateTime.UtcNow.AddDays(-35) }
            };
            _context.Vendors.AddRange(vendors);
            await _context.SaveChangesAsync();

            // Add Shipments
            var shipments = new List<Shipment>
            {
                // Delivered shipments
                new Shipment { ShipmentNumber = "SHP-20260101-001", CustomerId = customers[0].CustomerId, VendorId = vendors[0].VendorId, OriginCity = "New York", OriginCountry = "USA", DestinationCity = "Los Angeles", DestinationCountry = "USA", TransportMode = "Air", Weight = 150.5m, Volume = 2.5m, CargoDescription = "Electronics", EstimatedCost = 2796.75m, ActualCost = 2850.00m, Status = "Delivered", BookingDate = DateTime.UtcNow.AddDays(-55), ExpectedDeliveryDate = DateTime.UtcNow.AddDays(-53), ActualDeliveryDate = DateTime.UtcNow.AddDays(-52), CreatedBy = 1, CreatedAt = DateTime.UtcNow.AddDays(-55) },
                new Shipment { ShipmentNumber = "SHP-20260105-002", CustomerId = customers[1].CustomerId, VendorId = vendors[1].VendorId, OriginCity = "London", OriginCountry = "UK", DestinationCity = "Singapore", DestinationCountry = "Singapore", TransportMode = "Sea", Weight = 5000.0m, Volume = 50m, CargoDescription = "Machinery", EstimatedCost = 41744.00m, ActualCost = 42000.00m, Status = "Delivered", BookingDate = DateTime.UtcNow.AddDays(-50), ExpectedDeliveryDate = DateTime.UtcNow.AddDays(-20), ActualDeliveryDate = DateTime.UtcNow.AddDays(-19), CreatedBy = 1, CreatedAt = DateTime.UtcNow.AddDays(-50) },
                new Shipment { ShipmentNumber = "SHP-20260110-003", CustomerId = customers[2].CustomerId, VendorId = vendors[2].VendorId, OriginCity = "Beijing", OriginCountry = "China", DestinationCity = "Shanghai", DestinationCountry = "China", TransportMode = "Road", Weight = 800.0m, Volume = 10m, CargoDescription = "Textiles", EstimatedCost = 8036.30m, ActualCost = 8100.00m, Status = "Delivered", BookingDate = DateTime.UtcNow.AddDays(-45), ExpectedDeliveryDate = DateTime.UtcNow.AddDays(-43), ActualDeliveryDate = DateTime.UtcNow.AddDays(-42), CreatedBy = 1, CreatedAt = DateTime.UtcNow.AddDays(-45) },
                new Shipment { ShipmentNumber = "SHP-20260115-004", CustomerId = customers[0].CustomerId, VendorId = vendors[3].VendorId, OriginCity = "New York", OriginCountry = "USA", DestinationCity = "Paris", DestinationCountry = "France", TransportMode = "Air", Weight = 200.0m, Volume = 3m, CargoDescription = "Documents", EstimatedCost = 3291.85m, ActualCost = 3350.00m, Status = "Delivered", BookingDate = DateTime.UtcNow.AddDays(-40), ExpectedDeliveryDate = DateTime.UtcNow.AddDays(-38), ActualDeliveryDate = DateTime.UtcNow.AddDays(-37), CreatedBy = 1, CreatedAt = DateTime.UtcNow.AddDays(-40) },
                new Shipment { ShipmentNumber = "SHP-20260120-005", CustomerId = customers[3].CustomerId, VendorId = vendors[1].VendorId, OriginCity = "Berlin", OriginCountry = "Germany", DestinationCity = "Mumbai", DestinationCountry = "India", TransportMode = "Sea", Weight = 3500.0m, Volume = 40m, CargoDescription = "Auto Parts", EstimatedCost = 28136.94m, ActualCost = 28500.00m, Status = "Delivered", BookingDate = DateTime.UtcNow.AddDays(-35), ExpectedDeliveryDate = DateTime.UtcNow.AddDays(-10), ActualDeliveryDate = DateTime.UtcNow.AddDays(-9), CreatedBy = 1, CreatedAt = DateTime.UtcNow.AddDays(-35) },
                new Shipment { ShipmentNumber = "SHP-20260125-006", CustomerId = customers[4].CustomerId, VendorId = vendors[0].VendorId, OriginCity = "Tokyo", OriginCountry = "Japan", DestinationCity = "San Francisco", DestinationCountry = "USA", TransportMode = "Air", Weight = 120.0m, Volume = 2m, CargoDescription = "Semiconductors", EstimatedCost = 2213.90m, ActualCost = 2250.00m, Status = "Delivered", BookingDate = DateTime.UtcNow.AddDays(-30), ExpectedDeliveryDate = DateTime.UtcNow.AddDays(-28), ActualDeliveryDate = DateTime.UtcNow.AddDays(-27), CreatedBy = 1, CreatedAt = DateTime.UtcNow.AddDays(-30) },
                
                // In Transit
                new Shipment { ShipmentNumber = "SHP-20260210-009", CustomerId = customers[0].CustomerId, VendorId = vendors[1].VendorId, OriginCity = "New York", OriginCountry = "USA", DestinationCity = "Rotterdam", DestinationCountry = "Netherlands", TransportMode = "Sea", Weight = 4200.0m, Volume = 45m, CargoDescription = "Furniture", EstimatedCost = 33933.24m, ActualCost = 0, Status = "In Transit", BookingDate = DateTime.UtcNow.AddDays(-15), ExpectedDeliveryDate = DateTime.UtcNow.AddDays(5), ActualDeliveryDate = null, CreatedBy = 1, CreatedAt = DateTime.UtcNow.AddDays(-15) },
                new Shipment { ShipmentNumber = "SHP-20260215-010", CustomerId = customers[3].CustomerId, VendorId = vendors[4].VendorId, OriginCity = "Berlin", OriginCountry = "Germany", DestinationCity = "Vienna", DestinationCountry = "Austria", TransportMode = "Road", Weight = 600.0m, Volume = 8m, CargoDescription = "Medical Equipment", EstimatedCost = 6015.72m, ActualCost = 0, Status = "In Transit", BookingDate = DateTime.UtcNow.AddDays(-10), ExpectedDeliveryDate = DateTime.UtcNow.AddDays(2), ActualDeliveryDate = null, CreatedBy = 1, CreatedAt = DateTime.UtcNow.AddDays(-10) },
                
                // Delayed
                new Shipment { ShipmentNumber = "SHP-20260201-012", CustomerId = customers[1].CustomerId, VendorId = vendors[1].VendorId, OriginCity = "London", OriginCountry = "UK", DestinationCity = "Sydney", DestinationCountry = "Australia", TransportMode = "Sea", Weight = 6000.0m, Volume = 60m, CargoDescription = "Construction Materials", EstimatedCost = 48340.30m, ActualCost = 0, Status = "In Transit", BookingDate = DateTime.UtcNow.AddDays(-25), ExpectedDeliveryDate = DateTime.UtcNow.AddDays(-2), ActualDeliveryDate = null, CreatedBy = 1, CreatedAt = DateTime.UtcNow.AddDays(-25) },
                
                // Booked
                new Shipment { ShipmentNumber = "SHP-20260225-014", CustomerId = customers[0].CustomerId, VendorId = vendors[3].VendorId, OriginCity = "New York", OriginCountry = "USA", DestinationCity = "London", DestinationCountry = "UK", TransportMode = "Air", Weight = 175.0m, Volume = 3m, CargoDescription = "Samples", EstimatedCost = 2904.25m, ActualCost = 0, Status = "Booked", BookingDate = DateTime.UtcNow.AddDays(-5), ExpectedDeliveryDate = DateTime.UtcNow.AddDays(3), ActualDeliveryDate = null, CreatedBy = 1, CreatedAt = DateTime.UtcNow.AddDays(-5) }
            };
            _context.Shipments.AddRange(shipments);
            await _context.SaveChangesAsync();

            // Add Invoices for delivered shipments
            var invoices = new List<Invoice>();
            var deliveredShipments = shipments.Where(s => s.Status == "Delivered").ToList();
            int invoiceCounter = 1;
            
            foreach (var shipment in deliveredShipments)
            {
                var invoice = new Invoice
                {
                    InvoiceNumber = $"INV-{shipment.ActualDeliveryDate:yyyyMMdd}-{invoiceCounter:D3}",
                    ShipmentId = shipment.ShipmentId,
                    CustomerId = shipment.CustomerId,
                    SubTotal = shipment.ActualCost,
                    TaxAmount = Math.Round(shipment.ActualCost * 0.18m, 2),
                    TotalAmount = Math.Round(shipment.ActualCost * 1.18m, 2),
                    PaymentStatus = shipment.ActualDeliveryDate.HasValue && shipment.ActualDeliveryDate.Value < DateTime.UtcNow.AddDays(-30) ? "Paid" : "Pending",
                    DueDate = shipment.ActualDeliveryDate!.Value.AddDays(30),
                    PaidAmount = shipment.ActualDeliveryDate.HasValue && shipment.ActualDeliveryDate.Value < DateTime.UtcNow.AddDays(-30) ? Math.Round(shipment.ActualCost * 1.18m, 2) : 0,
                    PaidDate = shipment.ActualDeliveryDate.HasValue && shipment.ActualDeliveryDate.Value < DateTime.UtcNow.AddDays(-30) ? shipment.ActualDeliveryDate.Value.AddDays(25) : null,
                    CreatedBy = 1,
                    CreatedAt = shipment.ActualDeliveryDate!.Value
                };
                invoices.Add(invoice);
                invoiceCounter++;
            }
            _context.Invoices.AddRange(invoices);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Test data populated successfully!",
                customers = customers.Count,
                vendors = vendors.Count,
                shipments = shipments.Count,
                invoices = invoices.Count
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }
}
