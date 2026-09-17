# Data Dictionary: OmniFlow Platform

This document describes all tables, schemas, data types, constraints, and relationships across both the OLTP (`OmniFlowDB`) and OLAP (`OmniFlowDW`) databases.

---

## 1. OLTP Database: `OmniFlowDB`

### Schema: `Customer`
Stores customer identity, demographics, and contact information.

#### Table: `Customer.Customer`
* **Filegroup**: `DATA_FG`
* **Description**: Normalized profile information for individual and business clients.

| Column Name | Data Type | Nullable | Default / Rule | Constraints & Description |
| :--- | :--- | :--- | :--- | :--- |
| `CustomerId` | `INT IDENTITY(1,1)` | No | Identity | Primary Key, clustered |
| `CustomerCode` | `VARCHAR(20)` | No | None | Unique constraint (`UQ_Customer_Code`) |
| `FirstName` | `NVARCHAR(50)` | No | None | Customer given name |
| `LastName` | `NVARCHAR(50)` | No | None | Customer surname |
| `Email` | `VARCHAR(100)` | No | None | Unique constraint; CHECK format (`%@%.%`) |
| `PhoneNumber` | `VARCHAR(20)` | Yes | NULL | Contact phone number |
| `PostalCode` | `udt_PostalCode` | Yes | NULL | User-defined type (`VARCHAR(10)`) |
| `CreatedDate` | `DATETIME2(3)` | No | `SYSUTCDATETIME()` | Record creation timestamp (UTC) |
| `ModifiedDate` | `DATETIME2(3)` | No | `SYSUTCDATETIME()` | Last update timestamp (UTC) |

---

### Schema: `Inventory`
Stores product master catalog, categorization, and stock levels.

#### Table: `Inventory.Category`
* **Filegroup**: `DATA_FG`
* **Description**: Self-referencing hierarchical table for category trees.

| Column Name | Data Type | Nullable | Constraints & Description |
| :--- | :--- | :--- | :--- |
| `CategoryId` | `INT IDENTITY(1,1)` | No | Primary Key, clustered |
| `CategoryName` | `NVARCHAR(100)` | No | Unique category designation |
| `ParentCategoryId` | `INT` | Yes | Self-referencing FK (`FK_Category_Parent`) |

#### Table: `Inventory.Product`
* **Filegroup**: `DATA_FG`
* **Description**: Product catalog, unit pricing, and status.

| Column Name | Data Type | Nullable | Default / Rule | Constraints & Description |
| :--- | :--- | :--- | :--- | :--- |
| `ProductId` | `INT IDENTITY(1,1)` | No | Identity | Primary Key, clustered |
| `SKU` | `VARCHAR(30)` | No | None | Unique constraint (`UQ_Product_SKU`) |
| `ProductName` | `NVARCHAR(150)` | No | None | Commercial product title |
| `CategoryId` | `INT` | No | None | Foreign key (`FK_Product_Category`) |
| `UnitPrice` | `udt_Currency` | No | None | `DECIMAL(18,4)`, CHECK (`UnitPrice >= 0`) |
| `CostPrice` | `udt_Currency` | No | None | `DECIMAL(18,4)`, CHECK (`CostPrice >= 0`) |
| `IsActive` | `BIT` | No | `1` | Active operational status flag |
| `CreatedDate` | `DATETIME2(3)` | No | `SYSUTCDATETIME()` | Record creation timestamp |

---

### Schema: `Sales`
Stores order headers, line items, and partitioned invoices.

#### Table: `Sales.Orders`
* **Filegroup**: `DATA_FG`
* **Description**: Order transaction header.

| Column Name | Data Type | Nullable | Default / Rule | Constraints & Description |
| :--- | :--- | :--- | :--- | :--- |
| `OrderId` | `BIGINT IDENTITY(1,1)` | No | Identity | Primary Key, clustered |
| `OrderNumber` | `VARCHAR(30)` | No | None | Unique business identifier |
| `CustomerId` | `INT` | No | None | Foreign key (`FK_Orders_Customer`) |
| `OrderDate` | `DATETIME2(3)` | No | `SYSUTCDATETIME()` | Transaction order timestamp |
| `OrderStatus` | `udt_StatusCode` | No | `'PE'` | 'PE' (Pending), 'PR' (Processing), 'SH' (Shipped), 'CA' (Cancelled) |
| `SubTotal` | `udt_Currency` | No | `0.00` | Pre-tax line sum |
| `TaxAmount` | `udt_Currency` | No | `0.00` | Calculated sales tax |
| `FreightAmount` | `udt_Currency` | No | `0.00` | Shipping cost |
| `TotalAmount` | `udt_Currency` | No | None | Computed or validated column (`SubTotal + Tax + Freight`) |

