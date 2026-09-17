import React, { useState } from 'react';
import { Database, Copy, Check, Play, Info, Key, FileCode } from 'lucide-react';

const NODE_DATA = {
  entity_emp: {
    title: 'Entity: Employee (Emp)',
    category: 'Regular Strong Entity',
    chenDesc: 'Represents company staff. Key attribute is SSN. Has composite attribute "name" (F, M, L), Birth Date (BD), Gender, and Salary.',
    mappingRules: 'Mapped to base table Company.Employee. Composite name is flattened into FName, MInit, LName. Receives FK Dno referencing Department, and recursive FK SuperSSN referencing Employee.',
    sqlSnippet: `CREATE TABLE Company.Employee (
    SSN         CHAR(9) NOT NULL PRIMARY KEY,
    FName       VARCHAR(15) NOT NULL,
    MInit       CHAR(1) NULL,
    LName       VARCHAR(15) NOT NULL,
    BDate       DATE NULL,
    Gender      CHAR(1) CHECK (Gender IN ('M', 'F')),
    Salary      DECIMAL(10,2) CHECK (Salary > 0),
    SuperSSN    CHAR(9) REFERENCES Company.Employee(SSN),
    Dno         INT REFERENCES Company.Department(DNum)
) ON [DATA_FG];`,
    queryPreset: `SELECT SSN, FName, LName, Salary, Dno FROM Employee;`
  },
  entity_dept: {
    title: 'Entity: Department (Dept)',
    category: 'Regular Strong Entity (Circular Dependency)',
    chenDesc: 'Represents business units. Key is DNum, DName is candidate key. Has multi-valued attribute "loc". Participates in 1:1 Manage relationship with Employee.',
    mappingRules: 'Mapped to Company.Department. Multi-valued attribute "loc" is separated into DeptLocations. Circular FK MgrSSN referencing Employee is resolved via ALTER TABLE or phased insert.',
    sqlSnippet: `CREATE TABLE Company.Department (
    DNum        INT NOT NULL PRIMARY KEY,
    DName       VARCHAR(50) NOT NULL UNIQUE,
    MgrSSN      CHAR(9) REFERENCES Company.Employee(SSN),
    MgrHireDate DATE NULL
) ON [DATA_FG];`,
    queryPreset: `SELECT DNum, DName, MgrSSN FROM Department;`
  },
  entity_project: {
    title: 'Entity: Project',
    category: 'Regular Strong Entity',
    chenDesc: 'Represents capital initiatives. Key is Pnum, has Pname, City, and loc. Controlled by 1 Department (has relationship) and staffed by M Employees (work relationship).',
    mappingRules: 'Mapped to Company.Project. Foreign key DNum references controlling Department(DNum). M:N staffing relationship with Employee is extracted into WorksOn associative table.',
    sqlSnippet: `CREATE TABLE Company.Project (
    PNum        INT NOT NULL PRIMARY KEY,
    PName       VARCHAR(50) NOT NULL UNIQUE,
    City        VARCHAR(50) NOT NULL,
    Location    VARCHAR(50) NULL,
    DNum        INT NOT NULL REFERENCES Company.Department(DNum)
) ON [DATA_FG];`,
    queryPreset: `SELECT PNum, PName, City, DNum FROM Project;`
  },
  entity_dependent: {
    title: 'Weak Entity: Dependent',
    category: 'Weak Entity (Existence Dependent on Employee)',
    chenDesc: 'Represents employee family members. Cannot exist without parent employee. Dname is partial key (discriminator). Identifying relationship is "have" (double diamond).',
    mappingRules: 'Composite Primary Key formed by Parent PK + Discriminator: (ESSN, DependentName). Foreign key ESSN references Employee(SSN) with ON DELETE CASCADE.',
    sqlSnippet: `CREATE TABLE Company.Dependent (
    ESSN            CHAR(9) NOT NULL,
    DependentName   VARCHAR(50) NOT NULL,
    Gender          CHAR(1) CHECK (Gender IN ('M', 'F')),
    BDate           DATE NULL,
    Relationship    VARCHAR(20) NOT NULL,
    CONSTRAINT PK_Dependent PRIMARY KEY (ESSN, DependentName),
    CONSTRAINT FK_Dependent_Emp FOREIGN KEY (ESSN) 
        REFERENCES Company.Employee(SSN) ON DELETE CASCADE
) ON [DATA_FG];`,
    queryPreset: `SELECT ESSN, DependentName, Relationship FROM Dependent;`
  },
  dept_locations: {
    title: 'Multi-Valued Attribute: Dept.loc',
    category: 'Multi-Valued Attribute (Double Ellipse)',
    chenDesc: 'A department can operate across multiple office sites (e.g. Bellaire, Sugarland, Houston). Represented in Chen notation as a double ellipse.',
    mappingRules: 'In relational 1NF, multi-valued attributes cannot remain in the parent row. They must be extracted to a separate table Company.DeptLocations with composite PK (DNum, Location).',
    sqlSnippet: `CREATE TABLE Company.DeptLocations (
    DNum        INT NOT NULL,
    Location    VARCHAR(50) NOT NULL,
    CONSTRAINT PK_DeptLocations PRIMARY KEY (DNum, Location),
    CONSTRAINT FK_DeptLocations_Dept FOREIGN KEY (DNum)
        REFERENCES Company.Department(DNum) ON DELETE CASCADE
) ON [DATA_FG];`,
    queryPreset: `SELECT DNum, Location FROM DeptLocations;`
  },
  rel_works_on: {
    title: 'Relationship: Works_On (work)',
    category: 'Binary M:N Relationship with Attributes',
    chenDesc: 'Employees work on multiple projects; projects have multiple employees. Has relationship attribute "hours" (hours worked per week).',
    mappingRules: 'Mapped to associative / bridge table Company.WorksOn with composite PK (ESSN, PNo). Stores Hours DECIMAL(5,2) with check constraint Hours >= 0.',
    sqlSnippet: `CREATE TABLE Company.WorksOn (
    ESSN    CHAR(9) NOT NULL REFERENCES Company.Employee(SSN) ON DELETE CASCADE,
    PNo     INT NOT NULL REFERENCES Company.Project(PNum) ON DELETE CASCADE,
    Hours   DECIMAL(5,2) CHECK (Hours >= 0 AND Hours <= 100),
    PRIMARY KEY (ESSN, PNo)
) ON [DATA_FG];`,
    queryPreset: `SELECT ESSN, PNo, Hours FROM WorksOn;`
  }
};

