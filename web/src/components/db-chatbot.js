/**
 * OmniFlow AI Study Assistant & DBRE Mentor
 * Specialized in MaharaTech Course 2305: Implementing and Developing SQL Server Objects
 * Grounded in the course syllabus, Chen ERD mapping, optimizer internals, ACID transactions, and T-SQL.
 */

export function setupChatbot(onRunInPlayground) {
  const chatbotTrigger = document.getElementById('chatbotTrigger');
  const chatbotDrawer = document.getElementById('chatbotDrawer');
  const chatbotCloseBtn = document.getElementById('chatbotCloseBtn');
  const chatbotClearBtn = document.getElementById('chatbotClearBtn');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const chipContainer = document.getElementById('chatbotQuickChips');

  if (!chatbotDrawer) return;

  // Toggle drawer visibility
  function toggleDrawer(open) {
    if (open !== undefined) {
      if (open) chatbotDrawer.classList.add('open');
      else chatbotDrawer.classList.remove('open');
    } else {
      chatbotDrawer.classList.toggle('open');
    }

    if (chatbotDrawer.classList.contains('open')) {
      setTimeout(() => chatInput?.focus(), 150);
    }
  }

  if (chatbotTrigger) {
    chatbotTrigger.addEventListener('click', () => toggleDrawer(true));
  }

  if (chatbotCloseBtn) {
    chatbotCloseBtn.addEventListener('click', () => toggleDrawer(false));
  }

  // Quick-prompt suggestions
  const PROMPTS = [
    { label: '📐 3NF ERD Mapping', query: 'Explain the 6 Peter Chen ERD mapping rules into 3NF relational tables.' },
    { label: '🔄 Circular FKs', query: 'How do we solve circular foreign keys between Employee and Department in T-SQL?' },
    { label: '⚡ Index Tipping Point', query: 'What is the query optimizer tipping point between Index Seek and Table Scan?' },
    { label: '🛡️ ACID & XACT_ABORT', query: 'Why is SET XACT_ABORT ON essential with TRY...CATCH in transactional stored procedures?' },
    { label: '⭐ Kimball SCD Type 2', query: 'Explain Slowly Changing Dimension (SCD) Type 2 in Kimball Star Schemas with an example.' },
    { label: '🐞 Debug Msg 8115', query: 'How do I debug SQL Server Msg 8115: Arithmetic overflow error converting expression to data type int?' },
    { label: '🚀 Practice Query', query: 'Give me a challenging practice SQL query on the Company Database.' }
  ];

  if (chipContainer) {
    chipContainer.innerHTML = PROMPTS.map(p => `
      <button class="chat-chip" data-query="${escapeHtml(p.query)}">
        ${p.label}
      </button>
    `).join('');

    chipContainer.querySelectorAll('.chat-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        if (query) {
          handleUserMessage(query);
        }
      });
    });
  }

  // Chat message submission
  function submitCurrentInput() {
    const text = chatInput.value.trim();
    if (!text) return;
    chatInput.value = '';
    handleUserMessage(text);
  }

  if (chatSendBtn) chatSendBtn.addEventListener('click', submitCurrentInput);
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitCurrentInput();
      }
    });
  }

  if (chatbotClearBtn) {
    chatbotClearBtn.addEventListener('click', () => {
      chatMessages.innerHTML = '';
      appendBotGreeting();
    });
  }

  // Add initial bot greeting if empty
  if (chatMessages && chatMessages.children.length === 0) {
    appendBotGreeting();
  }

  function appendBotGreeting() {
    appendMessage('bot', `
      <p>👋 <strong>Welcome to your OmniFlow AI Study Assistant!</strong></p>
      <p>I am your dedicated mentor for <strong>MaharaTech Course 2305 (Implementing & Developing SQL Server Objects)</strong> and enterprise <strong>Database Reliability Engineering (DBRE)</strong>.</p>
      <p>How can I assist your learning today? Ask me about:</p>
      <ul>
        <li>Peter Chen ERD mapping rules & circular foreign keys</li>
        <li>Storage internals (8 KB pages, extents, filegroups)</li>
        <li>B-Tree indexes, covering indexes & the tipping point</li>
        <li>ACID transactions, concurrency & isolation levels</li>
        <li>T-SQL error debugging (Msg 8115, Msg 547, Msg 2627, etc.)</li>
        <li>Kimball dimensional modeling & Star Schema ETL</li>
      </ul>
      <p><em>Click any prompt chip below or type your question directly!</em></p>
    `);
  }

  function appendMessage(sender, htmlContent, queryToRun = null) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender === 'user' ? 'chat-msg-user' : 'chat-msg-bot'}`;

    let runBtnHtml = '';
    if (queryToRun) {
      runBtnHtml = `
        <div class="chat-code-actions">
          <button class="btn btn-sm btn-cyan run-in-playground-btn" data-sql="${escapeHtml(queryToRun)}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Run in Playground 🚀
          </button>
        </div>
      `;
    }

    msgDiv.innerHTML = `
      <div class="chat-msg-avatar">
        ${sender === 'user' 
          ? '<span style="font-size: 1.1rem;">👤</span>' 
          : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M9 13v2"/><path d="M15 13v2"/></svg>'
        }
      </div>
      <div class="chat-msg-body">
        ${htmlContent}
        ${runBtnHtml}
      </div>
    `;

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Attach runner handler if query present
    const runnerBtn = msgDiv.querySelector('.run-in-playground-btn');
    if (runnerBtn && onRunInPlayground) {
      runnerBtn.addEventListener('click', () => {
        const sql = runnerBtn.getAttribute('data-sql');
        if (sql) {
          onRunInPlayground(sql);
          toggleDrawer(false);
        }
      });
    }
  }

  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-msg chat-msg-bot typing-indicator-msg';
    typingDiv.innerHTML = `
      <div class="chat-msg-avatar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M9 13v2"/><path d="M15 13v2"/></svg>
      </div>
      <div class="chat-msg-body">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingDiv;
  }

  // Knowledge retrieval & response generation
  function handleUserMessage(text) {
    appendMessage('user', `<p>${escapeHtml(text)}</p>`);

    const typingNode = showTypingIndicator();

    setTimeout(() => {
      typingNode.remove();
      const answer = generateKnowledgeAnswer(text);
      appendMessage('bot', answer.html, answer.query);
    }, 400);
  }
}