#### Table: `Sales.OrderItems`
* **Filegroup**: `DATA_FG`
* **Description**: Individual lines associated with an order header.

| Column Name | Data Type | Nullable | Constraints & Description |
| :--- | :--- | :--- | :--- |
| `OrderItemId` | `BIGINT IDENTITY(1,1)` | No | Primary Key, clustered |
| `OrderId` | `BIGINT` | No | Foreign key (`FK_OrderItems_Orders`) ON DELETE CASCADE |
| `ProductId` | `INT` | No | Foreign key (`FK_OrderItems_Product`) |
| `Quantity` | `INT` | No | CHECK (`Quantity > 0`) |
| `UnitPrice` | `udt_Currency` | No | Unit sale price |
| `Discount` | `DECIMAL(5,2)` | No | CHECK (`Discount BETWEEN 0 AND 100`) |
| `LineTotal` | AS `(Quantity * UnitPrice * (1.0 - Discount/100.0))` PERSISTED | Computed persisted column |

#### Table: `Sales.Invoices`
* **Filegroup / Scheme**: `ps_InvoiceScheme(InvoiceDate)`
* **Description**: Partitioned financial billing documents.

| Column Name | Data Type | Nullable | Constraints & Description |
| :--- | :--- | :--- | :--- |
| `InvoiceId` | `BIGINT` | No | Composite PK component |
| `InvoiceDate` | `DATE` | No | Partitioning Column (Composite PK clustered) |
| `OrderId` | `BIGINT` | No | Foreign key reference to Sales.Orders |
| `InvoiceAmount`| `udt_Currency` | No | Invoiced financial amount |
| `PaymentStatus`| `VARCHAR(20)` | No | 'Unpaid', 'Paid', 'Refunded' |

---

### Schema: `Audit`
Stores change data capture traces, entity revisions, and DDL schema modifications.

#### Table: `Audit.OrderHistory`
* **Filegroup**: `DATA_FG` (or clustered columnstore)
* **Description**: Audit trail written via triggers/OUTPUT clause capturing row state snapshots.

---

## 2. OLAP Database: `OmniFlowDW` (Kimball Star Schema)

### Dimension: `dw.DimDate`
* **Grain**: 1 row per calendar day.
* **Attributes**: `DateKey` (`INT` YYYYMMDD), `FullDate`, `DayOfWeek`, `DayName`, `MonthNumber`, `MonthName`, `CalendarQuarter`, `CalendarYear`, `FiscalYear`, `IsWeekend`, `IsHoliday`.

### Dimension: `dw.DimCustomer`
* **Grain**: 1 row per customer version (Kimball Slowly Changing Dimension Type 2).
* **Attributes**: `CustomerSK` (Surrogate Key, `INT IDENTITY`), `CustomerBK` (Business Key, `INT`), `FirstName`, `LastName`, `Email`, `PostalCode`, `ValidFrom`, `ValidTo`, `IsCurrent`.

### Dimension: `dw.DimProduct`
* **Grain**: 1 row per product (SCD Type 1).
* **Attributes**: `ProductSK` (Surrogate Key, `INT IDENTITY`), `ProductBK` (Business SKU), `ProductName`, `CategoryName`, `UnitPrice`, `CostPrice`.

### Fact: `dw.FactSales`
* **Grain**: 1 row per transactional order line item.
* **Foreign Keys**: `DateKey`, `CustomerSK`, `ProductSK`.
* **Measures (Additive)**:
  * `Quantity` (`INT`)
  * `UnitPrice` (`DECIMAL(18,4)`)
  * `DiscountAmount` (`DECIMAL(18,4)`)
  * `GrossAmount` (`DECIMAL(18,4)`)
  * `NetAmount` (`DECIMAL(18,4)`)
  * `MarginAmount` (`NetAmount - (Quantity * CostPrice)`)
