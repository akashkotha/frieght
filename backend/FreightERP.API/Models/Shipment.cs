using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FreightERP.API.Models;

public class Shipment
{
    [Key]
    public int ShipmentId { get; set; }

    [Required]
    [MaxLength(50)]
    public string ShipmentNumber { get; set; } = string.Empty; // SHP-20260129-001

    [Required]
    public int CustomerId { get; set; }

    [Required]
    public int VendorId { get; set; }

    [Required]
    [MaxLength(100)]
    public string OriginCity { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string OriginCountry { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string DestinationCity { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string DestinationCountry { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string TransportMode { get; set; } = string.Empty; // Air, Sea, Road

    [Column(TypeName = "decimal(18,2)")]
    public decimal Weight { get; set; } // in KG

    [Column(TypeName = "decimal(18,2)")]
    public decimal Volume { get; set; } // in CBM

    [MaxLength(500)]
    public string CargoDescription { get; set; } = string.Empty;

    [Column(TypeName = "decimal(18,2)")]
    public decimal EstimatedCost { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal ActualCost { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Booked"; // Booked, In Transit, Delivered, Cancelled

    public DateTime BookingDate { get; set; } = DateTime.UtcNow;

    public DateTime ExpectedDeliveryDate { get; set; }

    public DateTime? ActualDeliveryDate { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("CustomerId")]
    public Customer Customer { get; set; } = null!;

    [ForeignKey("VendorId")]
    public Vendor Vendor { get; set; } = null!;

    [ForeignKey("CreatedBy")]
    public User CreatedByUser { get; set; } = null!;

    public ICollection<ShipmentStatusHistory> StatusHistory { get; set; } = new List<ShipmentStatusHistory>();
    public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
}
