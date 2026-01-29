namespace FreightERP.API.DTOs;

public class CostCalculationRequest
{
    public decimal Weight { get; set; }
    public string TransportMode { get; set; } = string.Empty;
    public decimal Distance { get; set; } // in KM
}

public class CostCalculationResponse
{
    public decimal EstimatedCost { get; set; }
    public string TransportMode { get; set; } = string.Empty;
    public decimal BaseRate { get; set; }
    public decimal WeightCharge { get; set; }
    public decimal DistanceCharge { get; set; }
    public decimal MinimumCharge { get; set; }
}
