export function setupLearningResources() {
  const container = document.getElementById('learningResourcesContainer');
  if (!container) return;

  container.innerHTML = `
    <!-- Top Hero Banner -->
    <div class="resources-hero card">
      <div class="hero-content">
        <div class="badge badge-purple" style="margin-bottom: 8px;">ITI / MaharaTech Official Curriculum</div>
        <h2 class="hero-title">Course Video Library & DBRE Engineering Cheatsheets</h2>
        <p class="hero-desc">
          Accelerate your mastery of <strong>Implementing and Developing SQL Server Objects (Course 2305)</strong> taught by Eng. Rami Mohamed Abonagi. Explore video lecture breakdown, essential diagnostic DMVs, ACID concurrency matrices, and storage formulas.
        </p>
      </div>
      <div class="hero-actions">
        <a href="https://maharatech.gov.eg/course/view.php?id=2305" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          <span>Open MaharaTech Portal</span>
        </a>
      </div>
    </div>

    <!-- Main Grid: Video Curriculum + Interactive Cheatsheets -->
    <div class="resources-grid">
      <!-- Left Column: Chapter Video Navigator -->
      <div class="resources-col">
        <div class="section-badge-title">🎓 MaharaTech Course Modules</div>
        
        <!-- Chapter 1 -->
        <div class="resource-card card">
          <div class="card-header-row">
            <div>
              <span class="badge badge-cyan">Chapter 1</span>
              <h3 class="card-title">Database Creation & Physical Storage</h3>
            </div>
            <span class="video-count-pill">5 Videos</span>
          </div>
          <p class="card-summary">Physical file layouts, secondary filegroups, integrity constraints, and the canonical Peter Chen Company Database Case Study.</p>
          <div class="topic-tag-list">
            <span class="topic-tag">CH01_VID01: Database Files & Architecture</span>
            <span class="topic-tag active-tag">CH01_VID02: Create Database Using Wizard (Case Study ERD)</span>
            <span class="topic-tag">CH01_VID03: Primary & Foreign Keys</span>
            <span class="topic-tag">CH01_VID04: Unique & Check Constraints</span>
            <span class="topic-tag">CH01_VID05: Database Snapshots & Sparse Files</span>
          </div>
        </div>

        <!-- Chapter 2 -->
        <div class="resource-card card">
          <div class="card-header-row">
            <div>
              <span class="badge badge-green">Chapter 2</span>
              <h3 class="card-title">SQL Programming & Concurrency Essentials</h3>
            </div>
            <span class="video-count-pill">6 Videos</span>
          </div>
          <p class="card-summary">Procedural flow of control, ACID transaction boundaries, and the performance differences between Scalar, MSTVF, and Inline TVFs.</p>
          <div class="topic-tag-list">
            <span class="topic-tag">CH02_VID01: Variables & Control of Flow</span>
            <span class="topic-tag">CH02_VID02: Transactions & ACID Properties</span>
            <span class="topic-tag">CH02_VID03: Concurrency & Locking Isolation</span>
            <span class="topic-tag">CH02_VID04: Scalar UDFs & Inlining</span>
            <span class="topic-tag">CH02_VID05: Multi-Statement TVFs vs TempDB</span>
            <span class="topic-tag">CH02_VID06: Inline TVFs (Query Tree Unfolding)</span>
          </div>
        </div>

        <!-- Chapter 3 -->
        <div class="resource-card card">
          <div class="card-header-row">
            <div>
              <span class="badge badge-purple">Chapter 3</span>
              <h3 class="card-title">Advanced Scalability & High Availability</h3>
            </div>
            <span class="video-count-pill">5 Videos</span>
          </div>
          <p class="card-summary">Horizontal range partitioning, sliding-window partition switching, semi-structured XML parsing, TVPs, and Log Shipping disaster recovery.</p>
          <div class="topic-tag-list">
            <span class="topic-tag">CH03_VID01: Horizontal Table Partitioning</span>
            <span class="topic-tag">CH03_VID02: Sliding Window Partition Switching</span>
            <span class="topic-tag">CH03_VID03: High-Throughput TVP Ingestion</span>
            <span class="topic-tag">CH03_VID04: XML Shredding (.nodes & .value)</span>
            <span class="topic-tag">CH03_VID05: Log Shipping & Standby Replicas</span>
          </div>
        </div>

        <!-- Chapter 4 -->
        <div class="resource-card card">
          <div class="card-header-row">
            <div>
              <span class="badge badge-amber">Chapter 4</span>
              <h3 class="card-title">Procedures, Triggers & Automation</h3>
            </div>
            <span class="video-count-pill">5 Videos</span>
          </div>
          <p class="card-summary">Transactional ETL procedures with OUTPUT clauses, non-locking CDC triggers, DDL triggers with EVENTDATA(), CLR assemblies, and SMO scripts.</p>
          <div class="topic-tag-list">
            <span class="topic-tag">CH04_VID01: Stored Procedures & XACT_ABORT</span>
            <span class="topic-tag">CH04_VID02: DML Audit Triggers (inserted / deleted)</span>
            <span class="topic-tag">CH04_VID03: DDL Database Security Triggers</span>
            <span class="topic-tag">CH04_VID04: C# CLR Managed Assemblies</span>
            <span class="topic-tag">CH04_VID05: SMO Automation via PowerShell & Python</span>
          </div>
        </div>

        <!-- Chapter 5 -->
        <div class="resource-card card">
          <div class="card-header-row">
            <div>
              <span class="badge badge-cyan">Chapter 5</span>
              <h3 class="card-title">Reporting & Dimensional Warehousing</h3>
            </div>
            <span class="video-count-pill">4 Videos</span>
          </div>
          <p class="card-summary">OLTP to OLAP transition, Kimball star schema modeling, Slowly Changing Dimensions (SCD 1 & 2), and enterprise SSRS report definitions.</p>
          <div class="topic-tag-list">
            <span class="topic-tag">CH05_VID01: OLTP vs OLAP Architecture</span>
            <span class="topic-tag">CH05_VID02: Dimensional Modeling (Fact & Dim Tables)</span>
            <span class="topic-tag">CH05_VID03: SCD Type 2 Customer History</span>
            <span class="topic-tag">CH05_VID04: Enterprise SSRS Reporting (.rdl)</span>
          </div>
        </div>
      </div>

      <!-- Right Column: Interactive DBRE Cheatsheets -->
      <div class="resources-col">
        <div class="section-badge-title">⚡ Interactive DBRE Cheatsheets</div>

        <!-- Cheatsheet 1: Isolation Levels Matrix -->
        <div class="cheatsheet-card card">
          <h3 class="card-title">ACID Transaction Isolation Levels Matrix</h3>
          <p class="card-summary">Understanding concurrency trade-offs and SQL Server locking anomalies:</p>
          <table class="cheatsheet-table">
            <thead>
              <tr>
                <th>Isolation Level</th>
                <th>Dirty Read</th>
                <th>Non-Repeatable</th>
                <th>Phantom Read</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Read Uncommitted</strong></td>
                <td class="danger">Allowed ❌</td>
                <td class="danger">Allowed ❌</td>
                <td class="danger">Allowed ❌</td>
              </tr>
              <tr>
                <td><strong>Read Committed</strong> (Default)</td>
                <td class="success">Prevented ✅</td>
                <td class="danger">Allowed ❌</td>
                <td class="danger">Allowed ❌</td>
              </tr>
              <tr>
                <td><strong>Repeatable Read</strong></td>
                <td class="success">Prevented ✅</td>
                <td class="success">Prevented ✅</td>
                <td class="danger">Allowed ❌</td>
              </tr>
              <tr>
                <td><strong>Serializable</strong></td>
                <td class="success">Prevented ✅</td>
                <td class="success">Prevented ✅</td>
                <td class="success">Prevented ✅</td>
              </tr>
              <tr>
                <td><strong>Snapshot (RCSI)</strong></td>
                <td class="success">Prevented ✅</td>
                <td class="success">Prevented ✅</td>
                <td class="success">Prevented ✅</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Cheatsheet 2: Essential DMVs -->
        <div class="cheatsheet-card card">
          <h3 class="card-title">Top Production Diagnostic DMVs</h3>
          <p class="card-summary">The essential Dynamic Management Views for database performance telemetry:</p>
          <div class="dmv-list">
            <div class="dmv-item">
              <code>sys.dm_exec_query_stats</code>
              <span>Top queries by CPU time, logical IO, and execution count.</span>
            </div>
            <div class="dmv-item">
              <code>sys.dm_os_wait_stats</code>
              <span>Aggregated server-wide resource bottlenecks (Disk, CPU, Latches).</span>
            </div>
            <div class="dmv-item">
              <code>sys.dm_db_index_physical_stats</code>
              <span>Fragmentation percentage, page count, and leaf density.</span>
            </div>
            <div class="dmv-item">
              <code>sys.dm_db_index_usage_stats</code>
              <span>Index seek vs scan activity (identifying unused indexes).</span>
            </div>
            <div class="dmv-item">
              <code>sys.dm_tran_locks</code>
              <span>Active lock allocations and deadlock analysis.</span>
            </div>
          </div>
        </div>

        <!-- Cheatsheet 3: Physical Storage Math -->
        <div class="cheatsheet-card card">
          <h3 class="card-title">Storage Engine Math & Page Geometry</h3>
          <ul class="storage-math-list">
            <li><strong>Page Size</strong>: <code>8,192 bytes</code> (8 KB). 96 bytes page header, 8,060 bytes usable row data, 36 bytes row offset array.</li>
            <li><strong>Extent Size</strong>: <code>64 KB</code> (8 physically contiguous 8 KB pages). Uniform extents belong to a single object.</li>
            <li><strong>Rows Per Page Formula</strong>: <code>Floor(8060 / (RowSizeInBytes + 2))</code>.</li>
            <li><strong>Fill Factor Strategy</strong>: <code>FILLFACTOR = 85</code> reserves 15% headroom on leaf pages for high-insert tables to prevent page splits.</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}
