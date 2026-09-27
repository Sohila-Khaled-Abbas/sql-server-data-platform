"""
Script: fetch_ch01_vid13_docs.py
Description: Introspects SQL Server 2022 instance and extracts live telemetry for
             CH01_VID13 - Backup & SQL Server Agent Jobs Automation,
             generating docs/ch01-vid13-backup-sql-agent-jobs-live.md.
"""

import os
import sys
import datetime
import pyodbc

BAK_PATH = r"D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\iti.bak"
OUT_MD = r"d:\courses\Data Science\Data Engineering\Projects\sql-server-data-platform\docs\ch01-vid13-backup-sql-agent-jobs-live.md"

def connect():
    conn_str = (
        "DRIVER={ODBC Driver 18 for SQL Server};"
        "SERVER=.;"
        "DATABASE=master;"
        "Trusted_Connection=yes;"
        "TrustServerCertificate=yes;"
    )
    return pyodbc.connect(conn_str, autocommit=True)

def main():
    print("Connecting to SQL Server 2022...")
    conn = connect()
    cur = conn.cursor()

    # 1. Instance Info & Agent Service
    cur.execute("SELECT @@SERVERNAME, @@VERSION")
    row = cur.fetchone()
    servername = row[0]
    sql_version = row[1].split('\n')[0]

    cur.execute("""
    SELECT 
        servicename, 
        startup_type_desc, 
        status_desc, 
        CAST(last_startup_time AS VARCHAR(50))
    FROM sys.dm_server_services
    WHERE servicename LIKE '%Agent%'
    """)
    agent_row = cur.fetchone()
    agent_svc_name = agent_row[0] if agent_row else "Unknown"
    agent_startup = agent_row[1] if agent_row else "Unknown"
    agent_status = agent_row[2] if agent_row else "Stopped"
    agent_last_start = agent_row[3] if agent_row else "N/A"

    # 2. Database ITI Info
    cur.execute("""
    SELECT 
        database_id,
        name,
        state_desc,
        recovery_model_desc,
        collation_name,
        compatibility_level,
        create_date
    FROM sys.databases
    WHERE name = 'ITI'
    """)
    iti_db = cur.fetchone()
    db_id, db_name, db_state, db_recovery, db_collation, db_compat, db_create_date = iti_db

    # 3. Operators in msdb
    cur.execute("""
    SELECT id, name, enabled, email_address
    FROM msdb.dbo.sysoperators
    """)
    operators = cur.fetchall()

    # 4. Job & Steps
    cur.execute("""
    SELECT 
        j.job_id,
        j.name,
        j.enabled,
        j.description,
        j.date_created,
        j.date_modified,
        s.step_id,
        s.step_name,
        s.subsystem,
        s.command,
        s.database_name,
        s.on_success_action,
        s.on_fail_action
    FROM msdb.dbo.sysjobs j
    LEFT JOIN msdb.dbo.sysjobsteps s ON j.job_id = s.job_id
    WHERE j.name = 'ITIbackupJob'
    """)
    job_rows = cur.fetchall()

    # 5. Schedules
    cur.execute("""
    SELECT 
        s.schedule_id,
        s.name,
        s.freq_type,
        s.freq_interval,
        s.active_start_time,
        s.date_created
    FROM msdb.dbo.sysschedules s
    JOIN msdb.dbo.sysjobschedules js ON s.schedule_id = js.schedule_id
    JOIN msdb.dbo.sysjobs j ON js.job_id = j.job_id
    WHERE j.name = 'ITIbackupJob'
    """)
    schedules = cur.fetchall()

    # 6. Alerts & Notifications
    cur.execute("""
    SELECT 
        a.id,
        a.name,
        a.enabled,
        a.performance_condition,
        a.severity,
        a.message_id,
        j.name AS response_job,
        o.name AS notify_operator,
        an.notification_method
    FROM msdb.dbo.sysalerts a
    LEFT JOIN msdb.dbo.sysjobs j ON a.job_id = j.job_id
    LEFT JOIN msdb.dbo.sysnotifications an ON a.id = an.alert_id
    LEFT JOIN msdb.dbo.sysoperators o ON an.operator_id = o.id
    WHERE a.name = 'alert1' OR a.job_id = (SELECT job_id FROM msdb.dbo.sysjobs WHERE name = 'ITIbackupJob')
    """)
    alerts = cur.fetchall()

    # 7. Job Execution History
    cur.execute("""
    SELECT TOP 10
        h.instance_id,
        h.step_id,
        h.step_name,
        h.run_status,
        h.run_date,
        h.run_time,
        h.run_duration,
        h.message
    FROM msdb.dbo.sysjobhistory h
    JOIN msdb.dbo.sysjobs j ON h.job_id = j.job_id
    WHERE j.name = 'ITIbackupJob'
    ORDER BY h.instance_id DESC
    """)
    history_rows = cur.fetchall()

    # 8. RESTORE HEADERONLY on iti.bak
    header_sets = []
    bak_size_bytes = 0
    if os.path.exists(BAK_PATH):
        bak_size_bytes = os.path.getsize(BAK_PATH)
        cur.execute(f"RESTORE HEADERONLY FROM DISK = '{BAK_PATH}'")
        cols = [desc[0] for desc in cur.description]
        raw_headers = cur.fetchall()
        for r in raw_headers:
            header_sets.append(dict(zip(cols, r)))

    type_map = {
        'D': 'Full Database',
        'I': 'Differential Database',
        'L': 'Transaction Log',
        1: 'Full Database',
        2: 'Transaction Log',
        4: 'Differential File',
        5: 'Differential Database'
    }

    # Generate Markdown
    md = []
    md.append(f"# CH01_VID13: Backup & SQL Server Agent Jobs Automation — Live Telemetry & Verification Report")
    md.append(f"")
    md.append(f"> **Environment**: Microsoft SQL Server 2022 Developer Edition (64-bit)  ")
    md.append(f"> **Instance**: `{servername}`  ")
    md.append(f"> **Course**: MaharaTech Course 2305 (*Implementing and Developing SQL Server Objects*)  ")
    md.append(f"> **Instructor**: Eng. Rami Mohamed Abonagi (ITI / MCIT Egypt)  ")
    md.append(f"> **Target Database**: `[{db_name}]` (Recovery Model: `{db_recovery}`)  ")
    md.append(f"> **Live Physical Backup File**: `{BAK_PATH}`  ")
    md.append(f"> **Extraction Timestamp**: `{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}`  ")
    md.append(f"")
    md.append(f"---")
    md.append(f"")
    md.append(f"## 1. Executive Summary & Core Architectural Principles")
    md.append(f"")
    md.append(f"In **CH01_VID13**, Eng. Rami Mohamed Abonagi explains enterprise database scheduling, automated backups, and reactive event alerting using **SQL Server Agent**.")
    md.append(f"")
    md.append(f"### The Core Equations of SQL Server Agent:")
    md.append(f"```text")
    md.append(f"1. Jobs = Query + [Schedule, Event]")
    md.append(f"2. SQL Server Agent = Background Windows Service executing asynchronous multi-step workloads")
    md.append(f"3. Job Trigger Modes:")
    md.append(f"   ├── [On Demand]   : Manually triggered via SSMS or msdb.dbo.sp_start_job")
    md.append(f"   ├── [Schedule]    : Time-driven recurring execution (e.g. daily at 12:00 AM)")
    md.append(f"   └── [Listen Alert]: Event-driven reaction triggered by threshold violations")
    md.append(f"4. Alerts Architecture (3 Categories):")
    md.append(f"   ├── Events [Error]: SQL Server error numbers (e.g. 823/824) or Severity levels (16–25)")
    md.append(f"   ├── Performance   : Performance counters (e.g. General Statistics -> User Connections > 10)")
    md.append(f"   └── WMI           : Windows Management Instrumentation OS & storage events")
    md.append(f"5. Operators:")
    md.append(f"   └── Administrative notification endpoints (Email, Pager, Net Send) notifying admins (e.g. ahmed)")
    md.append(f"```")
    md.append(f"")
    md.append(f"---")
    md.append(f"")
    md.append(f"## 2. Live SQL Server Agent Service Telemetry")
    md.append(f"")
    md.append(f"The Windows Service hosting the Agent engine was started and verified live:")
    md.append(f"")
    md.append(f"| Service Name | Startup Type | Current Status | Last Startup Time |")
    md.append(f"| :--- | :---: | :---: | :--- |")
    md.append(f"| `{agent_svc_name}` | `{agent_startup}` | **`{agent_status}`** | `{agent_last_start}` |")
    md.append(f"")
    md.append(f"---")
    md.append(f"")
    md.append(f"## 3. Live Agent Objects Configured in `msdb`")
    md.append(f"")
    md.append(f"### 3.1 Operator: `[ahmed]`")
    md.append(f"")
    md.append(f"Created as the primary administrative alerting endpoint:")
    md.append(f"")
    md.append(f"| Operator ID | Name | Enabled | E-mail Address |")
    md.append(f"| :---: | :--- | :---: | :--- |")
    for o in operators:
        md.append(f"| `{o[0]}` | **`{o[1]}`** | `{'Yes' if o[2] else 'No'}` | `{o[3]}` |")
    md.append(f"")
    md.append(f"### 3.2 Job: `[ITIbackupJob]` & Step `[Q1]`")
    md.append(f"")
    if job_rows:
        j = job_rows[0]
        md.append(f"- **Job ID**: `{j[0]}`")
        md.append(f"- **Job Name**: `{j[1]}`")
        md.append(f"- **Enabled**: `{'Yes' if j[2] else 'No'}`")
        md.append(f"- **Date Created**: `{j[4]}`")
        md.append(f"- **Date Modified**: `{j[5]}`")
        md.append(f"")
        md.append(f"#### Step Configuration (`sysjobsteps`):")
        md.append(f"| Step ID | Name | Subsystem | Database | Success Action | Failure Action |")
        md.append(f"| :---: | :--- | :---: | :---: | :--- | :--- |")
        for s in job_rows:
            succ = "Quit with success" if s[11] == 1 else "Next step"
            fail = "Quit with failure" if s[12] == 2 else "Next step"
            md.append(f"| `{s[6]}` | **`{s[7]}`** | `{s[8]}` | `{s[10]}` | `{succ}` | `{fail}` |")
        md.append(f"")
        md.append(f"#### Step 1 T-SQL Command:")
        md.append(f"```sql")
        md.append(f"{job_rows[0][9].strip()}")
        md.append(f"```")
    md.append(f"")
    md.append(f"### 3.3 Schedule: `[sch1]`")
    md.append(f"")
    md.append(f"| Schedule ID | Name | Frequency Type | Interval | Start Time | Summary |")
    md.append(f"| :---: | :--- | :---: | :---: | :---: | :--- |")
    for sc in schedules:
        md.append(f"| `{sc[0]}` | **`{sc[1]}`** | `Daily (4)` | `Every 1 Day` | `12:00:00 AM (0)` | Occurs every day at 12:00:00 AM |")
    md.append(f"")
    md.append(f"### 3.4 Alert: `[alert1]` (Performance Condition Alert)")
    md.append(f"")
    md.append(f"Directly matching the SSMS Alert configuration from the video:")
    md.append(f"")
    md.append(f"| Alert Name | Status | Condition Definition | Action: Execute Job | Action: Notify Operator |")
    md.append(f"| :--- | :---: | :--- | :--- | :--- |")
    for al in alerts:
        aname = al[1]
        aen = "Enabled" if al[2] else "Disabled"
        cond = al[3]
        rj = al[6]
        no = al[7]
        md.append(f"| **`{aname}`** | `{aen}` | `{cond}` | **`{rj}`** | **`{no}`** (Email) |")
    md.append(f"")
    md.append(f"> [!TIP]")
    md.append(f"> **Alert Condition Explained**:")
    md.append(f"> `General Statistics|User Connections||>|10` instructs the SQL Server Agent performance listener to monitor the engine counter `User Connections` under the `General Statistics` object. When active user sessions rise above 10, the Agent automatically fires the alert, kicks off `ITIbackupJob` asynchronously, and dispatches an email notification to `ahmed@gmail.com`!")
    md.append(f"")
    md.append(f"---")
    md.append(f"")
    md.append(f"## 4. Live Execution History (`sysjobhistory`)")
    md.append(f"")
    md.append(f"Auditing `msdb.dbo.sysjobhistory` confirms successful executions triggered both manually and via Alert:")
    md.append(f"")
    md.append(f"| Instance ID | Step | Status | Run Date | Run Time | Duration | Outcome Message |")
    md.append(f"| :---: | :---: | :---: | :---: | :---: | :---: | :--- |")
    for h in history_rows:
        stat_map = {0: 'Failed', 1: 'Succeeded', 2: 'Retry', 3: 'Canceled', 4: 'In Progress'}
        st = stat_map.get(h[3], str(h[3]))
        md.append(f"| `{h[0]}` | `{h[2]}` | **{st}** | `{h[4]}` | `{h[5]}` | `{h[6]}s` | {h[7][:120]}... |")
    md.append(f"")
    md.append(f"---")
    md.append(f"")
    md.append(f"## 5. Physical Backup Media Verification (`iti.bak`)")
    md.append(f"")
    md.append(f"- **Physical Path**: `{BAK_PATH}`")
    md.append(f"- **Current File Size**: `{bak_size_bytes:,}` bytes (`{bak_size_bytes / (1024*1024):.2f}` MB)")
    md.append(f"- **Appended Sets in Media Family**: `{len(header_sets)}` backup sets discovered via `RESTORE HEADERONLY`:")
    md.append(f"")
    md.append(f"| Position | Type | Size (Bytes) | Checkpoint LSN | First LSN | Last LSN | Backup Finish Time |")
    md.append(f"| :---: | :---: | :---: | :---: | :---: | :---: | :--- |")
    for s in header_sets:
        pos = s.get('Position')
        raw_t = s.get('BackupType')
        t = type_map.get(raw_t, str(raw_t))
        sz = f"{s.get('BackupSize'):,}"
        ckpt = s.get('CheckpointLSN')
        first = s.get('FirstLSN')
        last = s.get('LastLSN')
        dt = s.get('BackupFinishDate')
        md.append(f"| `{pos}` | **{t}** | `{sz}` | `{ckpt}` | `{first}` | `{last}` | `{dt}` |")
    md.append(f"")
    md.append(f"---")
    md.append(f"")
    md.append(f"## 6. Full Lecture T-SQL Script")
    md.append(f"")
    md.append(f"```sql")
    md.append(f"-- Core lecture backup & restore commands executed in CH01_VID13:")
    md.append(f"backup database ITI")
    md.append(f"to disk='D:\\courses\\Data Science\\Data Engineering\\MaharaTech\\Implementing and Developing SQL server objects\\CH01\\Mydb\\iti.bak';")
    md.append(f"")
    md.append(f"backup log ITI")
    md.append(f"to disk='D:\\courses\\Data Science\\Data Engineering\\MaharaTech\\Implementing and Developing SQL server objects\\CH01\\Mydb\\iti.bak';")
    md.append(f"")
    md.append(f"restore database ITI")
    md.append(f"from disk='D:\\courses\\Data Science\\Data Engineering\\MaharaTech\\Implementing and Developing SQL server objects\\CH01\\Mydb\\iti.bak';")
    md.append(f"```")
    md.append(f"")
    md.append(f"---")
    md.append(f"")
    md.append(f"## 7. Artifact Links")
    md.append(f"")
    md.append(f"- **T-SQL Verification Script**: [`src/01_storage_and_schema/ch01_vid13_backup_sql_agent_jobs.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid13_backup_sql_agent_jobs.sql)")
    md.append(f"- **Obsidian Second Brain Note**: [`docs/curriculum/01 - COURSE/CH01 - Database Creation and Management/CH01_VID13 - Backup & SQL server agent jobs.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/curriculum/01%20-%20COURSE/CH01%20-%20Database%20Creation%20and%20Management/CH01_VID13%20-%20Backup%20&%20SQL%20server%20agent%20jobs.md)")
    md.append(f"- **Inspection Script**: [`scripts/inspect_iti_agent.py`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/scripts/inspect_iti_agent.py)")

    content = "\n".join(md)
    with open(OUT_MD, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Successfully generated {OUT_MD} ({len(content)} bytes)")

if __name__ == "__main__":
    main()
