using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FreightERP.API.Models;

public class PricingRule
{
    [Key]
    public int RuleId { get; set; }

    [Required]
    [MaxLength(20)]
    public string TransportMode { get; set; } = string.Empty; // Air, Sea, Road

    [Column(TypeName = "decimal(18,2)")]
    public decimal BaseRate { get; set; } // per KG

    [Column(TypeName = "decimal(10,4)")]
    public decimal DistanceMultiplier { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal MinimumCharge { get; set; }

    public bool IsActive { get; set; } = true;
}
