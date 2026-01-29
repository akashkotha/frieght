-- Sample Data for Freight ERP System
-- Run this in your database to populate with test data

-- Insert Customers
INSERT INTO Customers (CustomerName, ContactPerson, Email, Phone, Address, City, Country, IsActive, CreatedAt)
VALUES 
('Acme Corporation', 'John Smith', 'john@acme.com', '+1-555-0101', '123 Business St', 'New York', 'USA', 1, datetime('now', '-60 days')),
('Global Traders Ltd', 'Sarah Johnson', 'sarah@globaltraders.com', '+44-20-7946-0958', '456 Commerce Ave', 'London', 'UK', 1, datetime('now', '-45 days')),
('Tech Solutions Inc', 'Michael Chen', 'michael@techsolutions.com', '+86-10-6554-3210', '789 Innovation Blvd', 'Beijing', 'China', 1, datetime('now', '-30 days')),
('Euro Imports GmbH', 'Hans Mueller', 'hans@euroimports.de', '+49-30-1234-5678', '321 Export Strasse', 'Berlin', 'Germany', 1, datetime('now', '-20 days')),
('Pacific Logistics Co', 'Yuki Tanaka', 'yuki@pacificlog.jp', '+81-3-5555-1234', '654 Harbor Road', 'Tokyo', 'Japan', 1, datetime('now', '-15 days'));

-- Insert Vendors
INSERT INTO Vendors (VendorName, ServiceType, ContactPerson, Email, Phone, Address, IsActive, CreatedAt)
VALUES 
('SkyFreight Airlines', 'Air', 'David Wilson', 'david@skyfreight.com', '+1-555-0201', '100 Airport Rd', 1, datetime('now', '-50 days')),
('Ocean Shipping Lines', 'Sea', 'Maria Garcia', 'maria@oceanship.com', '+1-555-0202', '200 Port Ave', 1, datetime('now', '-50 days')),
('Express Road Transport', 'Road', 'Robert Brown', 'robert@expressroad.com', '+1-555-0203', '300 Highway Blvd', 1, datetime('now', '-50 days')),
('Global Air Cargo', 'Air', 'Lisa Anderson', 'lisa@globalair.com', '+44-20-7946-0959', '400 Terminal St', 1, datetime('now', '-40 days')),
('FastTrack Trucking', 'Road', 'James Taylor', 'james@fasttrack.com', '+1-555-0204', '500 Logistics Ln', 1, datetime('now', '-35 days'));

-- Insert Shipments (mix of statuses and dates)
INSERT INTO Shipments (ShipmentNumber, CustomerId, VendorId, Origin, Destination, TransportMode, Weight, Distance, EstimatedCost, ActualCost, Status, BookingDate, ExpectedDeliveryDate, ActualDeliveryDate, Remarks, CreatedAt)
VALUES 
-- Delivered shipments (for revenue)
('SHP-20260101-001', 1, 1, 'New York', 'Los Angeles', 'Air', 150.5, 3936, 2796.75, 2850.00, 'Delivered', datetime('now', '-55 days'), datetime('now', '-53 days'), datetime('now', '-52 days'), 'Express delivery completed', datetime('now', '-55 days')),
('SHP-20260105-002', 2, 2, 'London', 'Singapore', 'Sea', 5000.0, 10872, 41744.00, 42000.00, 'Delivered', datetime('now', '-50 days'), datetime('now', '-20 days'), datetime('now', '-19 days'), 'Container shipment', datetime('now', '-50 days')),
('SHP-20260110-003', 3, 3, 'Beijing', 'Shanghai', 'Road', 800.0, 1213, 8036.30, 8100.00, 'Delivered', datetime('now', '-45 days'), datetime('now', '-43 days'), datetime('now', '-42 days'), 'Domestic freight', datetime('now', '-45 days')),
('SHP-20260115-004', 1, 4, 'New York', 'Paris', 'Air', 200.0, 5837, 3291.85, 3350.00, 'Delivered', datetime('now', '-40 days'), datetime('now', '-38 days'), datetime('now', '-37 days'), 'International air freight', datetime('now', '-40 days')),
('SHP-20260120-005', 4, 2, 'Berlin', 'Mumbai', 'Sea', 3500.0, 6847, 28136.94, 28500.00, 'Delivered', datetime('now', '-35 days'), datetime('now', '-10 days'), datetime('now', '-9 days'), 'Heavy machinery', datetime('now', '-35 days')),
('SHP-20260125-006', 5, 1, 'Tokyo', 'San Francisco', 'Air', 120.0, 8278, 2213.90, 2250.00, 'Delivered', datetime('now', '-30 days'), datetime('now', '-28 days'), datetime('now', '-27 days'), 'Electronics shipment', datetime('now', '-30 days')),
('SHP-20260201-007', 2, 3, 'London', 'Manchester', 'Road', 450.0, 262, 4507.86, 4550.00, 'Delivered', datetime('now', '-25 days'), datetime('now', '-24 days'), datetime('now', '-23 days'), 'UK domestic', datetime('now', '-25 days')),
('SHP-20260205-008', 3, 4, 'Beijing', 'Dubai', 'Air', 180.0, 5950, 2997.50, 3050.00, 'Delivered', datetime('now', '-20 days'), datetime('now', '-18 days'), datetime('now', '-17 days'), 'Middle East route', datetime('now', '-20 days')),

