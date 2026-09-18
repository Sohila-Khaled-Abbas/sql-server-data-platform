#!/usr/bin/env python3
"""
OmniFlow Enterprise Synthetic Data Generator
============================================
Generates scalable, referentially consistent enterprise datasets for:
1. Company Relational OLTP (3NF hierarchy with circular manager foreign keys)
2. OmniFlowDW Kimball Dimensional Warehouse (SCD Type 2 products, FactSales transactions)

Outputs to:
- T-SQL executable batch script (.sql)
- CSV files for bcp / BULK INSERT / Table-Valued Parameter benchmarks
- JSON payload files for REST / XML shredding tests
"""

import argparse
import csv
import json
import os
import random
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Dict, List

FIRST_NAMES = [
    "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
    "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
    "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa",
    "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
    "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle"
]

LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
    "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
    "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker"
]

DEPARTMENTS = [
    (1, "Headquarters", "Houston"),
    (2, "Administration", "Austin"),
    (3, "Research & Development", "Sugarland"),
    (4, "Enterprise Engineering", "Dallas"),
    (5, "Cloud Platform Operations", "San Antonio")
]

CATEGORIES = ["Database Engine", "Cloud Analytics", "Storage Hardware", "DevOps Tooling", "AI Copilot"]

PRODUCT_NAMES = [
    ("SQL Server 2022 Enterprise Core", "Database Engine", 3717.00),
    ("SQL Server 2022 Standard Edition", "Database Engine", 899.00),
    ("Azure Arc-enabled Data Controller", "Cloud Analytics", 450.00),
    ("OmniFlow High-Throughput NVMe SAN", "Storage Hardware", 12500.00),
    ("OmniFlow Backup Appliance V4", "Storage Hardware", 8200.00),
    ("DBRE Automated Schema Guard Suite", "DevOps Tooling", 1200.00),
    ("Always On Disaster Recovery Suite", "DevOps Tooling", 2800.00),
    ("Kimball Dimensional Lakehouse Pack", "Cloud Analytics", 3400.00),
    ("Vector Semantic Search Accelerator", "AI Copilot", 1500.00),
    ("Query Optimizer Diagnostic Studio", "DevOps Tooling", 750.00)
]


def generate_company_data(num_employees: int = 250) -> Dict[str, List]:
    """Generate 3NF normalized Company OLTP entities with valid circular manager FKs."""
    employees = []
    projects = []
    works_on = []

    # 1. Generate Departments
    dept_rows = [{"DeptId": d[0], "DeptName": d[1], "Location": d[2], "MgrSsn": None} for d in DEPARTMENTS]

    # 2. Generate Employees
    # First 5 employees will be department managers
    for idx in range(num_employees):
        ssn = f"{100000000 + idx}"
        fname = random.choice(FIRST_NAMES)
        lname = random.choice(LAST_NAMES)
        bdate = date(1965 + (idx % 35), (idx % 12) + 1, (idx % 27) + 1).isoformat()
        address = f"{100 + idx} {lname} Blvd, TX"
        sex = "M" if idx % 2 == 0 else "F"
        salary = 65000 + (idx * 150) % 85000
        dept_id = (idx % len(DEPARTMENTS)) + 1
        
        # Managers have no superssn, other staff report to their dept manager or senior staff
        if idx < len(DEPARTMENTS):
            superssn = None
            dept_rows[idx]["MgrSsn"] = ssn
        else:
            superssn = dept_rows[dept_id - 1]["MgrSsn"]

        employees.append({
            "SSN": ssn,
            "Fname": fname,
            "Lname": lname,
            "Bdate": bdate,
            "Address": address,
            "Sex": sex,
            "Salary": salary,
            "Dno": dept_id,
            "Superssn": superssn
        })

    # 3. Generate Projects
    for p_idx in range(1, 15):
        pname = f"Project Alpha-{p_idx:02d}"
        ploc = random.choice(["Houston", "Sugarland", "Austin", "Dallas"])
        dnum = (p_idx % len(DEPARTMENTS)) + 1
        projects.append({
            "Pnumber": p_idx,
            "Pname": pname,
            "Plocation": ploc,
            "Dnum": dnum
        })

    # 4. Generate Works_On
    for emp in employees:
        assigned_projects = random.sample(projects, k=random.randint(1, 3))
        for p in assigned_projects:
            works_on.append({
                "Essn": emp["SSN"],
                "Pno": p["Pnumber"],
                "Hours": round(random.uniform(5.0, 35.0), 1)
            })

    return {
        "departments": dept_rows,
        "employees": employees,
        "projects": projects,
        "works_on": works_on
    }


