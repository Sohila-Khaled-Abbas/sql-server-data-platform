/**
 * OmniFlow AI Mentor Multi-Model Service
 * ======================================
 * Supports:
 * 1. Local Ollama (auto-detects models on localhost:11434, e.g. qwen2.5, llama3.2)
 * 2. Google Antigravity / Gemini API (via user key / proxy)
 * 3. Anthropic Claude API (via user key / proxy)
 * 4. Offline High-Fidelity DBRE Knowledge Engine (zero-config fallback)
 *
 * Automatically injects Windows PC & SQL Server 2022 environment telemetry,
 * active ITItest database schema, and current page context.
 */

// Local Ollama endpoints (Vite proxy fallback + direct)
const OLLAMA_ENDPOINTS = [
  '/api/ollama',
  'http://localhost:11434'
];

/**
 * Probes the local environment to discover active Ollama models.
 * @returns {Promise<{ available: boolean, models: Array<string>, endpoint: string }>}
 */
export async function detectOllama() {
  for (const ep of OLLAMA_ENDPOINTS) {
    try {
      const res = await fetch(`${ep}/api/tags`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(2500)
      });
      if (res.ok) {
        const data = await res.json();
        const models = (data.models || []).map(m => m.name || m.model);
        return {
          available: true,
          models: models.length > 0 ? models : ['qwen2.5:3b', 'llama3.2:3b'],
          endpoint: ep
        };
      }
    } catch (e) {
      // Continue to next endpoint attempt
    }
  }

  return {
    available: false,
    models: [],
    endpoint: null
  };
}

/**
 * Builds high-density system prompt contextualized with local PC, active DB and active page.
 */
export function buildSystemPrompt(pageContext = {}) {
  const activeTab = pageContext.activeTab || 'roadmap';
  const activeLesson = pageContext.activeLesson || null;
  const currentQuery = pageContext.currentQuery || null;

  return `You are the OmniFlow AI Mentor for Microsoft SQL Server 2022 & Database Reliability Engineering (DBRE), specialized in MaharaTech Course 2305 ("Implementing and Developing SQL Server Objects" by Eng. Rami Mohamed Abonagi).

=== LOCAL ENVIRONMENT & WORKSTATION CONTEXT ===
- Host Operating System: Windows 11 (64-bit)
- Database Engine: Microsoft SQL Server 2022 Developer Edition (Instance: '.')
- Active Local Database: [ITItest]
- Physical Storage Path: D:\\courses\\Data Science\\Data Engineering\\MaharaTech\\Implementing and Developing SQL server objects\\CH01\\Mydb
- Multi-Filegroup Layout:
  * PRIMARY: ITItest.mdf (System Catalogs & Schemas)
  * fg1: file2.ndf (Core Relational Entities)
  * fg2: file3.ndf (Associations & Projects)
  * fg3: file4.ndf (Indexes, Reporting & Staging Data)
  * LOG: ITItest_log.ldf (Write-Ahead Log)
- Live Verified Tables:
  * dbo.depts (did INT PRIMARY KEY, dname NVARCHAR(50))
  * dbo.emp (eid INT PRIMARY KEY, ename NVARCHAR(50), salary MONEY, eadd NVARCHAR(50) DEFAULT 'cairo', dnum INT FOREIGN KEY REFERENCES depts(did), overtime MONEY, hiredate DATE, bd DATE, age AS (YEAR(GETDATE()) - YEAR(bd)), netsal AS (ISNULL(salary, 0) + ISNULL(overtime, 0)))
- Course Curriculum: 102 Lessons across 7 Chapters (Storage, T-SQL Essentials, Indexing & HA, Procedures/Triggers/CLR, Warehousing & SSRS).

=== CURRENT APPLICATION STATE ===
- Active Navigation Tab: ${activeTab}
${activeLesson ? `- Current Active Lesson: [${activeLesson.videoCode}] ${activeLesson.title} (Chapter ${activeLesson.chapter})\n- Lesson Objective: ${activeLesson.description || 'Master SQL Server concept'}\n- Target Script: ${activeLesson.repoPath}` : ''}
${currentQuery ? `- User Query in Query Studio Editor:\n\`\`\`sql\n${currentQuery}\n\`\`\`` : ''}

