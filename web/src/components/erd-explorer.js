export function setupErdExplorer(onSwitchToPlayground) {
  const canvas = document.getElementById('erdInteractiveCanvas');
  const detailsPanel = document.getElementById('erdDetailsPanel');
  if (!canvas || !detailsPanel) return;

  // Render SVG Chen Diagram
  canvas.innerHTML = `
    <svg class="erd-svg" viewBox="0 0 950 560" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Gradients for Chen ERD -->
        <linearGradient id="entityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0284c7"/>
          <stop offset="100%" stop-color="#0369a1"/>
        </linearGradient>
        <linearGradient id="relGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#8b5cf6"/>
          <stop offset="100%" stop-color="#7c3aed"/>
        </linearGradient>
        <linearGradient id="attrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>

      <!-- Connecting Lines -->
      <g stroke="#334155" stroke-width="2">
        <!-- Emp to Attributes -->
        <line x1="200" y1="180" x2="130" y2="110"/>
        <line x1="200" y1="180" x2="200" y2="90"/>
        <line x1="200" y1="180" x2="270" y2="110"/>
        <line x1="270" y1="110" x2="250" y2="50"/>
        <line x1="270" y1="110" x2="290" y2="50"/>
        <line x1="270" y1="110" x2="330" y2="60"/>

        <!-- Emp to Relationships -->
        <line x1="200" y1="200" x2="350" y2="140"/> <!-- works_for -->
        <line x1="200" y1="220" x2="350" y2="250"/> <!-- Manage -->
        <line x1="200" y1="240" x2="350" y2="380"/> <!-- works_on -->
        <line x1="200" y1="240" x2="200" y2="340"/> <!-- have -->
        <line x1="140" y1="200" x2="80" y2="200"/>  <!-- supervise loop -->
        <line x1="80" y1="200" x2="80" y2="260"/>
        <line x1="80" y1="260" x2="140" y2="230"/>

        <!-- Dept to Relationships -->
        <line x1="560" y1="170" x2="410" y2="140"/> <!-- works_for -->
        <line x1="560" y1="190" x2="410" y2="250"/> <!-- Manage -->
        <line x1="600" y1="220" x2="600" y2="310"/> <!-- controls -->
        <line x1="640" y1="170" x2="740" y2="140"/> <!-- Dept.loc -->
        <line x1="640" y1="190" x2="750" y2="190"/> <!-- Dept.DNum -->
        <line x1="640" y1="210" x2="740" y2="240"/> <!-- Dept.DName -->

        <!-- Project to Relationships -->
        <line x1="600" y1="370" x2="600" y2="420"/> <!-- controls to Project -->
        <line x1="540" y1="440" x2="410" y2="380"/> <!-- works_on to Project -->
        <line x1="660" y1="440" x2="750" y2="420"/> <!-- Project.PNum -->
        <line x1="660" y1="460" x2="760" y2="460"/> <!-- Project.PName -->
        <line x1="660" y1="480" x2="750" y2="500"/> <!-- Project.City -->

        <!-- Dependent to have -->
        <line x1="200" y1="400" x2="200" y2="440"/>
        <line x1="200" y1="480" x2="120" y2="520"/> <!-- Dep.Name -->
        <line x1="200" y1="480" x2="200" y2="530"/> <!-- Dep.Gender -->
        <line x1="200" y1="480" x2="280" y2="520"/> <!-- Dep.BDate -->
      </g>

      <!-- Attributes (Ovals) -->
      <!-- Emp attributes -->
      <g class="erd-node" data-id="attr_ssn">
        <ellipse cx="130" cy="110" rx="36" ry="20" fill="url(#attrGrad)" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="130" y="114" fill="#f8fafc" font-size="11" text-anchor="middle" font-weight="600" text-decoration="underline">SSN</text>
      </g>
      <g class="erd-node" data-id="attr_bd">
        <ellipse cx="200" cy="90" rx="30" ry="18" fill="url(#attrGrad)" stroke="#64748b" stroke-width="1.5"/>
        <text x="200" y="94" fill="#94a3b8" font-size="11" text-anchor="middle">BD</text>
      </g>
      <g class="erd-node" data-id="attr_name">
        <ellipse cx="270" cy="110" rx="34" ry="18" fill="url(#attrGrad)" stroke="#64748b" stroke-width="1.5"/>
        <text x="270" y="114" fill="#94a3b8" font-size="11" text-anchor="middle">name</text>
      </g>
      <ellipse cx="250" cy="50" rx="18" ry="14" fill="url(#attrGrad)" stroke="#475569" stroke-width="1"/>
      <text x="250" y="54" fill="#cbd5e1" font-size="10" text-anchor="middle">F</text>
      <ellipse cx="290" cy="50" rx="18" ry="14" fill="url(#attrGrad)" stroke="#475569" stroke-width="1"/>
      <text x="290" y="54" fill="#cbd5e1" font-size="10" text-anchor="middle">M</text>
      <ellipse cx="330" cy="60" rx="18" ry="14" fill="url(#attrGrad)" stroke="#475569" stroke-width="1"/>
      <text x="330" y="64" fill="#cbd5e1" font-size="10" text-anchor="middle">L</text>

      <!-- Dept attributes -->
      <g class="erd-node" data-id="attr_dnum">
        <ellipse cx="750" cy="190" rx="38" ry="20" fill="url(#attrGrad)" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="750" y="194" fill="#f8fafc" font-size="11" text-anchor="middle" font-weight="600" text-decoration="underline">DNum</text>
      </g>
      <g class="erd-node" data-id="attr_dname">
        <ellipse cx="740" cy="240" rx="36" ry="18" fill="url(#attrGrad)" stroke="#64748b" stroke-width="1.5"/>
        <text x="740" y="244" fill="#94a3b8" font-size="11" text-anchor="middle">DName</text>
      </g>
      <g class="erd-node" data-id="dept_locations">
        <ellipse cx="740" cy="140" rx="42" ry="22" fill="url(#attrGrad)" stroke="#f59e0b" stroke-width="2"/>
        <ellipse cx="740" cy="140" rx="36" ry="17" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="740" y="144" fill="#fcd34d" font-size="11" text-anchor="middle" font-weight="600">loc (multi)</text>
      </g>

      <!-- Project attributes -->
      <ellipse cx="750" cy="420" rx="34" ry="18" fill="url(#attrGrad)" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="750" y="424" fill="#f8fafc" font-size="11" text-anchor="middle" font-weight="600" text-decoration="underline">Pnum</text>
      <ellipse cx="760" cy="460" rx="34" ry="18" fill="url(#attrGrad)" stroke="#64748b" stroke-width="1.5"/>
      <text x="760" y="464" fill="#94a3b8" font-size="11" text-anchor="middle">Pname</text>
      <ellipse cx="750" cy="500" rx="30" ry="16" fill="url(#attrGrad)" stroke="#64748b" stroke-width="1.5"/>
      <text x="750" y="504" fill="#94a3b8" font-size="11" text-anchor="middle">City</text>

      <!-- Dependent attributes -->
      <ellipse cx="120" cy="520" rx="40" ry="18" fill="url(#attrGrad)" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3"/>
      <text x="120" y="524" fill="#f8fafc" font-size="10" text-anchor="middle" font-weight="600">Dname (part)</text>
      <ellipse cx="200" cy="530" rx="28" ry="16" fill="url(#attrGrad)" stroke="#64748b" stroke-width="1.5"/>
      <text x="200" y="534" fill="#94a3b8" font-size="10" text-anchor="middle">Gender</text>
      <ellipse cx="280" cy="520" rx="28" ry="16" fill="url(#attrGrad)" stroke="#64748b" stroke-width="1.5"/>
      <text x="280" y="524" fill="#94a3b8" font-size="10" text-anchor="middle">BD</text>

      <!-- Cardinality Text Labels -->
      <text x="240" y="170" fill="#38bdf8" font-size="12" font-weight="700">M</text>
      <text x="510" y="160" fill="#38bdf8" font-size="12" font-weight="700">1</text>
      <text x="240" y="240" fill="#38bdf8" font-size="12" font-weight="700">1</text>
      <text x="510" y="220" fill="#38bdf8" font-size="12" font-weight="700">1</text>
      <text x="240" y="295" fill="#38bdf8" font-size="12" font-weight="700">M</text>
      <text x="500" y="420" fill="#38bdf8" font-size="12" font-weight="700">M</text>
      <text x="615" y="270" fill="#38bdf8" font-size="12" font-weight="700">1</text>
      <text x="615" y="390" fill="#38bdf8" font-size="12" font-weight="700">M</text>
      <text x="215" y="285" fill="#38bdf8" font-size="12" font-weight="700">1</text>
      <text x="215" y="430" fill="#38bdf8" font-size="12" font-weight="700">M</text>

      <!-- ENTITY 1: Emp (Rectangle) -->
      <g class="erd-node" data-id="entity_emp">
        <rect x="140" y="180" width="120" height="50" rx="6" fill="url(#entityGrad)" stroke="#38bdf8" stroke-width="2"/>
        <text x="200" y="210" fill="#fff" font-size="15" font-weight="700" text-anchor="middle">Emp</text>
      </g>

      <!-- ENTITY 2: Dept (Rectangle) -->
      <g class="erd-node" data-id="entity_dept">
        <rect x="540" y="160" width="120" height="50" rx="6" fill="url(#entityGrad)" stroke="#38bdf8" stroke-width="2"/>
        <text x="600" y="190" fill="#fff" font-size="15" font-weight="700" text-anchor="middle">Dept</text>
      </g>

      <!-- ENTITY 3: Project (Rectangle) -->
      <g class="erd-node" data-id="entity_project">
        <rect x="540" y="420" width="120" height="50" rx="6" fill="url(#entityGrad)" stroke="#38bdf8" stroke-width="2"/>
        <text x="600" y="450" fill="#fff" font-size="15" font-weight="700" text-anchor="middle">project</text>
      </g>

      <!-- WEAK ENTITY 4: Dependent (Double Rectangle) -->
      <g class="erd-node" data-id="entity_dependent">
        <rect x="140" y="440" width="120" height="50" rx="6" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="2"/>
        <rect x="145" y="445" width="110" height="40" rx="4" fill="none" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="200" y="470" fill="#fff" font-size="14" font-weight="700" text-anchor="middle">Dependent</text>
      </g>

      <!-- RELATIONSHIPS (Diamonds) -->
      <!-- works_for (Emp 1..M Dept) -->
      <g class="erd-node" data-id="rel_works_for">
        <polygon points="380,110 420,140 380,170 340,140" fill="url(#relGrad)" stroke="#a855f7" stroke-width="1.5"/>
        <text x="380" y="144" fill="#fff" font-size="10" font-weight="600" text-anchor="middle">(work)</text>
      </g>

      <!-- Manage (Emp 1..1 Dept with HireDate) -->
      <g class="erd-node" data-id="rel_manage">
        <polygon points="380,220 425,250 380,280 335,250" fill="url(#relGrad)" stroke="#a855f7" stroke-width="1.5"/>
        <text x="380" y="254" fill="#fff" font-size="11" font-weight="600" text-anchor="middle">Manage</text>
        <!-- Attribute hiredate -->
        <ellipse cx="440" cy="290" rx="30" ry="16" fill="url(#attrGrad)" stroke="#a855f7" stroke-width="1.5"/>
        <line x1="410" y1="265" x2="440" y2="280" stroke="#a855f7" stroke-width="1.5"/>
        <text x="440" y="294" fill="#cbd5e1" font-size="10" text-anchor="middle">hiredate</text>
      </g>

      <!-- works_on (Emp M..M Project with Hours) -->
      <g class="erd-node" data-id="rel_works_on">
        <polygon points="380,350 425,380 380,410 335,380" fill="url(#relGrad)" stroke="#a855f7" stroke-width="1.5"/>
        <text x="380" y="384" fill="#fff" font-size="11" font-weight="600" text-anchor="middle">work</text>
        <!-- Attribute hours -->
        <ellipse cx="340" cy="450" rx="28" ry="16" fill="url(#attrGrad)" stroke="#a855f7" stroke-width="1.5"/>
        <line x1="360" y1="395" x2="340" y2="440" stroke="#a855f7" stroke-width="1.5"/>
        <text x="340" y="454" fill="#cbd5e1" font-size="10" text-anchor="middle">hours</text>
      </g>

      <!-- controls (Dept 1..M Project) -->
      <g class="erd-node" data-id="rel_controls">
        <polygon points="600,280 635,310 600,340 565,310" fill="url(#relGrad)" stroke="#a855f7" stroke-width="1.5"/>
        <text x="600" y="314" fill="#fff" font-size="11" font-weight="600" text-anchor="middle">has</text>
      </g>

      <!-- supervise (Emp 1..M Emp) -->
      <g class="erd-node" data-id="rel_supervise">
        <polygon points="60,230 90,245 60,260 30,245" fill="url(#relGrad)" stroke="#a855f7" stroke-width="1.5"/>
        <text x="60" y="248" fill="#fff" font-size="8" font-weight="600" text-anchor="middle">supervise</text>
      </g>

      <!-- have (Identifying Relationship with Dependent) -->
      <g class="erd-node" data-id="rel_have">
        <polygon points="200,320 235,350 200,380 165,350" fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" stroke-width="2"/>
        <polygon points="200,326 227,350 200,374 173,350" fill="none" stroke="#a855f7" stroke-width="1.5"/>
        <text x="200" y="354" fill="#fff" font-size="10" font-weight="600" text-anchor="middle">have</text>
      </g>
    </svg>
  `;

  const nodeData = {
    entity_emp: {
      title: 'Entity: Employee (Emp)',
      category: 'Regular Strong Entity',
      chenDesc: 'Represents company staff. Key attribute is SSN. Has composite attribute "name" (F, M, L), Birth Date (BD), Gender, and Salary.',
      mappingRules: 'Mapped to base table `Company.Employee`. Composite name is flattened into `FName`, `MInit`, `LName`. Receives FK `Dno` referencing Department, and recursive FK `SuperSSN` referencing Employee.',
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
      queryPreset: 'company_hierarchy'
    },
    entity_dept: {
      title: 'Entity: Department (Dept)',
      category: 'Regular Strong Entity (Circular Dependency)',
      chenDesc: 'Represents business units. Key is DNum, DName is candidate key. Has multi-valued attribute "loc". Participates in 1:1 Manage relationship with Employee.',
      mappingRules: 'Mapped to `Company.Department`. Multi-valued attribute "loc" is separated into `DeptLocations`. Circular FK `MgrSSN` referencing `Employee` is resolved via ALTER TABLE or phased insert.',
      sqlSnippet: `CREATE TABLE Company.Department (
    DNum        INT NOT NULL PRIMARY KEY,
    DName       VARCHAR(50) NOT NULL UNIQUE,
    MgrSSN      CHAR(9) REFERENCES Company.Employee(SSN),
    MgrHireDate DATE NULL
) ON [DATA_FG];`,
      queryPreset: 'company_workload'
    },
    entity_project: {
      title: 'Entity: Project',
      category: 'Regular Strong Entity',
      chenDesc: 'Represents capital initiatives. Key is Pnum, has Pname, City, and loc. Controlled by 1 Department (has relationship) and staffed by M Employees (work relationship).',
      mappingRules: 'Mapped to `Company.Project`. Foreign key `DNum` references controlling `Department(DNum)`. M:N staffing relationship with Employee is extracted into `WorksOn` associative table.',
      sqlSnippet: `CREATE TABLE Company.Project (
    PNum        INT NOT NULL PRIMARY KEY,
    PName       VARCHAR(50) NOT NULL UNIQUE,
    City        VARCHAR(50) NOT NULL,
    Location    VARCHAR(50) NULL,
    DNum        INT NOT NULL REFERENCES Company.Department(DNum)
) ON [DATA_FG];`,
      queryPreset: 'company_workload'
    },
    entity_dependent: {
      title: 'Weak Entity: Dependent',
      category: 'Weak Entity (Existence Dependent on Employee)',
      chenDesc: 'Represents employee family members. Cannot exist without parent employee. Dname is partial key (discriminator). Identifying relationship is "have" (double diamond).',
      mappingRules: 'Composite Primary Key formed by Parent PK + Discriminator: `(ESSN, DependentName)`. Foreign key `ESSN` references `Employee(SSN)` with `ON DELETE CASCADE`.',
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
      queryPreset: 'company_dependents'
    },
    dept_locations: {
      title: 'Multi-Valued Attribute: Dept.loc',
      category: 'Multi-Valued Attribute (Double Ellipse)',
      chenDesc: 'A department can operate across multiple office sites (e.g. Bellaire, Sugarland, Houston). Represented in Chen notation as a double ellipse.',
      mappingRules: 'In relational 1NF, multi-valued attributes cannot remain in the parent row. They must be extracted to a separate table `Company.DeptLocations` with composite PK `(DNum, Location)`.',
      sqlSnippet: `CREATE TABLE Company.DeptLocations (
    DNum        INT NOT NULL,
    Location    VARCHAR(50) NOT NULL,
    CONSTRAINT PK_DeptLocations PRIMARY KEY (DNum, Location),
    CONSTRAINT FK_DeptLocations_Dept FOREIGN KEY (DNum)
        REFERENCES Company.Department(DNum) ON DELETE CASCADE
) ON [DATA_FG];`,
      queryPreset: 'dept_locations'
    },
    rel_works_on: {
      title: 'Relationship: Works_On (work)',
      category: 'Binary M:N Relationship with Attributes',
      chenDesc: 'Employees work on multiple projects; projects have multiple employees. Has relationship attribute "hours" (hours worked per week).',
      mappingRules: 'Mapped to associative / bridge table `Company.WorksOn` with composite PK `(ESSN, PNo)`. Stores `Hours DECIMAL(5,2)` with check constraint `Hours >= 0`.',
      sqlSnippet: `CREATE TABLE Company.WorksOn (
    ESSN    CHAR(9) NOT NULL REFERENCES Company.Employee(SSN) ON DELETE CASCADE,
    PNo     INT NOT NULL REFERENCES Company.Project(PNum) ON DELETE CASCADE,
    Hours   DECIMAL(5,2) CHECK (Hours >= 0 AND Hours <= 100),
    PRIMARY KEY (ESSN, PNo)
) ON [DATA_FG];`,
      queryPreset: 'company_workload'
    }
  };

  // Attach click listeners to nodes
  const nodes = canvas.querySelectorAll('.erd-node');
  nodes.forEach(node => {
    node.addEventListener('click', () => {
      nodes.forEach(n => n.classList.remove('selected'));
      node.classList.add('selected');

      const id = node.getAttribute('data-id');
      const data = nodeData[id] || {
        title: 'Selected Construct',
        category: 'Chen ERD Element',
        chenDesc: 'Represents a semantic attribute or relationship constraint in the canonical ITI case study.',
        mappingRules: 'Preserves 3NF relational normalization without data redundancy.',
        sqlSnippet: '-- Inspect full DDL in src/01_storage_and_schema/05_company_case_study_schema.sql',
        queryPreset: 'company_hierarchy'
      };

      renderDetails(data);
    });
  });

  function renderDetails(data) {
    detailsPanel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
        <div>
          <h2 style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 4px;">${data.title}</h2>
          <span class="badge badge-cyan">${data.category}</span>
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        <h4 style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px;">Conceptual Chen Semantics</h4>
        <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">${data.chenDesc}</p>
      </div>

      <div style="margin-bottom: 16px;">
        <h4 style="font-size: 0.78rem; text-transform: uppercase; color: var(--accent-cyan); margin-bottom: 4px;">3NF Relational Mapping Rules</h4>
        <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">${data.mappingRules}</p>
      </div>

      <div style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <h4 style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted);">T-SQL DDL Specification</h4>
          <button id="copySnippetBtn" class="btn-icon-text">Copy SQL</button>
        </div>
        <pre style="background: #090d16; border: 1px solid var(--border-subtle); padding: 12px; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 0.78rem; overflow-x: auto; color: #38bdf8;"><code>${escapeHtml(data.sqlSnippet)}</code></pre>
      </div>

      <button id="tryInPlaygroundBtn" class="btn btn-primary btn-sm" style="margin-top: auto;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        <span>Test Query in SQL Playground</span>
      </button>
    `;

    const copyBtn = document.getElementById('copySnippetBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(data.sqlSnippet);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = 'Copy SQL', 2000);
      });
    }

    const tryBtn = document.getElementById('tryInPlaygroundBtn');
    if (tryBtn && onSwitchToPlayground) {
      tryBtn.addEventListener('click', () => {
        onSwitchToPlayground(data.queryPreset);
      });
    }
  }
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}
