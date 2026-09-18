/**
 * In-browser WebAssembly Relational Database Engine
 * Powered by sql.js (WASM SQLite)
 * Pre-populates the MaharaTech Company Case Study and Kimball DW schemas
 */

import initSqlJs from 'sql.js';
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

let db = null;
let isReady = false;

// Sample queries for presets
export const PRESET_QUERIES = {
  company_hierarchy: `-- 1. Company Organization Hierarchy (Supervisors and Direct Reports)
SELECT 
    e.SSN,
    e.FName || ' ' || e.LName AS EmployeeName,
    e.Gender,
    e.Salary,
    d.DName AS Department,
    COALESCE(s.FName || ' ' || s.LName, 'Top Executive / None') AS Supervisor
FROM Employee e
LEFT JOIN Employee s ON e.SuperSSN = s.SSN
LEFT JOIN Department d ON e.Dno = d.DNum
ORDER BY e.Dno, e.Salary DESC;`,

  company_workload: `-- 2. Multi-Department Project Effort Matrix (M:N Aggregation)
SELECT 
    d.DName AS Department,
    p.PName AS ProjectName,
    p.City AS ProjectCity,
    COUNT(w.ESSN) AS AssignedEmployees,
    COALESCE(SUM(w.Hours), 0) AS TotalWeeklyHours
FROM Project p
JOIN Department d ON p.DNum = d.DNum
LEFT JOIN WorksOn w ON p.PNum = w.PNo
GROUP BY d.DName, p.PName, p.City
ORDER BY d.DName, TotalWeeklyHours DESC;`,

  company_dependents: `-- 3. Weak Entity Dependents & Employee Family Records
SELECT 
    e.FName || ' ' || e.LName AS EmployeeName,
    e.SSN AS ParentSSN,
    dp.DependentName,
    dp.Relationship,
    dp.Gender AS DependentGender,
    dp.BDate AS BirthDate
FROM Employee e
JOIN Dependent dp ON e.SSN = dp.ESSN
ORDER BY e.LName, dp.BDate;`,

  ititest_live: `-- 3b. ITItest Case Study: Querying live emp and depts tables (CH01_VID02)
SELECT 
    e.eid AS EmpID,
    e.ename AS EmployeeName,
    e.salary AS BaseSalary,
    e.overtime AS OvertimePay,
    e.netsal AS NetSalary,
    e.eadd AS Address,
    d.dname AS Department
FROM emp e
INNER JOIN depts d ON e.dnum = d.did
ORDER BY d.dname, e.salary DESC;`,

  dw_sales_summary: `-- 4. Kimball Star Schema: Monthly Revenue by Product Category
SELECT 
    d.CalendarYear,
    d.MonthName,
    p.CategoryName,
    COUNT(f.SalesKey) AS TotalOrders,
    SUM(f.Quantity) AS TotalUnitsSold,
    ROUND(SUM(f.NetSalesAmount), 2) AS TotalRevenue
FROM FactSales f
JOIN DimDate d ON f.DateKey = d.DateKey
JOIN DimProduct p ON f.ProductSK = p.ProductSK
GROUP BY d.CalendarYear, d.MonthName, p.CategoryName
ORDER BY d.CalendarYear DESC, TotalRevenue DESC;`,

  dw_customer_scd: `-- 5. Kimball Star Schema: SCD Type 2 Customer Relocations
SELECT 
    CustomerSK,
    CustomerId,
    CustomerName,
    PostalCode,
    ValidFrom,
    ValidTo,
    CASE WHEN IsCurrent = 1 THEN 'Active Version 🟢' ELSE 'Historical Version ⚪' END AS VersionStatus
FROM DimCustomer
ORDER BY CustomerId, CustomerSK;`,

  dept_locations: `-- 6. Department Multi-Valued Locations (1:N Sub-table)
SELECT 
    d.DNum,
    d.DName AS Department,
    m.FName || ' ' || m.LName AS Manager,
    GROUP_CONCAT(dl.Location, ', ') AS OfficeLocations
FROM Department d
JOIN Employee m ON d.MgrSSN = m.SSN
JOIN DeptLocations dl ON d.DNum = dl.DNum
GROUP BY d.DNum, d.DName, Manager;`
};

