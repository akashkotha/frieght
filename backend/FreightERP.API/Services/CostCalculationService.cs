using Microsoft.EntityFrameworkCore;
using FreightERP.API.Data;
using FreightERP.API.DTOs;
using FreightERP.API.Models;

namespace FreightERP.API.Services;

public interface ICostCalculationService
{
    Task<CostCalculationResponse> CalculateCost(CostCalculationRequest request);
}

public class CostCalculationService : ICostCalculationService
{
    private readonly FreightERPContext _context;

    public CostCalculationService(FreightERPContext context)
    {
        _context = context;
    }

    public async Task<CostCalculationResponse> CalculateCost(CostCalculationRequest request)
    {
        var pricingRule = await _context.PricingRules
            .FirstOrDefaultAsync(p => p.TransportMode == request.TransportMode && p.IsActive);

        if (pricingRule == null)
        {
            throw new Exception($"No active pricing rule found for transport mode: {request.TransportMode}");
        }

        // Calculate cost components
        var weightCharge = request.Weight * pricingRule.BaseRate;
        var distanceCharge = request.Distance * pricingRule.DistanceMultiplier;
        var calculatedCost = weightCharge + distanceCharge;

        // Apply minimum charge if necessary
        var estimatedCost = Math.Max(calculatedCost, pricingRule.MinimumCharge);

        return new CostCalculationResponse
        {
            EstimatedCost = Math.Round(estimatedCost, 2),
            TransportMode = request.TransportMode,
            BaseRate = pricingRule.BaseRate,
            WeightCharge = Math.Round(weightCharge, 2),
            DistanceCharge = Math.Round(distanceCharge, 2),
            MinimumCharge = pricingRule.MinimumCharge
        };
    }
}