=== RESPONSE GUIDELINES ===
1. Answer concisely, authoritatively, and with production-grade T-SQL code examples.
2. Ground your explanations in Microsoft SQL Server 2022 architecture (8 KB pages, B-Tree leaf levels, ACID boundaries, RCSI snapshot isolation, Kimball Star Schemas).
3. Whenever providing executable SQL queries, format them in clean triple-backtick markdown blocks \`\`\`sql ... \`\`\` so the user can easily run them in the Query Studio.
4. If the user asks about errors (e.g. Msg 8115, Msg 547, Msg 2627), provide the exact root cause and defensive fix.`;
}

/**
 * Send message to Ollama
 */
async function chatOllama({ endpoint, model, messages, systemPrompt, onStream }) {
  const url = `${endpoint}/api/chat`;
  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text || stripHtml(m.html)
    }))
  ];

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model || 'qwen2.5:3b',
      messages: formattedMessages,
      stream: Boolean(onStream)
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama returned status ${response.status}: ${response.statusText}`);
  }

  if (onStream && response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunkStr = decoder.decode(value, { stream: true });
      const lines = chunkStr.split('\n').filter(Boolean);
      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.message?.content) {
            fullText += json.message.content;
            onStream(fullText);
          }
        } catch (e) {
          // ignore chunk parse errors
        }
      }
    }
    return fullText;
  } else {
    const json = await response.json();
    return json.message?.content || 'No response received from local Ollama.';
  }
}

/**
 * Send message to Google Gemini / Antigravity
 */
async function chatGemini({ apiKey, model, messages, systemPrompt }) {
  const modelName = model || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: `${systemPrompt}\n\nUser Question:\n${messages[messages.length - 1].text || stripHtml(messages[messages.length - 1].html)}` }]
    }
  ];

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${err}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return text || 'No response received from Google Gemini.';
}

/**
 * Send message to Anthropic Claude
 */
async function chatClaude({ apiKey, model, messages, systemPrompt }) {
  const modelName = model || 'claude-3-5-sonnet-20241022';
  const url = 'https://api.anthropic.com/v1/messages';

  const formattedMessages = messages
    .filter(m => m.sender === 'user' || m.sender === 'bot')
    .map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text || stripHtml(m.html)
    }));

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'dangerously-allow-browser': 'true'
    },
    body: JSON.stringify({
      model: modelName,
      max_tokens: 2048,
      system: systemPrompt,
      messages: formattedMessages
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API error (${response.status}): ${err}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || 'No response received from Claude.';
}

/**
 * Main dispatch function for AI Mentor
 */
export async function sendMentorMessage({
  provider,
  model,
  messages,
  pageContext,
  apiKey,
  onStream
}) {
  const systemPrompt = buildSystemPrompt(pageContext);

  if (provider === 'ollama') {
    const detection = await detectOllama();
    if (!detection.available) {
      throw new Error('Local Ollama is not reachable on http://localhost:11434. Please start Ollama or switch to another provider.');
    }
    return await chatOllama({
      endpoint: detection.endpoint,
      model: model || detection.models[0] || 'qwen2.5:3b',
      messages,
      systemPrompt,
      onStream
    });
  }

  if (provider === 'gemini') {
    if (!apiKey) {
      throw new Error('Google Gemini API Key is required. Please configure your key in settings.');
    }
    return await chatGemini({ apiKey, model, messages, systemPrompt });
  }

  if (provider === 'claude') {
    if (!apiKey) {
      throw new Error('Anthropic Claude API Key is required. Please configure your key in settings.');
    }
    return await chatClaude({ apiKey, model, messages, systemPrompt });
  }

  // Fallback to offline knowledge base
  const lastMsg = messages[messages.length - 1];
  const query = lastMsg?.text || stripHtml(lastMsg?.html || '');
  return generateOfflineKnowledgeAnswer(query, pageContext);
}

/**
 * Built-in Offline Knowledge Engine with rich Course 2305 intelligence.
 */
export function generateOfflineKnowledgeAnswer(query, pageContext = {}) {
  const q = query.toLowerCase();

  if (q.includes('erd') || q.includes('chen') || q.includes('mapping') || q.includes('3nf')) {
    return {
      text: `### 📐 Peter Chen ERD to 3NF Relational Mapping Rules (MaharaTech Course CH01)
Translating an ER diagram into 3NF tables in Microsoft SQL Server adheres to 6 core transformation rules:

1. **Regular Entity Sets** → Base table on \`DATA_FG\` with primary key (\`SSN\`, \`DNum\`, \`PNum\`).
2. **Weak Entity Sets** → Child table (\`Dependent\`) with composite PK (\`ESSN, DependentName\`) and \`ON DELETE CASCADE\`.
3. **Binary 1:1 Relationships** → Foreign key placed in the entity with total participation (\`Department.MgrSSN\` referencing \`Employee.SSN\`).
4. **Binary 1:N Relationships** → Foreign key placed on the 'N' side table (\`Employee.Dno\` referencing \`Department.DNum\`).
5. **Binary M:N Relationships** → Dedicated associative table (\`WorksOn\`) with composite PK \`([ESSN], [PNo])\` and attributes (\`Hours\`).
6. **Multi-Valued Attributes** → Separate table (\`DeptLocations\`) with composite PK \`([DNum], [Location])\`.`,
      query: `SELECT 
    e.SSN,
    e.FName + ' ' + e.LName AS EmployeeName,
    d.DName AS DepartmentName,
    ISNULL(m.FName + ' ' + m.LName, 'No Manager') AS Manager
FROM Employee e
INNER JOIN Department d ON e.Dno = d.DNum
LEFT JOIN Employee m ON d.MgrSSN = m.SSN;`
    };
  }

  if (q.includes('circular') || q.includes('fk') || q.includes('constraint') || q.includes('mgrssn')) {
    return {
      text: `### 🔄 Circular Foreign Key Resolution in SQL Server
The Company schema contains a classic circular dependency:
- \`Employee.Dno\` references \`Department.DNum\`
- \`Department.MgrSSN\` references \`Employee.SSN\`

**Production DBRE Solution Pattern**:
1. Create both tables first with \`MgrSSN\` nullable.
2. Bind the forward key: \`ALTER TABLE Employee ADD CONSTRAINT FK_Employee_Department FOREIGN KEY (Dno) REFERENCES Department(DNum)\`.
3. Seed the departments with \`MgrSSN = NULL\`.
4. Seed the employees with their \`Dno\`.
5. Update \`Department.MgrSSN\` with valid \`Employee.SSN\` values.
6. Apply the reverse constraint: \`ALTER TABLE Department ADD CONSTRAINT FK_Department_Manager FOREIGN KEY (MgrSSN) REFERENCES Employee(SSN)\`.`,
      query: `-- Check Department Managers and Team Counts in ITItest
SELECT 
    d.did,
    d.dname,
    COUNT(e.eid) AS TotalStaff,
    AVG(e.salary) AS AvgSalary
FROM dbo.depts d
LEFT JOIN dbo.emp e ON d.did = e.dnum
GROUP BY d.did, d.dname;`
    };
  }

  if (q.includes('index') || q.includes('tipping') || q.includes('seek') || q.includes('scan') || q.includes('btree')) {
    return {
      text: `### ⚡ B-Tree Indexes, The Tipping Point & Covering Strategy
- **Clustered Index**: The data pages *are* the leaf level of the B-Tree. Only 1 clustered index can exist per table.
- **Non-Clustered Index**: Separate B-Tree containing key columns plus a **Row Locator** (clustering key or RID for heaps).
- **The Tipping Point**: Typically between **2% and 5% selectivity**. If a query retrieves more than ~3% of table rows, the optimizer abandons Index Seek + Key Lookups in favor of a sequential Clustered Index Scan.
- **Covering Index**: Eliminate Key Lookups by adding columns to the leaf level using the \`INCLUDE\` clause:
  \`CREATE NONCLUSTERED INDEX IX_Emp_Dept_Inc ON dbo.emp(dnum) INCLUDE (salary, hiredate, netsal);\`
  This satisfies the query 100% from the index leaf pages!`,
      query: `-- Test Covering Index Query (Zero Key Lookup)
SELECT e.eid, e.dnum, e.salary, e.netsal
FROM dbo.emp e
WHERE e.dnum = 10
ORDER BY e.salary DESC;`
    };
  }

  if (q.includes('acid') || q.includes('transaction') || q.includes('xact_abort') || q.includes('lock') || q.includes('rcsi')) {
    return {
      text: `### 🛡️ Transaction Engineering, Concurrency & RCSI
- **ACID Guarantees**: Atomicity, Consistency, Isolation, Durability.
- **SET XACT_ABORT ON**: Forces SQL Server to automatically roll back the entire transaction if a runtime error occurs, preventing open zombie transactions.
- **RCSI (Read Committed Snapshot Isolation)**:
  \`ALTER DATABASE ITItest SET READ_COMMITTED_SNAPSHOT ON;\`
  Readers do not block writers, and writers do not block readers! Instead, reading queries read the last committed version of rows from \`tempdb\` version store.`,
      query: `-- Safe Transaction Template with XACT_ABORT and State Inspection
BEGIN TRY
    SET NOCOUNT, XACT_ABORT ON;
    BEGIN TRANSACTION;

    UPDATE dbo.emp SET salary = salary * 1.05 WHERE dnum = 10;

    COMMIT TRANSACTION;
    PRINT '>>> Transaction Committed Successfully.';
END TRY
BEGIN CATCH
    IF (XACT_STATE() <> 0)
        ROLLBACK TRANSACTION;
    THROW;
END CATCH;`
    };
  }

  if (q.includes('filegroup') || q.includes('storage') || q.includes('page') || q.includes('ndf') || q.includes('mdf')) {
    return {
      text: `### 💾 Storage Engine Internals (8 KB Pages & Multi-Filegroups)
In Microsoft SQL Server 2022 (as demonstrated in your \`ITItest\` database at \`D:\\courses\\...\\CH01\\Mydb\`):
- **Page Size**: Exactly 8,192 bytes (8 KB). 128 pages = 1 Megabyte.
- **Extent**: 8 contiguous 8 KB pages (64 KB). Uniform vs Mixed extents.
- **Multi-Filegroups**:
  * \`PRIMARY\` (\`ITItest.mdf\`): System catalog tables, metadata.
  * \`fg1\` (\`file2.ndf\`): Core transaction tables (\`emp\`, \`depts\`).
  * \`fg2\` (\`file3.ndf\`): Large associative tables & projects.
  * \`fg3\` (\`file4.ndf\`): Index filegroup, reporting & audit history.
  * \`LOG\` (\`ITItest_log.ldf\`): Write-Ahead Log (WAL) sequential logging.`,
      query: `-- Inspect live physical files and allocations for ITItest
SELECT 
    name,
    physical_name,
    type_desc,
    size * 8 / 1024 AS SizeMB,
    growth * 8 / 1024 AS GrowthMB
FROM sys.master_files
WHERE database_id = DB_ID('ITItest');`
    };
  }

  if (q.includes('kimball') || q.includes('star') || q.includes('dw') || q.includes('scd') || q.includes('dimension')) {
    return {
      text: `### ⭐ Kimball Star Schema & Slowly Changing Dimensions (SCD)
- **3NF OLTP** (normalized for transaction write speed) vs **Kimball Star Schema** (denormalized for analytical read throughput).
- **Fact Table**: Contains surrogate foreign keys and numerical metrics (\`Quantity\`, \`TotalSales\`, \`TaxAmount\`).
- **Dimension Table**: Contains descriptive hierarchy attributes (\`CustomerSK\`, \`City\`, \`Region\`).
- **SCD Type 1**: Overwrites old value with new value (loss of historical truth).
- **SCD Type 2**: Preserves historical truth by inserting a new row with temporal validity:
  \`[ValidFrom] DATETIME2, [ValidTo] DATETIME2, [IsCurrent] BIT\`.`,
      query: `-- Querying SCD Type 2 Active vs Historical Customer Dimensions
SELECT 
    CustomerSK,
    CustomerId,
    CustomerName,
    Region,
    ValidFrom,
    ValidTo,
    CASE WHEN IsCurrent = 1 THEN 'Current 🟢' ELSE 'Historical ⚪' END AS Status
FROM DimCustomer
ORDER BY CustomerId, ValidFrom DESC;`
    };
  }

  // Fallback
  return {
    text: `### 💡 SQL Server & DBRE Study Mentor
You are connected to the OmniFlow Data Platform mentor. Here are key guidelines for your current task:

- **Set-Based Processing**: Avoid row-by-row cursors and scalar UDFs in \`WHERE\` clauses; use Inline Table-Valued Functions (ITVFs) or window functions instead.
- **Physical Isolation**: Keep user tables in dedicated secondary filegroups (\`fg1\`) and indexes on \`fg3\` to prevent contention on \`PRIMARY\`.
- **Defensive Error Handling**: Always combine \`SET XACT_ABORT ON\` with \`BEGIN CATCH\` and check \`XACT_STATE()\` before issuing \`ROLLBACK\`.`,
    query: `-- Inspect current active ITItest employees and calculated salaries
SELECT 
    e.eid, 
    e.ename, 
    e.salary, 
    e.overtime, 
    e.netsal, 
    d.dname
FROM dbo.emp e
INNER JOIN dbo.depts d ON e.dnum = d.did;`
  };
}

function stripHtml(html = '') {
  return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
}
