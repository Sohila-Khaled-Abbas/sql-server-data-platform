import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initDatabase, executeQuery, PRESET_QUERIES } from '../db/engine.js';

const DatabaseContext = createContext(null);

export const SCHEMA_TREE = {
  databases: [
    {
      id: 'company',
      name: 'ITItest (Case Study 3NF)',
      type: 'OLTP',
      storagePath: 'D:\\courses\\Data Science\\Data Engineering\\MaharaTech\\Implementing and Developing SQL server objects\\CH01\\Mydb',
      tables: [
        {
          name: 'emp',
          filegroup: 'fg2',
          rowCount: 0,
          description: 'Live case study employee table created in SSMS Wizard (CH01_VID02)',
          columns: [
            { name: 'eid', type: 'INT', isPk: true, isFk: false, isIdentity: true },
            { name: 'ename', type: 'VARCHAR(50)', isPk: false, isFk: false },
            { name: 'eadd', type: 'VARCHAR(50)', isPk: false, isFk: false, default: "'cairo'" },
            { name: 'hiredate', type: 'DATE', isPk: false, isFk: false, default: 'getdate()' },
            { name: 'salary', type: 'INT', isPk: false, isFk: false },
            { name: 'overtime', type: 'INT', isPk: false, isFk: false },
            { name: 'netsal', type: 'INT', isPk: false, isFk: false },
            { name: 'bd', type: 'DATE', isPk: false, isFk: false },
            { name: 'age', type: 'INT', isPk: false, isFk: false },
            { name: 'hour_rate', type: 'INT', isPk: false, isFk: false },
            { name: 'gender', type: 'VARCHAR(1)', isPk: false, isFk: false },
            { name: 'dnum', type: 'INT', isPk: false, isFk: true, ref: 'depts.did' }
          ]
        },
        {
          name: 'depts',
          filegroup: 'fg1',
          rowCount: 0,
          description: 'Live case study department table created in SSMS Wizard (CH01_VID02)',
          columns: [
            { name: 'did', type: 'INT', isPk: true, isFk: false },
            { name: 'dname', type: 'VARCHAR(50)', isPk: false, isFk: false }
          ]
        },
        {
          name: 'Employee',
          rowCount: 8,
          description: 'Core employee entity with recursive supervision',
          columns: [
            { name: 'SSN', type: 'CHAR(9)', isPk: true, isFk: false },
            { name: 'FName', type: 'VARCHAR(50)', isPk: false, isFk: false },
            { name: 'LName', type: 'VARCHAR(50)', isPk: false, isFk: false },
            { name: 'BDate', type: 'DATE', isPk: false, isFk: false },
            { name: 'Address', type: 'VARCHAR(120)', isPk: false, isFk: false },
            { name: 'Gender', type: 'CHAR(1)', isPk: false, isFk: false },
            { name: 'Salary', type: 'DECIMAL(12,2)', isPk: false, isFk: false },
            { name: 'Dno', type: 'INT', isPk: false, isFk: true, ref: 'Department.DNum' },
            { name: 'SuperSSN', type: 'CHAR(9)', isPk: false, isFk: true, ref: 'Employee.SSN' }
          ]
        },
        {
          name: 'Department',
          rowCount: 3,
          description: 'Departmental organizational unit with manager assignment',
          columns: [
            { name: 'DNum', type: 'INT', isPk: true, isFk: false },
            { name: 'DName', type: 'VARCHAR(50)', isPk: false, isFk: false },
            { name: 'MgrSSN', type: 'CHAR(9)', isPk: false, isFk: true, ref: 'Employee.SSN' },
            { name: 'MgrStartDate', type: 'DATE', isPk: false, isFk: false }
          ]
        },
        {
          name: 'DeptLocations',
          rowCount: 5,
          description: 'Multi-valued location attribute normalized to 1NF',
          columns: [
            { name: 'DNum', type: 'INT', isPk: true, isFk: true, ref: 'Department.DNum' },
            { name: 'DLocation', type: 'VARCHAR(50)', isPk: true, isFk: false }
          ]
        },
        {
          name: 'Project',
          rowCount: 6,
          description: 'Operational enterprise projects controlled by departments',
          columns: [
            { name: 'PNum', type: 'INT', isPk: true, isFk: false },
            { name: 'PName', type: 'VARCHAR(50)', isPk: false, isFk: false },
            { name: 'City', type: 'VARCHAR(50)', isPk: false, isFk: false },
            { name: 'DNum', type: 'INT', isPk: false, isFk: true, ref: 'Department.DNum' }
          ]
        },
        {
          name: 'WorksOn',
          rowCount: 16,
          description: 'Associative junction relation (M:N) for project effort',
          columns: [
            { name: 'ESSN', type: 'CHAR(9)', isPk: true, isFk: true, ref: 'Employee.SSN' },
            { name: 'PNo', type: 'INT', isPk: true, isFk: true, ref: 'Project.PNum' },
            { name: 'Hours', type: 'DECIMAL(5,1)', isPk: false, isFk: false }
          ]
        },
        {
          name: 'Dependent',
          rowCount: 7,
          description: 'Weak entity identified by parent employee SSN',
          columns: [
            { name: 'ESSN', type: 'CHAR(9)', isPk: true, isFk: true, ref: 'Employee.SSN' },
            { name: 'DependentName', type: 'VARCHAR(50)', isPk: true, isFk: false },
            { name: 'Gender', type: 'CHAR(1)', isPk: false, isFk: false },
            { name: 'BDate', type: 'DATE', isPk: false, isFk: false },
            { name: 'Relationship', type: 'VARCHAR(25)', isPk: false, isFk: false }
          ]
        }
      ]
    },
    {
      id: 'omniflow_dw',
      name: 'OmniFlowDW (Kimball Star)',
      type: 'OLAP',
      tables: [
        {
          name: 'FactSales',
          rowCount: 30,
          description: 'Central transaction fact table with additive measures',
          columns: [
            { name: 'SalesKey', type: 'INT', isPk: true, isFk: false },
            { name: 'DateKey', type: 'INT', isPk: false, isFk: true, ref: 'DimDate.DateKey' },
            { name: 'CustomerKey', type: 'INT', isPk: false, isFk: true, ref: 'DimCustomer.CustomerKey' },
            { name: 'ProductKey', type: 'INT', isPk: false, isFk: true, ref: 'DimProduct.ProductKey' },
            { name: 'TerritoryKey', type: 'INT', isPk: false, isFk: true, ref: 'DimTerritory.TerritoryKey' },
            { name: 'OrderNumber', type: 'VARCHAR(20)', isPk: false, isFk: false },
            { name: 'Quantity', type: 'INT', isPk: false, isFk: false },
            { name: 'UnitPrice', type: 'DECIMAL(12,2)', isPk: false, isFk: false },
            { name: 'DiscountAmount', type: 'DECIMAL(12,2)', isPk: false, isFk: false },
            { name: 'NetSalesAmount', type: 'DECIMAL(12,2)', isPk: false, isFk: false },
            { name: 'TaxAmount', type: 'DECIMAL(12,2)', isPk: false, isFk: false }
          ]
        },
        {
          name: 'DimCustomer',
          rowCount: 6,
          description: 'Customer dimension with SCD Type 2 historical versioning',
          columns: [
            { name: 'CustomerKey', type: 'INT', isPk: true, isFk: false },
            { name: 'CustomerID', type: 'VARCHAR(15)', isPk: false, isFk: false },
            { name: 'FullName', type: 'VARCHAR(100)', isPk: false, isFk: false },
            { name: 'Email', type: 'VARCHAR(100)', isPk: false, isFk: false },
            { name: 'City', type: 'VARCHAR(50)', isPk: false, isFk: false },
            { name: 'StateProvince', type: 'VARCHAR(50)', isPk: false, isFk: false },
            { name: 'Country', type: 'VARCHAR(50)', isPk: false, isFk: false },
            { name: 'EffectiveDate', type: 'DATE', isPk: false, isFk: false },
            { name: 'ExpirationDate', type: 'DATE', isPk: false, isFk: false },
            { name: 'IsCurrent', type: 'BIT', isPk: false, isFk: false }
          ]
        },
        {
          name: 'DimProduct',
          rowCount: 6,
          description: 'Conformed product hierarchy dimension',
          columns: [
            { name: 'ProductKey', type: 'INT', isPk: true, isFk: false },
            { name: 'ProductID', type: 'VARCHAR(20)', isPk: false, isFk: false },
            { name: 'ProductName', type: 'VARCHAR(100)', isPk: false, isFk: false },
            { name: 'CategoryName', type: 'VARCHAR(50)', isPk: false, isFk: false },
            { name: 'Color', type: 'VARCHAR(20)', isPk: false, isFk: false },
            { name: 'ListPrice', type: 'DECIMAL(10,2)', isPk: false, isFk: false },
            { name: 'StandardCost', type: 'DECIMAL(10,2)', isPk: false, isFk: false }
          ]
        },
        {
          name: 'DimDate',
          rowCount: 12,
          description: 'Conformed enterprise date calendar dimension',
          columns: [
            { name: 'DateKey', type: 'INT', isPk: true, isFk: false },
            { name: 'FullDate', type: 'DATE', isPk: false, isFk: false },
            { name: 'DayOfWeek', type: 'VARCHAR(15)', isPk: false, isFk: false },
            { name: 'MonthName', type: 'VARCHAR(20)', isPk: false, isFk: false },
            { name: 'CalendarQuarter', type: 'TINYINT', isPk: false, isFk: false },
            { name: 'CalendarYear', type: 'SMALLINT', isPk: false, isFk: false }
          ]
        },
        {
          name: 'DimTerritory',
          rowCount: 4,
          description: 'Sales territory geographic dimension',
          columns: [
            { name: 'TerritoryKey', type: 'INT', isPk: true, isFk: false },
            { name: 'TerritoryName', type: 'VARCHAR(50)', isPk: false, isFk: false },
            { name: 'CountryRegion', type: 'VARCHAR(50)', isPk: false, isFk: false },
            { name: 'SalesGroup', type: 'VARCHAR(50)', isPk: false, isFk: false }
          ]
        }
      ]
    }
  ]
};

