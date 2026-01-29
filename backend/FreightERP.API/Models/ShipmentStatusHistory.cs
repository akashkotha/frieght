using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FreightERP.API.Models;

public class ShipmentStatusHistory
{
    [Key]
    public int HistoryId { get; set; }

    [Required]
    public int ShipmentId { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Remarks { get; set; } = string.Empty;

    public int UpdatedBy { get; set; }

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("ShipmentId")]
    public Shipment Shipment { get; set; } = null!;

    [ForeignKey("UpdatedBy")]
    public User UpdatedByUser { get; set; } = null!;
}
