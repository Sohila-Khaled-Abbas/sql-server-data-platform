/**
 * Interactive SQL Challenge Arena - Problem Sets
 * Graded LeetCode-style problem sets with automated assertions against the WASM engine.
 */

export const CHALLENGES = [
  {
    id: 'ch-1',
    title: 'Highest Paid Employee by Department',
    difficulty: 'Easy',
    topic: 'Aggregations & GROUP BY',
    xp: 50,
    description: `
      <p>As a Database Engineer, you need to report the compensation ceiling across all operational units.</p>
      <p><strong>Task:</strong> Write a query to return each department's name (<code>Department</code>), its maximum employee salary (<code>TopSalary</code>), and the total number of employees in that department (<code>StaffCount</code>).</p>
      <p>Order the results by <code>TopSalary</code> in descending order.</p>
    `,
    starterSql: `-- Challenge 1: Find highest salary & headcount per department
SELECT 
    d.DName AS Department,
    MAX(e.Salary) AS TopSalary,
    COUNT(e.SSN) AS StaffCount
FROM Department d
JOIN Employee e ON d.DNum = e.Dno
GROUP BY d.DName
ORDER BY TopSalary DESC;`,
    verify: (result) => {
      if (!result.columns || result.columns.length < 3) {
        return { pass: false, error: 'Expected at least 3 columns: Department, TopSalary, StaffCount.' };
      }
      if (result.rowCount !== 3) {
        return { pass: false, error: `Expected 3 department rows, received ${result.rowCount}.` };
      }
      const topSalary = result.values[0][1];
      if (Number(topSalary) < 50000) {
        return { pass: false, error: `Expected highest salary to be 55,000, got ${topSalary}.` };
      }
      return { pass: true };
    },
    hint: 'Use INNER JOIN between Department and Employee on d.DNum = e.Dno, then GROUP BY d.DName with MAX() and COUNT().',
    solution: `SELECT 
    d.DName AS Department,
    MAX(e.Salary) AS TopSalary,
    COUNT(e.SSN) AS StaffCount
FROM Department d
JOIN Employee e ON d.DNum = e.Dno
GROUP BY d.DName
ORDER BY TopSalary DESC;`
  },

  {
    id: 'ch-2',
    title: 'Identify Project Allocation & Unassigned Projects',
    difficulty: 'Medium',
    topic: 'LEFT OUTER JOIN & COALESCE',
    xp: 75,
    description: `
      <p>Company management needs visibility into project staffing. Some projects might currently have zero staff allocated.</p>
      <p><strong>Task:</strong> List every project name (<code>ProjectName</code>), its managing department (<code>Department</code>), the count of assigned employees (<code>AssignedStaff</code>), and the total weekly hours (<code>TotalHours</code>).</p>
      <p>If a project has no assigned employees, <code>TotalHours</code> must return <code>0</code> (not <code>NULL</code>).</p>
      <p>Order by <code>TotalHours</code> descending.</p>
    `,
    starterSql: `-- Challenge 2: Project effort matrix including unassigned projects
SELECT 
    p.PName AS ProjectName,
    d.DName AS Department,
    COUNT(w.ESSN) AS AssignedStaff,
    COALESCE(SUM(w.Hours), 0) AS TotalHours
FROM Project p
JOIN Department d ON p.DNum = d.DNum
LEFT JOIN WorksOn w ON p.PNum = w.PNo
GROUP BY p.PName, d.DName
ORDER BY TotalHours DESC;`,
    verify: (result) => {
      if (!result.columns || result.columns.length < 4) {
        return { pass: false, error: 'Expected 4 columns: ProjectName, Department, AssignedStaff, TotalHours.' };
      }
      if (result.rowCount < 6) {
        return { pass: false, error: `Expected at least 6 projects in the output, received ${result.rowCount}.` };
      }
      const hasNullHours = result.values.some(row => row[3] === null);
      if (hasNullHours) {
        return { pass: false, error: 'TotalHours contains NULL values. Use COALESCE(SUM(w.Hours), 0).' };
      }
      return { pass: true };
    },
    hint: 'Use a LEFT JOIN from Project to WorksOn so that projects without works records are retained. Wrap SUM(w.Hours) in COALESCE(..., 0).',
    solution: `SELECT 
    p.PName AS ProjectName,
    d.DName AS Department,
    COUNT(w.ESSN) AS AssignedStaff,
    COALESCE(SUM(w.Hours), 0) AS TotalHours
FROM Project p
JOIN Department d ON p.DNum = d.DNum
LEFT JOIN WorksOn w ON p.PNum = w.PNo
GROUP BY p.PName, d.DName
ORDER BY TotalHours DESC;`
  },

  {
    id: 'ch-3',
    title: 'Supervisor Org-Tree Hierarchy',
    difficulty: 'Medium',
    topic: 'Self-Join & Hierarchy',
    xp: 75,
    description: `
      <p>Human Resources requires an audit of supervisory relationships across all tiers.</p>
      <p><strong>Task:</strong> Retrieve all employees along with their direct supervisor's name and their salary difference.</p>
      <p>Output columns: <code>EmployeeName</code>, <code>EmployeeSalary</code>, <code>SupervisorName</code>, <code>SupervisorSalary</code>, <code>SalaryGap</code> (SupervisorSalary - EmployeeSalary).</p>
      <p>Filter only employees who have an assigned supervisor. Order by <code>SalaryGap</code> descending.</p>
    `,
    starterSql: `-- Challenge 3: Supervisory compensation gap
SELECT 
    e.FName || ' ' || e.LName AS EmployeeName,
    e.Salary AS EmployeeSalary,
    s.FName || ' ' || s.LName AS SupervisorName,
    s.Salary AS SupervisorSalary,
    (s.Salary - e.Salary) AS SalaryGap
FROM Employee e
JOIN Employee s ON e.SuperSSN = s.SSN
ORDER BY SalaryGap DESC;`,
    verify: (result) => {
      if (!result.columns || result.columns.length < 5) {
        return { pass: false, error: 'Expected 5 columns: EmployeeName, EmployeeSalary, SupervisorName, SupervisorSalary, SalaryGap.' };
      }
      if (result.rowCount < 5) {
        return { pass: false, error: `Expected at least 5 supervised employees, received ${result.rowCount}.` };
      }
      const topGap = result.values[0][4];
      if (Number(topGap) <= 0) {
        return { pass: false, error: `SalaryGap calculation is invalid. Expected positive difference.` };
      }
      return { pass: true };
    },
    hint: 'Perform an INNER JOIN from Employee e to Employee s on e.SuperSSN = s.SSN. Calculate (s.Salary - e.Salary) AS SalaryGap.',
    solution: `SELECT 
    e.FName || ' ' || e.LName AS EmployeeName,
    e.Salary AS EmployeeSalary,
    s.FName || ' ' || s.LName AS SupervisorName,
    s.Salary AS SupervisorSalary,
    (s.Salary - e.Salary) AS SalaryGap
FROM Employee e
JOIN Employee s ON e.SuperSSN = s.SSN
ORDER BY SalaryGap DESC;`
  },

  {
    id: 'ch-4',
    title: 'Kimball DW: Track Customer Relocation History (SCD Type 2)',
    difficulty: 'Hard',
    topic: 'Data Warehousing & SCD2',
    xp: 100,
    description: `
      <p>In analytical warehouses, tracking address relocations without destroying historical sales attribution requires Slowly Changing Dimensions Type 2.</p>
      <p><strong>Task:</strong> In <code>DimCustomer</code>, write a query to identify all customers who have moved (more than 1 version record). Return their <code>CustomerID</code>, <code>FullName</code>, and total number of historical revisions (<code>VersionCount</code>).</p>
    `,
    starterSql: `-- Challenge 4: Detect SCD Type 2 customer version revisions
SELECT 
    CustomerID,
    FullName,
    COUNT(CustomerKey) AS VersionCount
FROM DimCustomer
GROUP BY CustomerID, FullName
HAVING COUNT(CustomerKey) > 1;`,
    verify: (result) => {
      if (!result.columns || result.columns.length < 3) {
        return { pass: false, error: 'Expected 3 columns: CustomerID, FullName, VersionCount.' };
      }
      if (result.rowCount !== 1) {
        return { pass: false, error: `Expected exactly 1 relocated customer, received ${result.rowCount}.` };
      }
      if (Number(result.values[0][2]) !== 2) {
        return { pass: false, error: `Expected VersionCount of 2, received ${result.values[0][2]}.` };
      }
      return { pass: true };
    },
    hint: 'Group by CustomerID and FullName, apply HAVING COUNT(CustomerKey) > 1.',
    solution: `SELECT 
    CustomerID,
    FullName,
    COUNT(CustomerKey) AS VersionCount
FROM DimCustomer
GROUP BY CustomerID, FullName
HAVING COUNT(CustomerKey) > 1;`
  },

  {
    id: 'ch-5',
    title: 'Weak Entity Integrity: Family Dependent Coverage',
    difficulty: 'Hard',
    topic: 'Weak Entities & Subqueries',
    xp: 100,
    description: `
      <p>Family benefit programs require analyzing employee dependent coverage.</p>
      <p><strong>Task:</strong> Find all employees who have <strong>2 or more dependents</strong> registered in the system. For each such employee, display their <code>EmployeeName</code>, their <code>Department</code>, their <code>DependentCount</code>, and the birthdate of their oldest dependent (<code>OldestDependentBirth</code>).</p>
      <p>Order by <code>DependentCount</code> DESC, then <code>OldestDependentBirth</code> ASC.</p>
    `,
    starterSql: `-- Challenge 5: Multi-dependent employee benefits analysis
SELECT 
    e.FName || ' ' || e.LName AS EmployeeName,
    d.DName AS Department,
    COUNT(dp.DependentName) AS DependentCount,
    MIN(dp.BDate) AS OldestDependentBirth
FROM Employee e
JOIN Department d ON e.Dno = d.DNum
JOIN Dependent dp ON e.SSN = dp.ESSN
GROUP BY e.SSN, EmployeeName, d.DName
HAVING COUNT(dp.DependentName) >= 2
ORDER BY DependentCount DESC, OldestDependentBirth ASC;`,
    verify: (result) => {
      if (!result.columns || result.columns.length < 4) {
        return { pass: false, error: 'Expected 4 columns: EmployeeName, Department, DependentCount, OldestDependentBirth.' };
      }
      if (result.rowCount < 1) {
        return { pass: false, error: `Expected at least 1 employee with multiple dependents, received ${result.rowCount}.` };
      }
      return { pass: true };
    },
    hint: 'Join Employee, Department, and Dependent. Group by employee SSN and name, apply HAVING COUNT(dp.DependentName) >= 2, and use MIN(dp.BDate) for oldest birthdate.',
    solution: `SELECT 
    e.FName || ' ' || e.LName AS EmployeeName,
    d.DName AS Department,
    COUNT(dp.DependentName) AS DependentCount,
    MIN(dp.BDate) AS OldestDependentBirth
FROM Employee e
JOIN Department d ON e.Dno = d.DNum
JOIN Dependent dp ON e.SSN = dp.ESSN
GROUP BY e.SSN, EmployeeName, d.DName
HAVING COUNT(dp.DependentName) >= 2
ORDER BY DependentCount DESC, OldestDependentBirth ASC;`
  }
];
