using System.ComponentModel.DataAnnotations;

namespace FreightERP.API.Models;

public class Vendor
{
    [Key]
    public int VendorId { get; set; }

    [Required]
    [MaxLength(200)]
    public string VendorName { get; set; } = string.Empty;

    [MaxLength(100)]
    public string ContactPerson { get; set; } = string.Empty;

    [MaxLength(100)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(100)]
    public string ServiceType { get; set; } = string.Empty; // Air, Sea, Road, Combined

    [MaxLength(500)]
    public string Address { get; set; } = string.Empty;

    [MaxLength(100)]
    public string City { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Country { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool IsActive { get; set; } = true;

    // Navigation properties
    public ICollection<Shipment> Shipments { get; set; } = new List<Shipment>();
}