/**
 * Intelligent Knowledge Base Engine
 * Maps user queries to grounded MaharaTech Course 2305 concepts and T-SQL solutions
 */
function generateKnowledgeAnswer(query) {
  const q = query.toLowerCase();

  // 1. Peter Chen ERD Mapping & Circular Dependencies
  if (q.includes('erd') || q.includes('chen') || q.includes('rule') || q.includes('mapping')) {
    const sampleSql = `SELECT 
    e.SSN,
    e.FName || ' ' || e.LName AS EmployeeName,
    d.DName AS Department,
    COALESCE(s.FName || ' ' || s.LName, 'Top Executive') AS Supervisor
FROM Employee e
LEFT JOIN Department d ON e.Dno = d.DNum
LEFT JOIN Employee s ON e.SuperSSN = s.SSN;`;

    return {
      html: `
        <h4>📐 Peter Chen ERD to Relational Mapping Rules (Course CH01)</h4>
        <p>In MaharaTech Course 2305, translating a conceptual Peter Chen ERD into 3NF relations follows 6 fundamental rules:</p>
        <ol>
          <li><strong>Regular Entity Types</strong>: Map <code>Employee</code>, <code>Department</code>, and <code>Project</code> with atomic primary keys (e.g., <code>SSN</code>, <code>DNum</code>, <code>PNum</code>).</li>
          <li><strong>Weak Entity Types</strong>: Weak entities like <code>Dependent</code> do not have a primary key of their own. They require the identifying owner's key (<code>ESSN</code>) + partial key (<code>DependentName</code>) as a composite primary key with <code>ON DELETE CASCADE</code>.</li>
          <li><strong>Binary 1:1 Relationships</strong>: In <code>Department.Manage</code>, place the foreign key (<code>MgrSSN</code>) in the entity with total participation (Department), along with relationship attributes like <code>MgrHireDate</code>.</li>
          <li><strong>Binary 1:N Relationships</strong>: The 'N' side receives the foreign key (e.g., <code>Employee.Dno -> Department.DNum</code>).</li>
          <li><strong>Binary M:N Relationships</strong>: Create a separate associative relation (<code>WorksOn</code>) whose composite PK is <code>(ESSN, PNo)</code> plus relationship attributes (<code>Hours</code>).</li>
          <li><strong>Multi-Valued Attributes</strong>: Multi-valued attributes like <code>Dept.loc</code> must be broken into a separate child table (<code>DeptLocations</code>) with composite PK <code>(DNum, Location)</code> and <code>ON DELETE CASCADE</code>.</li>
        </ol>
      `,
      query: sampleSql
    };
  }

  // 2. Circular Foreign Keys
  if (q.includes('circular') || q.includes('fk') || q.includes('deadlock') || q.includes('mgrssn')) {
    const sampleSql = `-- Inspect circular cross-references between Employee and Department
SELECT 
    d.DNum,
    d.DName,
    d.MgrSSN,
    m.FName || ' ' || m.LName AS ManagerName,
    COUNT(e.SSN) AS DepartmentStaffCount
FROM Department d
LEFT JOIN Employee m ON d.MgrSSN = m.SSN
LEFT JOIN Employee e ON d.DNum = e.Dno
GROUP BY d.DNum, d.DName, d.MgrSSN, ManagerName;`;

    return {
      html: `
        <h4>🔄 Circular Foreign Key Resolution in DBRE</h4>
        <p>A classic circular dependency exists in the Company schema:</p>
        <ul>
          <li><code>Employee.Dno</code> references <code>Department.DNum</code></li>
          <li><code>Department.MgrSSN</code> references <code>Employee.SSN</code></li>
        </ul>
        <p><strong>DBRE Solution Pattern</strong>:</p>
        <ol>
          <li>Create both tables first: mark <code>MgrSSN</code> in <code>Department</code> as <code>NULLABLE</code>.</li>
          <li>Bind the 1:N constraint: <code>FK_Employee_Department</code>.</li>
          <li>Seed the initial departments with <code>MgrSSN = NULL</code>.</li>
          <li>Seed the employees with their assigned department.</li>
          <li>Update <code>Department.MgrSSN</code> with valid employee SSNs.</li>
          <li>Apply the <code>ALTER TABLE Department ADD CONSTRAINT FK_Department_Manager</code> foreign key.</li>
        </ol>
      `,
      query: sampleSql
    };
  }

  // 3. Query Optimizer Tipping Point & Indexing
  if (q.includes('tipping') || q.includes('seek') || q.includes('scan') || q.includes('index') || q.includes('plan')) {
    const sampleSql = `-- Query that hits the Covering Index (Zero Key Lookup cost)
SELECT 
    e.SSN,
    e.Salary,
    e.Dno
FROM Employee e
WHERE e.Dno = 1
ORDER BY e.Salary DESC;`;

    return {
      html: `
        <h4>⚡ Query Optimizer Tipping Point & B-Tree Mechanics</h4>
        <p>The <strong>Tipping Point</strong> is the exact selectivity threshold where the SQL Server Query Optimizer abandons an <strong>Index Seek + Key Lookup</strong> and instead picks a full <strong>Clustered Index Scan</strong> or Table Scan.</p>
        <p><strong>Key Takeaways:</strong></p>
        <ul>
          <li><strong>The Range</strong>: Typically between <strong>2% and 5%</strong> selectivity. If a query matches more than ~2.5% of rows, random 8 KB page lookups cost more CPU and I/O than a single sequential read.</li>
          <li><strong>The Root Cause</strong>: Each Key Lookup requires a separate traversal of the Clustered Index B-Tree from Root to Leaf.</li>
          <li><strong>The DBRE Solution</strong>: Use a <strong>Covering Non-Clustered Index</strong> with the <code>INCLUDE</code> clause. By including the projected columns, the query engine satisfies the request entirely from the leaf level without Key Lookups!</li>
        </ul>
        <p><em>Check out our <strong>Plan Simulator</strong> tab for an interactive visual demonstration!</em></p>
      `,
      query: sampleSql
    };
  }

  // 4. ACID & XACT_ABORT
  if (q.includes('acid') || q.includes('xact_abort') || q.includes('transaction') || q.includes('catch') || q.includes('rollback')) {
    const sampleSql = `-- Demonstrating transactional safety with SAVEPOINT and error handling
SELECT 
    d.DName,
    SUM(e.Salary) AS TotalBudget,
    AVG(e.Salary) AS AverageSalary
FROM Department d
JOIN Employee e ON d.DNum = e.Dno
GROUP BY d.DName;`;

    return {
      html: `
        <h4>🛡️ Transaction Engineering & SET XACT_ABORT ON</h4>
        <p>In SQL Server, writing safe transactional stored procedures requires strict defensive programming:</p>
        <ul>
          <li><strong>The Hazard</strong>: By default, SQL Server does <em>not</em> automatically rollback on certain severity errors (like constraint violations or statement timeouts). The transaction remains open, holding exclusive locks and leaking uncommitted state!</li>
          <li><strong>The Fix</strong>: Always start transactional procedures with:
            <pre><code>SET XACT_ABORT, NOCOUNT ON;</code></pre>
          </li>
          <li><strong>State Machine</strong>: Inside <code>BEGIN CATCH</code>, always inspect <code>XACT_STATE()</code>:
            <ul>
              <li><code>XACT_STATE() = -1</code>: Transaction is uncommittable; you <strong>must ROLLBACK</strong>.</li>
              <li><code>XACT_STATE() = 1</code>: Transaction is still valid; you can commit or rollback.</li>
            </ul>
          </li>
        </ul>
      `,
      query: sampleSql
    };
  }

  // 5. Kimball Star Schema & SCD Type 2
  if (q.includes('kimball') || q.includes('star') || q.includes('scd') || q.includes('dw') || q.includes('dimension') || q.includes('fact')) {
    const sampleSql = `-- Kimball Star Schema: Tracking customer postal address history via SCD Type 2
SELECT 
    CustomerSK,
    CustomerId,
    CustomerName,
    PostalCode,
    ValidFrom,
    ValidTo,
    CASE WHEN IsCurrent = 1 THEN 'Current 🟢' ELSE 'Historical ⚪' END AS Status
FROM DimCustomer
ORDER BY CustomerId, ValidFrom;`;

    return {
      html: `
        <h4>⭐ Kimball Dimensional Modeling & SCD Type 2</h4>
        <p>In Course 2305 (and Module 07 of this platform), we bridge the gap from <strong>OLTP (Normalized 3NF)</strong> to <strong>OLAP (Dimensional Kimball Star Schema)</strong>:</p>
        <ul>
          <li><strong>Fact Tables</strong>: Contain foreign surrogate keys and additive numerical business metrics (e.g., <code>FactSales.Quantity</code>, <code>FactSales.NetSalesAmount</code>).</li>
          <li><strong>Dimension Tables</strong>: Contain descriptive attributes with surrogate keys (e.g., <code>CustomerSK</code>).</li>
          <li><strong>SCD Type 1</strong>: Overwrites existing attribute (no history).</li>
          <li><strong>SCD Type 2</strong>: Preserves historical truth by adding a new row with <code>ValidFrom</code>, <code>ValidTo</code>, and <code>IsCurrent</code> flags. This enables accurate point-in-time revenue reporting.</li>
        </ul>
      `,
      query: sampleSql
    };
  }

  // 6. Error Diagnostics (Msg 8115, Msg 547, Msg 2627, etc.)
  if (q.includes('8115') || q.includes('overflow') || q.includes('547') || q.includes('2627') || q.includes('error') || q.includes('debug')) {
    const sampleSql = `-- Defensive casting prevents Msg 8115 arithmetic overflow
SELECT 
    p.PNum,
    p.PName,
    CAST(COUNT(w.ESSN) AS BIGINT) * 100 AS ScaledMetric
FROM Project p
LEFT JOIN WorksOn w ON p.PNum = w.PNo
GROUP BY p.PNum, p.PName;`;

    return {
      html: `
        <h4>🐞 T-SQL Error Code Diagnosis & DBRE Fixes</h4>
        <ul>
          <li><strong>Msg 8115: Arithmetic overflow error converting expression to data type int</strong>:
            <br/><em>Cause:</em> An aggregation or multiplication exceeded <code>2,147,483,647</code>.
            <br/><em>Fix:</em> Cast operands to <code>BIGINT</code> before multiplying, or use <code>COUNT_BIG()</code> instead of <code>COUNT()</code>.
          </li>
          <li><strong>Msg 547: The INSERT/UPDATE statement conflicted with the FOREIGN KEY constraint</strong>:
            <br/><em>Cause:</em> Attempted to insert a child row with a parent ID that does not exist.
            <br/><em>Fix:</em> Verify parent table exists or wrap in an idempotent validation check.
          </li>
          <li><strong>Msg 2627 / 2601: Violation of PRIMARY KEY / UNIQUE constraint</strong>:
            <br/><em>Cause:</em> Duplicate key inserted.
            <br/><em>Fix:</em> Use <code>MERGE</code> or <code>IF NOT EXISTS (...) INSERT ...</code>.
          </li>
          <li><strong>Msg 8645: A timeout occurred while waiting for memory resources to execute the query</strong>:
            <br/><em>Cause:</em> Excessive memory grant requested by Columnstore or Hash joins under desktop limits.
            <br/><em>Fix:</em> Cap query with <code>OPTION (MAXDOP 1)</code> and eliminate oversized <code>VARCHAR(MAX)</code> sort operations.
          </li>
        </ul>
      `,
      query: sampleSql
    };
  }

  // 7. Practice Query / Challenge
  if (q.includes('practice') || q.includes('challenge') || q.includes('problem') || q.includes('exercise')) {
    const sampleSql = `-- Practice Challenge: Identify Departments where every project has at least 2 staff
SELECT 
    d.DName AS Department,
    p.PName AS ProjectName,
    COUNT(w.ESSN) AS StaffCount,
    ROUND(SUM(w.Hours), 1) AS TotalHours
FROM Department d
JOIN Project p ON d.DNum = p.DNum
JOIN WorksOn w ON p.PNum = w.PNo
GROUP BY d.DName, p.PName
HAVING COUNT(w.ESSN) >= 2
ORDER BY TotalHours DESC;`;

    return {
      html: `
        <h4>🎯 Practice Challenge: Departmental Project Staffing Analysis</h4>
        <p><strong>Business Requirement:</strong>
        Find all departments and their projects where <strong>at least 2 employees</strong> are actively assigned. Display the department name, project title, total headcount, and total allocated weekly hours.</p>
        <p><strong>Concepts Tested:</strong> Multi-table INNER JOIN, GROUP BY, and HAVING aggregate filter.</p>
        <p><em>Click the button below to test this query in the SQL Playground, or visit the new <strong>Challenges Arena</strong> tab for interactive graded problems!</em></p>
      `,
      query: sampleSql
    };
  }

  // Default fallback response
  const defaultSql = `SELECT 
    e.FName || ' ' || e.LName AS Employee,
    e.Salary,
    d.DName AS Department
FROM Employee e
JOIN Department d ON e.Dno = d.DNum
WHERE e.Salary > 30000
ORDER BY e.Salary DESC;`;

  return {
    html: `
      <h4>💡 DBRE Study Mentor Insights</h4>
      <p>You asked about: <em>"${escapeHtml(query)}"</em></p>
      <p>Here are core database engineering principles relevant to your inquiry:</p>
      <ul>
        <li><strong>Set-Based Thinking</strong>: SQL Server operates on sets. Avoid procedural row-by-row cursors and Scalar UDFs in the <code>WHERE</code> clause; use Inline Table-Valued Functions (ITVFs) instead to allow query optimizer parallelization.</li>
        <li><strong>Physical Layout</strong>: Isolate user tables onto dedicated filegroups (<code>DATA_FG</code>) and indexes onto <code>INDEX_FG</code> to avoid system catalog contention on <code>PRIMARY</code>.</li>
        <li><strong>Concurrency</strong>: Prefer Read Committed Snapshot Isolation (<code>RCSI</code>) in OLTP systems to prevent read-write blocking.</li>
      </ul>
      <p>Try running the query below in the Playground to explore this concept live!</p>
    `,
    query: defaultSql
  };
}

function escapeHtml(str) {
  if (!str) return '';
  return str.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
