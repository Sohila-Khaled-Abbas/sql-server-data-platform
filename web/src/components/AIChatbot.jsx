import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Trash2, X, Play, Sparkles, User, Terminal } from 'lucide-react';

const QUICK_CHIPS = [
  { label: '📐 3NF ERD Mapping', query: 'Explain the 6 Peter Chen ERD mapping rules into 3NF relational tables.' },
  { label: '🔄 Circular FKs', query: 'How do we solve circular foreign keys between Employee and Department in T-SQL?' },
  { label: '⚡ Index Tipping Point', query: 'What is the query optimizer tipping point between Index Seek and Table Scan?' },
  { label: '🛡️ ACID & XACT_ABORT', query: 'Why is SET XACT_ABORT ON essential with TRY...CATCH in transactional stored procedures?' },
  { label: '⭐ Kimball SCD Type 2', query: 'Explain Slowly Changing Dimension (SCD) Type 2 in Kimball Star Schemas with an example.' },
  { label: '🐞 Debug Msg 8115', query: 'How do I debug SQL Server Msg 8115: Arithmetic overflow error converting expression to data type int?' },
  { label: '🚀 Practice Query', query: 'Give me a challenging practice SQL query on the Company Database.' }
];

function generateKnowledgeAnswer(query) {
  const q = query.toLowerCase();

  if (q.includes('erd') || q.includes('chen') || q.includes('rule') || q.includes('mapping')) {
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
      query: `SELECT 
    e.SSN,
    e.FName || ' ' || e.LName AS EmployeeName,
    d.DName AS Department,
    COALESCE(s.FName || ' ' || s.LName, 'Top Executive') AS Supervisor
FROM Employee e
LEFT JOIN Department d ON e.Dno = d.DNum
LEFT JOIN Employee s ON e.SuperSSN = s.SSN;`
    };
  }

  if (q.includes('circular') || q.includes('fk') || q.includes('deadlock') || q.includes('mgrssn')) {
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
      query: `-- Inspect circular cross-references between Employee and Department
SELECT 
    d.DNum,
    d.DName,
    d.MgrSSN,
    m.FName || ' ' || m.LName AS ManagerName,
    COUNT(e.SSN) AS DepartmentStaffCount
FROM Department d
LEFT JOIN Employee m ON d.MgrSSN = m.SSN
LEFT JOIN Employee e ON d.DNum = e.Dno
GROUP BY d.DNum, d.DName, d.MgrSSN, ManagerName;`
    };
  }

  if (q.includes('tipping') || q.includes('seek') || q.includes('scan') || q.includes('index') || q.includes('plan')) {
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
      `,
      query: `-- Query that hits the Covering Index (Zero Key Lookup cost)
SELECT 
    e.SSN,
    e.Salary,
    e.Dno
FROM Employee e
WHERE e.Dno = 1
ORDER BY e.Salary DESC;`
    };
  }

  if (q.includes('acid') || q.includes('xact_abort') || q.includes('transaction') || q.includes('catch') || q.includes('rollback')) {
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
      query: `-- Demonstrating transactional safety with aggregation
SELECT 
    d.DName,
    SUM(e.Salary) AS TotalBudget,
    AVG(e.Salary) AS AverageSalary
FROM Department d
JOIN Employee e ON d.DNum = e.Dno
GROUP BY d.DName;`
    };
  }

  if (q.includes('kimball') || q.includes('star') || q.includes('scd') || q.includes('dw') || q.includes('dimension') || q.includes('fact')) {
    return {
      html: `
        <h4>⭐ Kimball Dimensional Modeling & SCD Type 2</h4>
        <p>In Course 2305 (and Module 07 of this platform), we bridge the gap from <strong>OLTP (Normalized 3NF)</strong> to <strong>OLAP (Dimensional Kimball Star Schema)</strong>:</p>
        <ul>
          <li><strong>Fact Tables</strong>: Contain foreign surrogate keys and additive numerical business metrics (e.g., <code>FactSales.Quantity</code>, <code>FactSales.NetSalesAmount</code>).</li>
          <li><strong>Dimension Tables</strong>: Contain descriptive attributes with surrogate keys (e.g., <code>CustomerSK</code>).</li>
          <li><strong>SCD Type 1</strong>: Overwrites existing attribute (no history).</li>
          <li><strong>SCD Type 2</strong>: Preserves historical truth by adding a new row with <code>ValidFrom</code>, <code>ValidTo</code>, and <code>IsCurrent</code> flags.</li>
        </ul>
      `,
      query: `-- Kimball Star Schema: Tracking customer postal address history via SCD Type 2
SELECT 
    CustomerSK,
    CustomerId,
    CustomerName,
    PostalCode,
    ValidFrom,
    ValidTo,
    CASE WHEN IsCurrent = 1 THEN 'Current 🟢' ELSE 'Historical ⚪' END AS Status
FROM DimCustomer
ORDER BY CustomerId, ValidFrom;`
    };
  }

  if (q.includes('8115') || q.includes('overflow') || q.includes('547') || q.includes('2627') || q.includes('error') || q.includes('debug')) {
    return {
      html: `
        <h4>🐞 T-SQL Error Code Diagnosis & DBRE Fixes</h4>
        <ul>
          <li><strong>Msg 8115: Arithmetic overflow error converting expression to data type int</strong>:
            <br/><em>Cause:</em> An aggregation or multiplication exceeded <code>2,147,483,647</code>.
            <br/><em>Fix:</em> Cast operands to <code>BIGINT</code> before multiplying, or use <code>COUNT_BIG()</code>.
          </li>
          <li><strong>Msg 547: The INSERT/UPDATE statement conflicted with the FOREIGN KEY constraint</strong>:
            <br/><em>Cause:</em> Attempted to insert a child row with a non-existent parent ID.
            <br/><em>Fix:</em> Verify parent record exists or wrap in validation check.
          </li>
          <li><strong>Msg 2627: Violation of PRIMARY KEY / UNIQUE constraint</strong>:
            <br/><em>Fix:</em> Use <code>MERGE</code> or <code>IF NOT EXISTS (...) INSERT ...</code>.
          </li>
        </ul>
      `,
      query: `-- Defensive casting prevents Msg 8115 arithmetic overflow
SELECT 
    p.PNum,
    p.PName,
    CAST(COUNT(w.ESSN) AS BIGINT) * 100 AS ScaledMetric
FROM Project p
LEFT JOIN WorksOn w ON p.PNum = w.PNo
GROUP BY p.PNum, p.PName;`
    };
  }

  // Fallback
  return {
    html: `
      <h4>💡 DBRE Study Mentor Insights</h4>
      <p>Here are core database engineering principles relevant to your inquiry:</p>
      <ul>
        <li><strong>Set-Based Thinking</strong>: SQL Server operates on sets. Avoid procedural row-by-row cursors and Scalar UDFs in the <code>WHERE</code> clause; use Inline Table-Valued Functions (ITVFs) instead to allow query optimizer parallelization.</li>
        <li><strong>Physical Layout</strong>: Isolate user tables onto dedicated filegroups (<code>DATA_FG</code>) and indexes onto <code>INDEX_FG</code> to avoid system catalog contention on <code>PRIMARY</code>.</li>
        <li><strong>Concurrency</strong>: Prefer Read Committed Snapshot Isolation (<code>RCSI</code>) in OLTP systems to prevent read-write blocking.</li>
      </ul>
    `,
    query: `SELECT 
    e.FName || ' ' || e.LName AS Employee,
    e.Salary,
    d.DName AS Department
FROM Employee e
JOIN Department d ON e.Dno = d.DNum
WHERE e.Salary > 30000
ORDER BY e.Salary DESC;`
  };
}

export default function AIChatbot({ isOpen, onClose, onRunInPlayground }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      html: `
        <p>👋 <strong>Welcome to your Microsoft SQL Server & DBRE AI Study Mentor!</strong></p>
        <p>I am your dedicated mentor for <strong>MaharaTech Course 2305 (Implementing & Developing SQL Server Objects)</strong> and enterprise database engineering.</p>
        <p>Ask me about:</p>
        <ul>
          <li>Peter Chen ERD mapping rules & circular foreign keys</li>
          <li>Storage internals (8 KB pages, extents, filegroups)</li>
          <li>B-Tree indexes, covering indexes & the tipping point</li>
          <li>ACID transactions, concurrency & isolation levels</li>
          <li>T-SQL error debugging (Msg 8115, Msg 547, Msg 2627, etc.)</li>
          <li>Kimball dimensional modeling & Star Schema ETL</li>
        </ul>
      `
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    setMessages(prev => [...prev, { sender: 'user', html: `<p>${text}</p>` }]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const answer = generateKnowledgeAnswer(text);
      setMessages(prev => [...prev, { sender: 'bot', html: answer.html, query: answer.query }]);
    }, 450);
  };

  const handleClear = () => {
    setMessages([
      {
        sender: 'bot',
        html: `<p>Chat history cleared. How can I help you with your SQL Server studies?</p>`
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-drawer-overlay" onClick={onClose}>
      <div className="chatbot-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="chatbot-header">
          <div className="flex items-center gap-2.5">
            <div className="bot-avatar">
              <Bot className="w-5 h-5 text-ms-red" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3>DBRE Study Mentor</h3>
                <span className="online-indicator" />
              </div>
              <p className="text-xs text-gray-400">MaharaTech Course 2305 & MSSQL Expert</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleClear} className="drawer-btn" title="Clear Chat">
              <Trash2 className="w-4 h-4 text-gray-400 hover:text-rose-400" />
            </button>
            <button onClick={onClose} className="drawer-btn" title="Close Drawer">
              <X className="w-4 h-4 text-gray-400 hover:text-white" />
            </button>
          </div>
        </div>

        {/* Quick Prompt Chips */}
        <div className="chatbot-chips-bar">
          {QUICK_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              className="chat-chip-btn"
              onClick={() => handleSend(chip.query)}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Messages List */}
        <div className="chatbot-messages">
          {messages.map((m, idx) => (
            <div key={idx} className={`chat-message ${m.sender === 'user' ? 'msg-user' : 'msg-bot'}`}>
              <div className="msg-avatar-col">
                {m.sender === 'user' ? (
                  <div className="user-icon-box"><User className="w-4 h-4" /></div>
                ) : (
                  <div className="bot-icon-box"><Bot className="w-4 h-4 text-ms-red" /></div>
                )}
              </div>
              <div className="msg-content-col">
                <div className="msg-bubble" dangerouslySetInnerHTML={{ __html: m.html }} />
                {m.query && (
                  <div className="msg-query-action">
                    <button
                      className="run-in-studio-btn"
                      onClick={() => {
                        if (onRunInPlayground) {
                          onRunInPlayground(m.query);
                          onClose();
                        }
                      }}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Run in Query Studio
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-message msg-bot">
              <div className="msg-avatar-col">
                <div className="bot-icon-box"><Bot className="w-4 h-4 text-ms-red" /></div>
              </div>
              <div className="msg-content-col">
                <div className="typing-dots">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="chatbot-input-bar">
          <input
            type="text"
            placeholder="Ask anything about Course 2305, T-SQL, ACID, ERD, DMVs..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            className="send-btn"
            onClick={() => handleSend()}
            disabled={!inputVal.trim()}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