-- In Transit shipments
('SHP-20260210-009', 1, 2, 'New York', 'Rotterdam', 'Sea', 4200.0, 5862, 33933.24, 0, 'In Transit', datetime('now', '-15 days'), datetime('now', '+5 days'), NULL, 'Container en route', datetime('now', '-15 days')),
('SHP-20260215-010', 4, 5, 'Berlin', 'Vienna', 'Road', 600.0, 524, 6015.72, 0, 'In Transit', datetime('now', '-10 days'), datetime('now', '+2 days'), NULL, 'Express road freight', datetime('now', '-10 days')),
('SHP-20260220-011', 5, 1, 'Tokyo', 'Seoul', 'Air', 95.0, 1156, 1482.80, 0, 'In Transit', datetime('now', '-8 days'), datetime('now', '+1 days'), NULL, 'Asia regional', datetime('now', '-8 days')),

-- Delayed shipments (expected delivery in past, still in transit)
('SHP-20260201-012', 2, 2, 'London', 'Sydney', 'Sea', 6000.0, 17015, 48340.30, 0, 'In Transit', datetime('now', '-25 days'), datetime('now', '-2 days'), NULL, 'Delayed due to weather', datetime('now', '-25 days')),
('SHP-20260205-013', 3, 3, 'Beijing', 'Moscow', 'Road', 1200.0, 5794, 12017.82, 0, 'In Transit', datetime('now', '-20 days'), datetime('now', '-3 days'), NULL, 'Customs delay', datetime('now', '-20 days')),

-- Recent bookings
('SHP-20260225-014', 1, 4, 'New York', 'London', 'Air', 175.0, 5585, 2904.25, 0, 'Booked', datetime('now', '-5 days'), datetime('now', '+3 days'), NULL, 'Scheduled for pickup', datetime('now', '-5 days')),
('SHP-20260227-015', 4, 5, 'Berlin', 'Amsterdam', 'Road', 350.0, 577, 3517.31, 0, 'Booked', datetime('now', '-3 days'), datetime('now', '+2 days'), NULL, 'Awaiting dispatch', datetime('now', '-3 days'));

-- Insert Shipment Status History
INSERT INTO ShipmentStatusHistory (ShipmentId, Status, Remarks, UpdatedBy, UpdatedAt)
SELECT ShipmentId, 'Booked', 'Shipment created', 1, CreatedAt FROM Shipments;

INSERT INTO ShipmentStatusHistory (ShipmentId, Status, Remarks, UpdatedBy, UpdatedAt)
SELECT ShipmentId, 'In Transit', 'Shipment dispatched', 1, datetime(CreatedAt, '+1 day') 
FROM Shipments WHERE Status IN ('In Transit', 'Delivered');

INSERT INTO ShipmentStatusHistory (ShipmentId, Status, Remarks, UpdatedBy, UpdatedAt)
SELECT ShipmentId, 'Delivered', 'Shipment delivered successfully', 1, ActualDeliveryDate 
FROM Shipments WHERE Status = 'Delivered';

-- Insert Invoices for delivered shipments
INSERT INTO Invoices (InvoiceNumber, ShipmentId, CustomerId, SubTotal, TaxRate, TaxAmount, TotalAmount, PaymentStatus, DueDate, PaidDate, CreatedAt)
SELECT 
    'INV-' || strftime('%Y%m%d', ActualDeliveryDate) || '-' || printf('%03d', ROW_NUMBER() OVER (ORDER BY ActualDeliveryDate)),
    ShipmentId,
    CustomerId,
    ActualCost,
    18.0,
    ROUND(ActualCost * 0.18, 2),
    ROUND(ActualCost * 1.18, 2),
    CASE 
        WHEN ActualDeliveryDate < datetime('now', '-30 days') THEN 'Paid'
        WHEN ActualDeliveryDate < datetime('now', '-15 days') THEN 'Pending'
        ELSE 'Pending'
    END,
    datetime(ActualDeliveryDate, '+30 days'),
    CASE 
        WHEN ActualDeliveryDate < datetime('now', '-30 days') THEN datetime(ActualDeliveryDate, '+25 days')
        ELSE NULL
    END,
    ActualDeliveryDate
FROM Shipments 
WHERE Status = 'Delivered';