export async function initDatabase(onStatusUpdate) {
  if (isReady && db) return db;

  if (onStatusUpdate) onStatusUpdate('Initializing WebAssembly SQL Engine...');

  const wasmLocations = [
    // 1. Vite bundled asset URL
    () => sqlWasmUrl,
    // 2. Local public directory relative path
    () => './sql-wasm.wasm',
    // 3. Cloudflare CDN fallback
    () => 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/sql-wasm.wasm',
    // 4. jsDelivr CDN fallback
    () => 'https://cdn.jsdelivr.net/npm/sql.js@1.12.0/dist/sql-wasm.wasm'
  ];

  let lastError = null;
  let SQL = null;

  for (let i = 0; i < wasmLocations.length; i++) {
    try {
      const locateFn = wasmLocations[i];
      SQL = await initSqlJs({
        locateFile: (file) => {
          if (file.endsWith('.wasm')) {
            return locateFn();
          }
          return file;
        }
      });
      if (SQL) break;
    } catch (err) {
      console.warn(`WASM candidate ${i + 1} failed:`, err);
      lastError = err;
    }
  }

  if (!SQL) {
    console.error('All WASM locations failed to initialize:', lastError);
    throw lastError || new Error('Failed to initialize WebAssembly SQL engine.');
  }

  try {
    db = new SQL.Database();

    if (onStatusUpdate) onStatusUpdate('Bootstrapping Company Case Study Schema...');
    seedCompanyDatabase(db);

    if (onStatusUpdate) onStatusUpdate('Bootstrapping Kimball DW Star Schema...');
    seedKimballDW(db);

    isReady = true;
    if (onStatusUpdate) onStatusUpdate('Engine Online (sql.js WASM) 🟢');
    return db;
  } catch (err) {
    console.error('Failed to bootstrap database schemas:', err);
    throw err;
  }
}