export default function ErdExplorer({ onRunInPlayground }) {
  const [selectedId, setSelectedId] = useState('entity_emp');
  const [copied, setCopied] = useState(false);

  const currentData = NODE_DATA[selectedId] || NODE_DATA.entity_emp;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentData.sqlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="erd-explorer-container">
      {/* Header */}
      <div className="erd-header">
        <div className="ms-badge">Conceptual to Relational Modeling</div>
        <h1>Peter Chen ERD & 3NF Schema Inspector</h1>
        <p>
          Click any Entity (rectangle), Relationship (diamond), or Attribute (oval) in the Chen diagram to inspect its 3NF normalization rules and executable T-SQL schema.
        </p>
      </div>

      <div className="erd-split-view">
        {/* Canvas */}
        <div className="erd-canvas-panel">
          <svg className="erd-svg" viewBox="0 0 950 560" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="entityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
              <linearGradient id="relGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
              <linearGradient id="attrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>

            {/* Connecting Lines */}
            <g stroke="#334155" strokeWidth="2">
              <line x1="200" y1="180" x2="130" y2="110" />
              <line x1="200" y1="180" x2="200" y2="90" />
              <line x1="200" y1="180" x2="270" y2="110" />
              <line x1="270" y1="110" x2="250" y2="50" />
              <line x1="270" y1="110" x2="290" y2="50" />
              <line x1="270" y1="110" x2="330" y2="60" />

              <line x1="200" y1="200" x2="350" y2="140" />
              <line x1="200" y1="220" x2="350" y2="250" />
              <line x1="200" y1="240" x2="350" y2="380" />
              <line x1="200" y1="240" x2="200" y2="340" />
              <line x1="140" y1="200" x2="80" y2="200" />
              <line x1="80" y1="200" x2="80" y2="260" />
              <line x1="80" y1="260" x2="140" y2="230" />

              <line x1="560" y1="170" x2="410" y2="140" />
              <line x1="560" y1="190" x2="410" y2="250" />
              <line x1="600" y1="220" x2="600" y2="310" />
              <line x1="640" y1="170" x2="740" y2="140" />
              <line x1="640" y1="190" x2="750" y2="190" />
              <line x1="640" y1="210" x2="740" y2="240" />

              <line x1="600" y1="370" x2="600" y2="420" />
              <line x1="540" y1="440" x2="410" y2="380" />
              <line x1="660" y1="440" x2="750" y2="420" />
              <line x1="660" y1="460" x2="760" y2="460" />
              <line x1="660" y1="480" x2="750" y2="500" />

              <line x1="200" y1="400" x2="200" y2="440" />
              <line x1="200" y1="480" x2="120" y2="520" />
              <line x1="200" y1="480" x2="200" y2="530" />
              <line x1="200" y1="480" x2="280" y2="520" />
            </g>

            {/* Entity: Employee */}
            <g
              className={`erd-node ${selectedId === 'entity_emp' ? 'selected' : ''}`}
              onClick={() => setSelectedId('entity_emp')}
              style={{ cursor: 'pointer' }}
            >
              <rect x="140" y="180" width="120" height="60" rx="8" fill="url(#entityGrad)" stroke="#38bdf8" strokeWidth={selectedId === 'entity_emp' ? '3' : '1.5'} />
              <text x="200" y="215" fill="#ffffff" fontSize="14" fontWeight="700" textAnchor="middle">Employee</text>
            </g>

            {/* Entity: Department */}
            <g
              className={`erd-node ${selectedId === 'entity_dept' ? 'selected' : ''}`}
              onClick={() => setSelectedId('entity_dept')}
              style={{ cursor: 'pointer' }}
            >
              <rect x="540" y="160" width="120" height="60" rx="8" fill="url(#entityGrad)" stroke="#38bdf8" strokeWidth={selectedId === 'entity_dept' ? '3' : '1.5'} />
              <text x="600" y="195" fill="#ffffff" fontSize="14" fontWeight="700" textAnchor="middle">Department</text>
            </g>

            {/* Entity: Project */}
            <g
              className={`erd-node ${selectedId === 'entity_project' ? 'selected' : ''}`}
              onClick={() => setSelectedId('entity_project')}
              style={{ cursor: 'pointer' }}
            >
              <rect x="540" y="420" width="120" height="60" rx="8" fill="url(#entityGrad)" stroke="#38bdf8" strokeWidth={selectedId === 'entity_project' ? '3' : '1.5'} />
              <text x="600" y="455" fill="#ffffff" fontSize="14" fontWeight="700" textAnchor="middle">Project</text>
            </g>

            {/* Weak Entity: Dependent */}
            <g
              className={`erd-node ${selectedId === 'entity_dependent' ? 'selected' : ''}`}
              onClick={() => setSelectedId('entity_dependent')}
              style={{ cursor: 'pointer' }}
            >
              <rect x="140" y="440" width="120" height="60" rx="8" fill="url(#entityGrad)" stroke="#ec4899" strokeWidth="2" />
              <rect x="146" y="446" width="108" height="48" rx="6" fill="none" stroke="#ec4899" strokeWidth="1.5" />
              <text x="200" y="475" fill="#ffffff" fontSize="13" fontWeight="700" textAnchor="middle">Dependent</text>
            </g>

            {/* Dept Multi-valued loc */}
            <g
              className={`erd-node ${selectedId === 'dept_locations' ? 'selected' : ''}`}
              onClick={() => setSelectedId('dept_locations')}
              style={{ cursor: 'pointer' }}
            >
              <ellipse cx="740" cy="140" rx="42" ry="22" fill="url(#attrGrad)" stroke="#f59e0b" strokeWidth="2" />
              <ellipse cx="740" cy="140" rx="36" ry="17" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="740" y="144" fill="#fcd34d" fontSize="11" textAnchor="middle" fontWeight="600">loc (multi)</text>
            </g>

            {/* Relationship: works_on */}
            <g
              className={`erd-node ${selectedId === 'rel_works_on' ? 'selected' : ''}`}
              onClick={() => setSelectedId('rel_works_on')}
              style={{ cursor: 'pointer' }}
            >
              <polygon points="380,350 420,380 380,410 340,380" fill="url(#relGrad)" stroke="#a855f7" strokeWidth="1.5" />
              <text x="380" y="384" fill="#fff" fontSize="11" fontWeight="600" textAnchor="middle">work</text>
            </g>
          </svg>
        </div>

        {/* Inspector Panel */}
        <div className="erd-inspector-panel">
          <div className="inspector-header">
            <span className="schema-badge">{currentData.category}</span>
            <h2>{currentData.title}</h2>
          </div>

          <div className="inspector-section">
            <div className="section-label">
              <Info className="w-3.5 h-3.5 inline mr-1 text-ms-red" />
              Conceptual Chen Semantics
            </div>
            <p className="section-content">{currentData.chenDesc}</p>
          </div>

          <div className="inspector-section">
            <div className="section-label">
              <Key className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />
              3NF Relational Mapping Rules
            </div>
            <p className="section-content">{currentData.mappingRules}</p>
          </div>

          <div className="inspector-section">
            <div className="flex items-center justify-between mb-1">
              <div className="section-label">
                <FileCode className="w-3.5 h-3.5 inline mr-1 text-blue-400" />
                T-SQL DDL Specification
              </div>
              <button className="copy-code-btn" onClick={handleCopy}>
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="erd-code-snippet">
              <code>{currentData.sqlSnippet}</code>
            </pre>
          </div>

          <button
            className="erd-run-btn"
            onClick={() => onRunInPlayground && onRunInPlayground(currentData.queryPreset)}
          >
            <Play className="w-4 h-4 fill-current" />
            Test Schema Query in Studio
          </button>
        </div>
      </div>
    </div>
  );
}
