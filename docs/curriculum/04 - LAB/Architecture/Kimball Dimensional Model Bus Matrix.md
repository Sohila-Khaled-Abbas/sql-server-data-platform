---
type: architecture-diagram
title: "Kimball Dimensional Model Bus Matrix"
tags:
  - architecture
  - dimensional-modeling
---

# Kimball Dimensional Model Bus Matrix & Star Schema

```mermaid
erDiagram
    FactSales }|..|| DimDate : "OrderDateKey"
    FactSales }|..|| DimCustomer : "CustomerKey"
    FactSales }|..|| DimProduct : "ProductKey"
    FactSales }|..|| DimTerritory : "TerritoryKey"

    FactSales {
        bigint SalesKey PK
        int OrderDateKey FK
        int CustomerKey FK
        int ProductKey FK
        int TerritoryKey FK
        int Quantity
        decimal UnitPrice
        decimal TotalAmount
    }

    DimCustomer {
        int CustomerKey PK
        int CustomerID BK
        nvarchar CustomerName
        nvarchar Segment
        datetime2 ValidFrom
        datetime2 ValidTo
        bit IsCurrent
    }

    DimProduct {
        int ProductKey PK
        int ProductID BK
        nvarchar ProductName
        nvarchar Category
        decimal StandardCost
    }

    DimDate {
        int DateKey PK
        date FullDate
        int CalendarYear
        int CalendarQuarter
        int MonthNumber
        nvarchar MonthName
    }

    DimTerritory {
        int TerritoryKey PK
        nvarchar RegionName
        nvarchar CountryCode
    }
```