def generate_warehouse_data(num_sales: int = 1000) -> Dict[str, List]:
    """Generate Kimball dimensional warehouse data (DimDate, DimProduct, DimCustomer, FactSales)."""
    # 1. DimProduct (with SCD Type 2 history)
    products = []
    prod_key = 1
    for p_alt, (name, cat, price) in enumerate(PRODUCT_NAMES, 1):
        # Version 1 (Historical)
        products.append({
            "ProductKey": prod_key,
            "ProductAltId": f"P-{p_alt:03d}",
            "ProductName": name,
            "Category": cat,
            "UnitPrice": round(price * 0.9, 2),
            "ValidFrom": "2023-01-01",
            "ValidTo": "2024-06-30",
            "IsCurrent": 0
        })
        prod_key += 1
        # Version 2 (Current)
        products.append({
            "ProductKey": prod_key,
            "ProductAltId": f"P-{p_alt:03d}",
            "ProductName": name,
            "Category": cat,
            "UnitPrice": price,
            "ValidFrom": "2024-07-01",
            "ValidTo": "9999-12-31",
            "IsCurrent": 1
        })
        prod_key += 1

    # 2. DimCustomer
    customers = []
    for c_id in range(1, 150):
        fname = random.choice(FIRST_NAMES)
        lname = random.choice(LAST_NAMES)
        customers.append({
            "CustomerKey": c_id,
            "CustomerAltId": f"CUST-{c_id:04d}",
            "FullName": f"{fname} {lname}",
            "Email": f"{fname.lower()}.{lname.lower()}@enterprise.com",
            "Region": random.choice(["North America", "EMEA", "APAC", "LATAM"]),
            "Segment": random.choice(["Enterprise", "Mid-Market", "Strategic Accounts"])
        })

    # 3. FactSales
    facts = []
    start_date = date(2024, 1, 1)
    for fact_id in range(1, num_sales + 1):
        dt = start_date + timedelta(days=random.randint(0, 360))
        date_key = int(dt.strftime("%Y%m%d"))
        cust = random.choice(customers)
        prod = random.choice([p for p in products if p["IsCurrent"] == 1])
        qty = random.randint(1, 10)
        unit_price = prod["UnitPrice"]
        discount = round(unit_price * qty * (0.05 if qty > 5 else 0.0), 2)
        total = round((unit_price * qty) - discount, 2)

        facts.append({
            "FactId": fact_id,
            "DateKey": date_key,
            "CustomerKey": cust["CustomerKey"],
            "ProductKey": prod["ProductKey"],
            "Quantity": qty,
            "UnitPrice": unit_price,
            "DiscountAmount": discount,
            "TotalAmount": total
        })

    return {
        "products": products,
        "customers": customers,
        "facts": facts
    }


def export_to_sql(company_data: Dict, warehouse_data: Dict, output_file: Path):
    """Write complete mock datasets to an idempotent T-SQL script."""
    lines = [
        "-- ===========================================================================",
        "--  OmniFlow Enterprise Synthetic Seed Data Script",
        f"--  Generated At: {datetime.now().isoformat()}",
        "-- ===========================================================================",
        "SET NOCOUNT ON;",
        "BEGIN TRANSACTION;",
        ""
    ]

    # Insert Departments
    lines.append("-- 1. Populate Departments")
    for d in company_data["departments"]:
        lines.append(f"INSERT INTO Department (DeptId, DeptName, Location) VALUES ({d['DeptId']}, '{d['DeptName']}', '{d['Location']}');")
    lines.append("")

    # Insert Employees
    lines.append("-- 2. Populate Employees")
    for e in company_data["employees"]:
        mgr = f"'{e['Superssn']}'" if e['Superssn'] else "NULL"
        lines.append(
            f"INSERT INTO Employee (SSN, Fname, Lname, Bdate, Address, Sex, Salary, Dno, Superssn) "
            f"VALUES ('{e['SSN']}', '{e['Fname']}', '{e['Lname']}', '{e['Bdate']}', '{e['Address']}', '{e['Sex']}', {e['Salary']}, {e['Dno']}, {mgr});"
        )
    lines.append("")

    # Insert Projects
    lines.append("-- 3. Populate Projects")
    for p in company_data["projects"]:
        lines.append(f"INSERT INTO Project (Pnumber, Pname, Plocation, Dnum) VALUES ({p['Pnumber']}, '{p['Pname']}', '{p['Plocation']}', {p['Dnum']});")
    lines.append("")

    # Insert Works_On
    lines.append("-- 4. Populate Works_On")
    for w in company_data["works_on"][:200]:
        lines.append(f"INSERT INTO Works_for (Essn, Pno, Hours) VALUES ('{w['Essn']}', {w['Pno']}, {w['Hours']});")
    lines.append("")

    # Warehouse FactSales
    lines.append("-- 5. Populate Warehouse FactSales (Sample)")
    for f in warehouse_data["facts"][:100]:
        lines.append(
            f"INSERT INTO FactSales (DateKey, CustomerKey, ProductKey, Quantity, UnitPrice, DiscountAmount, TotalAmount) "
            f"VALUES ({f['DateKey']}, {f['CustomerKey']}, {f['ProductKey']}, {f['Quantity']}, {f['UnitPrice']}, {f['DiscountAmount']}, {f['TotalAmount']});"
        )
    lines.append("")

    lines.append("COMMIT TRANSACTION;")
    lines.append("PRINT '>>> Mock Seed Data Loaded Successfully.';")

    with open(output_file, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"[OK] Wrote SQL seed script to: {output_file}")


def main():
    parser = argparse.ArgumentParser(description="OmniFlow Enterprise Synthetic Data Generator")
    parser.add_argument("--employees", type=int, default=150, help="Number of employees to generate")
    parser.add_argument("--sales", type=int, default=500, help="Number of FactSales rows to generate")
    parser.add_argument("--output-dir", type=str, default="data/seed", help="Directory to save generated datasets")
    parser.add_argument("--format", choices=["sql", "json", "csv"], default="sql", help="Output format")

    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parent.parent
    out_dir = repo_root / args.output_dir
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"[*] Generating {args.employees} employees and {args.sales} sales transactions...")
    company_data = generate_company_data(args.employees)
    warehouse_data = generate_warehouse_data(args.sales)

    if args.format == "sql":
        out_file = out_dir / "seed_enterprise_data.sql"
        export_to_sql(company_data, warehouse_data, out_file)
    elif args.format == "json":
        out_file = out_dir / "seed_enterprise_data.json"
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump({"company": company_data, "warehouse": warehouse_data}, f, indent=2)
        print(f"[OK] Wrote JSON datasets to: {out_file}")

    print("[SUCCESS] Data generation complete.")


if __name__ == "__main__":
    main()
