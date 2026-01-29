using Microsoft.EntityFrameworkCore;
using FreightERP.API.Models;

namespace FreightERP.API.Data;

public class FreightERPContext : DbContext
{
    public FreightERPContext(DbContextOptions<FreightERPContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Vendor> Vendors { get; set; }
    public DbSet<Shipment> Shipments { get; set; }
    public DbSet<ShipmentStatusHistory> ShipmentStatusHistories { get; set; }
    public DbSet<Invoice> Invoices { get; set; }
    public DbSet<PricingRule> PricingRules { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure unique constraints
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<Shipment>()
            .HasIndex(s => s.ShipmentNumber)
            .IsUnique();

        modelBuilder.Entity<Invoice>()
            .HasIndex(i => i.InvoiceNumber)
            .IsUnique();

        // Configure relationships
        modelBuilder.Entity<Shipment>()
            .HasOne(s => s.Customer)
            .WithMany(c => c.Shipments)
            .HasForeignKey(s => s.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Shipment>()
            .HasOne(s => s.Vendor)
            .WithMany(v => v.Shipments)
            .HasForeignKey(s => s.VendorId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Shipment>()
            .HasOne(s => s.CreatedByUser)
            .WithMany(u => u.CreatedShipments)
            .HasForeignKey(s => s.CreatedBy)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Invoice>()
            .HasOne(i => i.Shipment)
            .WithMany(s => s.Invoices)
            .HasForeignKey(i => i.ShipmentId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Invoice>()
            .HasOne(i => i.Customer)
            .WithMany(c => c.Invoices)
            .HasForeignKey(i => i.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Invoice>()
            .HasOne(i => i.CreatedByUser)
            .WithMany(u => u.CreatedInvoices)
            .HasForeignKey(i => i.CreatedBy)
            .OnDelete(DeleteBehavior.Restrict);

        // Seed initial data
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Seed pricing rules
        modelBuilder.Entity<PricingRule>().HasData(
            new PricingRule
            {
                RuleId = 1,
                TransportMode = "Air",
                BaseRate = 15.00m,
                DistanceMultiplier = 0.05m,
                MinimumCharge = 500.00m,
                IsActive = true
            },
            new PricingRule
            {
                RuleId = 2,
                TransportMode = "Sea",
                BaseRate = 8.00m,
                DistanceMultiplier = 0.02m,
                MinimumCharge = 300.00m,
                IsActive = true
            },
            new PricingRule
            {
                RuleId = 3,
                TransportMode = "Road",
                BaseRate = 10.00m,
                DistanceMultiplier = 0.03m,
                MinimumCharge = 200.00m,
                IsActive = true
            }
        );

        // Seed default admin user (password: Admin@123)
        modelBuilder.Entity<User>().HasData(
            new User
            {
                UserId = 1,
                Username = "admin",
                PasswordHash = "TempHash123",
                FullName = "System Administrator",
                Email = "admin@freighterp.com",
                Role = "Admin",
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                IsActive = true
            }
        );
    }
}