export function DatabaseProvider({ children }) {
  const [engineStatus, setEngineStatus] = useState('initializing');
  const [engineStatusText, setEngineStatusText] = useState('Initializing SQL Server WASM Engine...');
  const [lastQuery, setLastQuery] = useState(PRESET_QUERIES.company_hierarchy);

  useEffect(() => {
    let mounted = true;
    initDatabase((status) => {
      if (!mounted) return;
      setEngineStatusText(status);
      if (status.includes('Online')) {
        setEngineStatus('online');
      } else if (status.includes('fallback') || status.includes('Offline')) {
        setEngineStatus('fallback');
      }
    }).then(() => {
      if (mounted) {
        setEngineStatus('online');
        setEngineStatusText('SQL Server Engine Ready (WASM)');
      }
    }).catch((err) => {
      if (mounted) {
        console.error('Engine initialization error:', err);
        setEngineStatus('offline');
        setEngineStatusText('Engine Offline (WASM fallback)');
      }
    });

    return () => { mounted = false; };
  }, []);

  const runSql = useCallback((sqlText) => {
    setLastQuery(sqlText);
    return executeQuery(sqlText);
  }, []);

  const value = {
    engineStatus,
    engineStatusText,
    runSql,
    lastQuery,
    setLastQuery,
    schemaTree: SCHEMA_TREE,
    presetQueries: PRESET_QUERIES
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}
