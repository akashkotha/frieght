namespace FreightERP.API.DTOs;

public class DashboardSummaryDto
{
    public int TotalShipmentsThisMonth { get; set; }
    public int ActiveShipments { get; set; }
    public int DelayedShipments { get; set; }
    public decimal TotalRevenueThisMonth { get; set; }
    public int PendingInvoices { get; set; }
    public decimal PendingInvoiceAmount { get; set; }
}

public class RevenueTrendDto
{
    public string Month { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int ShipmentCount { get; set; }
}

public class ShipmentModeDistributionDto
{
    public string TransportMode { get; set; } = string.Empty;
    public int Count { get; set; }
    public decimal Percentage { get; set; }
}

public class TopCustomerDto
{
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public decimal TotalRevenue { get; set; }
    public int ShipmentCount { get; set; }
}