function seedCompanyDatabase(database) {
  const schemaSQL = `
    -- 1. Departments
    CREATE TABLE Department (
        DNum INTEGER PRIMARY KEY,
        DName TEXT NOT NULL UNIQUE,
        MgrSSN TEXT,
        MgrHireDate TEXT
    );

    -- 2. Employees
    CREATE TABLE Employee (
        SSN TEXT PRIMARY KEY,
        FName TEXT NOT NULL,
        MInit TEXT,
        LName TEXT NOT NULL,
        BDate TEXT,
        Gender TEXT CHECK(Gender IN ('M', 'F')),
        Salary REAL NOT NULL,
        SuperSSN TEXT,
        Dno INTEGER REFERENCES Department(DNum)
    );

    -- 3. Department Locations (Multi-Valued Attribute)
    CREATE TABLE DeptLocations (
        DNum INTEGER REFERENCES Department(DNum),
        Location TEXT NOT NULL,
        PRIMARY KEY (DNum, Location)
    );

    -- 4. Projects
    CREATE TABLE Project (
        PNum INTEGER PRIMARY KEY,
        PName TEXT NOT NULL UNIQUE,
        City TEXT NOT NULL,
        Location TEXT,
        DNum INTEGER REFERENCES Department(DNum)
    );

    -- 5. WorksOn (M:N associative table with Hours)
    CREATE TABLE WorksOn (
        ESSN TEXT REFERENCES Employee(SSN),
        PNo INTEGER REFERENCES Project(PNum),
        Hours REAL,
        PRIMARY KEY (ESSN, PNo)
    );

    -- 6. Dependent (Weak Entity)
    CREATE TABLE Dependent (
        ESSN TEXT REFERENCES Employee(SSN),
        DependentName TEXT NOT NULL,
        Gender TEXT,
        BDate TEXT,
        Relationship TEXT NOT NULL,
        PRIMARY KEY (ESSN, DependentName)
    );

    -- 7. Live SSMS Wizard Tables: depts & emp (CH01_VID02)
    CREATE TABLE depts (
        did INTEGER PRIMARY KEY,
        dname TEXT
    );

    CREATE TABLE emp (
        eid INTEGER PRIMARY KEY AUTOINCREMENT,
        ename TEXT NOT NULL,
        eadd TEXT DEFAULT 'cairo',
        hiredate TEXT DEFAULT (DATE('now')),
        salary INTEGER,
        overtime INTEGER,
        netsal INTEGER,
        bd TEXT,
        age INTEGER,
        hour_rate INTEGER,
        gender TEXT,
        dnum INTEGER REFERENCES depts(did)
    );

    -- Seed Departments
    INSERT INTO Department VALUES (1, 'Headquarters', '888665555', '2020-06-19');
    INSERT INTO Department VALUES (4, 'Administration', '987654321', '2021-01-01');
    INSERT INTO Department VALUES (5, 'Research', '333445555', '2018-05-22');

    -- Seed Live depts & emp (CH01_VID02)
    INSERT INTO depts VALUES (10, 'IT & Engineering');
    INSERT INTO depts VALUES (20, 'Data Platforms');
    INSERT INTO depts VALUES (30, 'Operations');

    INSERT INTO emp (ename, eadd, salary, overtime, netsal, bd, age, hour_rate, gender, dnum)
    VALUES ('Ahmed', 'Cairo', 12000, 1500, 13500, '1996-05-12', 28, 75, 'M', 10);
    INSERT INTO emp (ename, eadd, salary, overtime, netsal, bd, age, hour_rate, gender, dnum)
    VALUES ('Sara', 'Alexandria', 14000, 2000, 16000, '1994-08-20', 30, 85, 'F', 20);
    INSERT INTO emp (ename, eadd, salary, overtime, netsal, bd, age, hour_rate, gender, dnum)
    VALUES ('Mahmoud', 'Giza', 11000, 1000, 12000, '1998-02-14', 26, 70, 'M', 10);

    -- Seed Employees
    INSERT INTO Employee VALUES ('888665555', 'James', 'E', 'Borg', '1967-11-10', 'M', 55000, NULL, 1);
    INSERT INTO Employee VALUES ('333445555', 'Franklin', 'T', 'Wong', '1985-12-08', 'M', 40000, '888665555', 5);
    INSERT INTO Employee VALUES ('987654321', 'Jennifer', 'S', 'Wallace', '1971-06-20', 'F', 43000, '888665555', 4);
    INSERT INTO Employee VALUES ('123456789', 'John', 'B', 'Smith', '1995-01-09', 'M', 30000, '333445555', 5);
    INSERT INTO Employee VALUES ('666884444', 'Ramesh', 'K', 'Narayan', '1992-09-15', 'M', 38000, '333445555', 5);
    INSERT INTO Employee VALUES ('453453453', 'Joyce', 'A', 'English', '2002-07-31', 'F', 25000, '333445555', 5);
    INSERT INTO Employee VALUES ('987987987', 'Ahmad', 'V', 'Jabbar', '1989-03-29', 'M', 25000, '987654321', 4);
    INSERT INTO Employee VALUES ('999887777', 'Alicia', 'J', 'Zelaya', '1998-07-19', 'F', 25000, '987654321', 4);

    -- Seed Dept Locations
    INSERT INTO DeptLocations VALUES (1, 'Houston');
    INSERT INTO DeptLocations VALUES (4, 'Stafford');
    INSERT INTO DeptLocations VALUES (5, 'Bellaire');
    INSERT INTO DeptLocations VALUES (5, 'Sugarland');
    INSERT INTO DeptLocations VALUES (5, 'Houston');

    -- Seed Projects
    INSERT INTO Project VALUES (1, 'ProductX', 'Bellaire', 'Bellaire Center', 5);
    INSERT INTO Project VALUES (2, 'ProductY', 'Sugarland', 'Sugarland Park', 5);
    INSERT INTO Project VALUES (3, 'ProductZ', 'Houston', 'HQ Lab', 5);
    INSERT INTO Project VALUES (10, 'Computerization', 'Stafford', 'Admin Block', 4);
    INSERT INTO Project VALUES (20, 'Reorganization', 'Houston', 'HQ Tower', 1);
    INSERT INTO Project VALUES (30, 'Newbenefits', 'Stafford', 'Benefits Office', 4);

    -- Seed WorksOn
    INSERT INTO WorksOn VALUES ('123456789', 1, 32.5);
    INSERT INTO WorksOn VALUES ('123456789', 2, 7.5);
    INSERT INTO WorksOn VALUES ('666884444', 3, 40.0);
    INSERT INTO WorksOn VALUES ('453453453', 1, 20.0);
    INSERT INTO WorksOn VALUES ('453453453', 2, 20.0);
    INSERT INTO WorksOn VALUES ('333445555', 2, 10.0);
    INSERT INTO WorksOn VALUES ('333445555', 3, 10.0);
    INSERT INTO WorksOn VALUES ('333445555', 10, 10.0);
    INSERT INTO WorksOn VALUES ('333445555', 20, 10.0);
    INSERT INTO WorksOn VALUES ('999887777', 30, 30.0);
    INSERT INTO WorksOn VALUES ('999887777', 10, 10.0);
    INSERT INTO WorksOn VALUES ('987987987', 10, 35.0);
    INSERT INTO WorksOn VALUES ('987987987', 30, 5.0);
    INSERT INTO WorksOn VALUES ('987654321', 30, 20.0);
    INSERT INTO WorksOn VALUES ('987654321', 20, 15.0);
    INSERT INTO WorksOn VALUES ('888665555', 20, 0.0);

    -- Seed Dependents
    INSERT INTO Dependent VALUES ('333445555', 'Alice', 'F', '2016-04-05', 'Daughter');
    INSERT INTO Dependent VALUES ('333445555', 'Theodore', 'M', '2013-10-25', 'Son');
    INSERT INTO Dependent VALUES ('333445555', 'Joy', 'F', '1988-05-03', 'Spouse');
    INSERT INTO Dependent VALUES ('987654321', 'Abner', 'M', '1972-02-28', 'Spouse');
    INSERT INTO Dependent VALUES ('123456789', 'Michael', 'M', '2018-01-04', 'Son');
    INSERT INTO Dependent VALUES ('123456789', 'Alice', 'F', '2020-12-30', 'Daughter');
    INSERT INTO Dependent VALUES ('123456789', 'Elizabeth', 'F', '1997-05-05', 'Spouse');
  `;
  database.run(schemaSQL);
}

function seedKimballDW(database) {
  const dwSQL = `
    -- Kimball Star Schema Tables
    CREATE TABLE DimCustomer (
        CustomerSK INTEGER PRIMARY KEY AUTOINCREMENT,
        CustomerId INTEGER NOT NULL,
        CustomerName TEXT NOT NULL,
        PostalCode TEXT,
        ValidFrom TEXT NOT NULL,
        ValidTo TEXT,
        IsCurrent INTEGER NOT NULL
    );

    CREATE TABLE DimProduct (
        ProductSK INTEGER PRIMARY KEY AUTOINCREMENT,
        ProductId INTEGER NOT NULL,
        ProductName TEXT NOT NULL,
        CategoryName TEXT NOT NULL,
        UnitPrice REAL NOT NULL
    );

    CREATE TABLE DimDate (
        DateKey INTEGER PRIMARY KEY,
        FullDate TEXT NOT NULL,
        CalendarYear INTEGER NOT NULL,
        CalendarQuarter INTEGER NOT NULL,
        MonthName TEXT NOT NULL,
        DayOfWeek TEXT NOT NULL
    );

    CREATE TABLE FactSales (
        SalesKey INTEGER PRIMARY KEY AUTOINCREMENT,
        DateKey INTEGER REFERENCES DimDate(DateKey),
        CustomerSK INTEGER REFERENCES DimCustomer(CustomerSK),
        ProductSK INTEGER REFERENCES DimProduct(ProductSK),
        Quantity INTEGER NOT NULL,
        UnitPrice REAL NOT NULL,
        DiscountAmount REAL NOT NULL,
        NetSalesAmount REAL NOT NULL
    );

    -- Seed DimCustomer (SCD Type 2)
    INSERT INTO DimCustomer VALUES (1, 101, 'Acme Retail Corp', '90210', '2022-01-01', '2024-06-15', 0);
    INSERT INTO DimCustomer VALUES (2, 101, 'Acme Retail Corp', '10001', '2024-06-15', NULL, 1);
    INSERT INTO DimCustomer VALUES (3, 102, 'Apex Global Logistics', '77001', '2023-03-01', NULL, 1);
    INSERT INTO DimCustomer VALUES (4, 103, 'Cairo Energy Solutions', '11511', '2022-08-10', NULL, 1);
    INSERT INTO DimCustomer VALUES (5, 104, 'Nile Valley Tech', '12613', '2024-01-15', NULL, 1);

    -- Seed DimProduct
    INSERT INTO DimProduct VALUES (1, 501, 'Enterprise NVMe Array', 'Storage', 2499.00);
    INSERT INTO DimProduct VALUES (2, 502, 'Rackmount Server 2U', 'Hardware', 4899.00);
    INSERT INTO DimProduct VALUES (3, 503, '10GbE Switch 24-Port', 'Networking', 899.00);
    INSERT INTO DimProduct VALUES (4, 504, 'SQL Server 2022 Core Lic', 'Software', 3599.00);

    -- Seed DimDate
    INSERT INTO DimDate VALUES (20260115, '2026-01-15', 2026, 1, 'January', 'Thursday');
    INSERT INTO DimDate VALUES (20260220, '2026-02-20', 2026, 1, 'February', 'Friday');
    INSERT INTO DimDate VALUES (20260310, '2026-03-10', 2026, 1, 'March', 'Tuesday');
    INSERT INTO DimDate VALUES (20260405, '2026-04-05', 2026, 2, 'April', 'Sunday');
    INSERT INTO DimDate VALUES (20260512, '2026-05-12', 2026, 2, 'May', 'Tuesday');

    -- Seed FactSales
    INSERT INTO FactSales VALUES (1, 20260115, 2, 1, 4, 2499.00, 200.00, 9796.00);
    INSERT INTO FactSales VALUES (2, 20260115, 3, 2, 2, 4899.00, 0.00, 9798.00);
    INSERT INTO FactSales VALUES (3, 20260220, 4, 3, 8, 899.00, 150.00, 7042.00);
    INSERT INTO FactSales VALUES (4, 20260310, 5, 4, 5, 3599.00, 500.00, 17495.00);
    INSERT INTO FactSales VALUES (5, 20260405, 2, 2, 3, 4899.00, 300.00, 14397.00);
    INSERT INTO FactSales VALUES (6, 20260512, 3, 1, 6, 2499.00, 400.00, 14594.00);
  `;
  database.run(dwSQL);
}

export function executeQuery(sqlString) {
  if (!db) {
    return { columns: [], values: [], rowCount: 0, executionTimeMs: 0, error: 'Database engine not initialized.' };
  }

  const startTime = performance.now();
  try {
    const results = db.exec(sqlString);
    const duration = Math.round(performance.now() - startTime);

    if (!results || results.length === 0) {
      return { columns: [], values: [], rowCount: 0, executionTimeMs: duration, error: null, message: 'Statement executed successfully. No rows returned.' };
    }

    const firstResult = results[0];
    return {
      columns: firstResult.columns,
      values: firstResult.values,
      rowCount: firstResult.values.length,
      executionTimeMs: duration,
      error: null
    };
  } catch (err) {
    const duration = Math.round(performance.now() - startTime);
    return {
      columns: [],
      values: [],
      rowCount: 0,
      executionTimeMs: duration,
      error: err.message
    };
  }
}
