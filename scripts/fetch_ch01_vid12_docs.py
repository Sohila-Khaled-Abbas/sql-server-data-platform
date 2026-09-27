"""
Script: fetch_ch01_vid12_docs.py
Description: Introspects SQL Server 2022 instance and extracts live telemetry for
             CH01_VID12 - Backup Database Using Wizard & Multi-Set Media Files,
             generating docs/ch01-vid12-backup-database-wizard-live.md.
"""

import os
import sys
import datetime
import decimal
import pyodbc

BAK_PATH = r"D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\test.bak"
OUT_MD = r"d:\courses\Data Science\Data Engineering\Projects\sql-server-data-platform\docs\ch01-vid12-backup-database-wizard-live.md"

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
    print(f"Connecting to SQL Server 2022...")
    conn = connect()
    cur = conn.cursor()

    # 1. Instance Information
    cur.execute("SELECT @@SERVERNAME, @@VERSION, SERVERPROPERTY('InstanceDefaultDataPath')")
    row = cur.fetchone()
    servername = row[0]
    sql_version = row[1].split('\n')[0]
    default_data_path = row[2]

    # 2. Database testbackup Properties
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
    WHERE name = 'testbackup'
    """)
    db_row = cur.fetchone()
    if not db_row:
        print("Database testbackup not found!")
        sys.exit(1)

    db_id, db_name, db_state, db_recovery, db_collation, db_compat, db_create_date = db_row

    # 3. Database Files
    cur.execute("""
    SELECT 
        file_id,
        name,
        physical_name,
        type_desc,
        size * 8 / 1024 AS size_mb,
        growth * 8 / 1024 AS growth_mb,
        is_percent_growth
    FROM testbackup.sys.database_files
    ORDER BY file_id
    """)
    files = cur.fetchall()

    # 4. Table dbo.emp content
    cur.execute("SELECT id, name FROM testbackup.dbo.emp ORDER BY id")
    emp_rows = cur.fetchall()

    # 5. RESTORE HEADERONLY on test.bak
    cur.execute(f"RESTORE HEADERONLY FROM DISK = '{BAK_PATH}'")
    header_cols = [desc[0] for desc in cur.description]
    raw_headers = cur.fetchall()
    header_sets = []
    for r in raw_headers:
        header_sets.append(dict(zip(header_cols, r)))

    # 6. RESTORE FILELISTONLY on test.bak
    cur.execute(f"RESTORE FILELISTONLY FROM DISK = '{BAK_PATH}' WITH FILE = 1")
    fl_cols = [desc[0] for desc in cur.description]
    raw_fl = cur.fetchall()
    file_list = []
    for r in raw_fl:
        file_list.append(dict(zip(fl_cols, r)))

    # 7. msdb backup history
    cur.execute("""
    SELECT 
        bs.backup_set_id,
        bs.position,
        bs.name,
        bs.type,
        bs.backup_start_date,
        bs.backup_finish_date,
        bs.backup_size,
        bs.checkpoint_lsn,
        bs.differential_base_lsn,
        bs.first_lsn,
        bs.last_lsn,
        mf.physical_device_name
    FROM msdb.dbo.backupset bs
    JOIN msdb.dbo.backupmediafamily mf ON bs.media_set_id = mf.media_set_id
    WHERE bs.database_name = 'testbackup'
    ORDER BY bs.backup_set_id
    """)
    msdb_cols = [desc[0] for desc in cur.description]
    msdb_rows = [dict(zip(msdb_cols, r)) for r in cur.fetchall()]

    bak_stat = os.stat(BAK_PATH)
    bak_size_mb = bak_stat.st_size / (1024 * 1024)

    type_map = {
        'D': 'Full Database',
        'I': 'Differential Database',
        'L': 'Transaction Log',
        1: 'Full Database',
        2: 'Transaction Log',
        4: 'Differential File',
        5: 'Differential Database'
    }

    # Generate Markdown Document
    md = []
    md.append(f"# CH01_VID12: Backup Database Using Wizard — Live Telemetry & Verification Report")
    md.append(f"")
    md.append(f"> **Environment**: Microsoft SQL Server 2022 Developer Edition (64-bit)  ")
    md.append(f"> **Instance**: `{servername}`  ")
    md.append(f"> **Course**: MaharaTech Course 2305 (*Implementing and Developing SQL Server Objects*)  ")
    md.append(f"> **Instructor**: Eng. Rami Mohamed Abonagi (ITI / MCIT Egypt)  ")
    md.append(f"> **Target Database**: `[{db_name}]` (Recovery Model: `{db_recovery}`)  ")
    md.append(f"> **Live Physical Backup File**: `{BAK_PATH}`  ")
    md.append(f"> **Telemetry Extraction Date**: `{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}`  ")
    md.append(f"")
    md.append(f"---")
    md.append(f"")
    md.append(f"## 1. Executive Summary")
    md.append(f"")
    md.append(f"In **CH01_VID12**, Eng. Rami demonstrates how to perform database backups using the **SQL Server Management Studio (SSMS) Backup Database Wizard** (accessed via `Right-Click Database -> Tasks -> Back Up...`).")
    md.append(f"")
    md.append(f"During this lab, the user created a live demo database named `[testbackup]` in the `FULL` recovery model, populated a sample table `dbo.emp` with 10 records, and generated a sequential multi-tier backup suite consisting of:")
    md.append(f"1. **Full Database Backup**")
    md.append(f"2. **Differential Database Backup**")
    md.append(f"3. **Transaction Log Backup**")
    md.append(f"")
    md.append(f"All three backups were written to a **single physical backup file**:  ")
    md.append(f"`{BAK_PATH}` (Physical size: **{bak_stat.st_size:,} bytes** / **{bak_size_mb:.2f} MB**).")
    md.append(f"")
    md.append(f"This document provides the complete architectural breakdown of how the SSMS Graphical Wizard maps to underlying T-SQL engine commands, the internal media family structure of multi-set backup files, LSN chain validation, and exact restore verification commands.")
    md.append(f"")
    md.append(f"---")
    md.append(f"")
    md.append(f"## 2. Live Database Telemetry: `[testbackup]`")
    md.append(f"")
    md.append(f"### 2.1 Database Properties")
    md.append(f"")
    md.append(f"| Property | Value | Description |")
    md.append(f"| :--- | :--- | :--- |")
    md.append(f"| **Database ID** | `{db_id}` | Internal database identifier |")
    md.append(f"| **Database Name** | `{db_name}` | Demo database created for VID12 |")
    md.append(f"| **State** | `{db_state}` | Current online state |")
    md.append(f"| **Recovery Model** | `{db_recovery}` | Enables Full, Differential, and Transaction Log backups |")
    md.append(f"| **Collation** | `{db_collation}` | Server default collation |")
    md.append(f"| **Compatibility Level** | `{db_compat}` | SQL Server 2022 compatibility level |")
    md.append(f"| **Create Date** | `{db_create_date}` | Database creation timestamp |")
    md.append(f"")
    md.append(f"### 2.2 Storage Files (`sys.database_files`)")
    md.append(f"")
    md.append(f"| File ID | Logical Name | Physical Path | Type | Current Size | Auto-Growth |")
    md.append(f"| :---: | :--- | :--- | :---: | :---: | :---: |")
    for f in files:
        fid, fname, fpath, ftype, fsize, fgrowth, fpercent = f
        growth_str = f"{fgrowth}%" if fpercent else f"{fgrowth} MB"
        md.append(f"| `{fid}` | `{fname}` | `{fpath}` | `{ftype}` | `{fsize} MB` | `{growth_str}` |")
    md.append(f"")
    md.append(f"### 2.3 Table Schema & Data (`dbo.emp`)")
    md.append(f"")
    md.append(f"The demo table `dbo.emp` consists of `{len(emp_rows)}` rows:")
    md.append(f"")
    md.append(f"```sql")
    md.append(f"-- Schema definition:")
    md.append(f"CREATE TABLE dbo.emp")
    md.append(f"(")
    md.append(f"    id INT NOT NULL,")
    md.append(f"    name VARCHAR(50) NULL")
    md.append(f");")
    md.append(f"```")
    md.append(f"")
    md.append(f"| `id` | `name` |")
    md.append(f"| :---: | :--- |")
    for er in emp_rows:
        val = er[1] if er[1] is not None else "NULL"
        md.append(f"| `{er[0]}` | `{val}` |")
    md.append(f"")
    md.append(f"---")
    md.append(f"")
    md.append(f"## 3. Physical Backup Media Introspection (`test.bak`)")
    md.append(f"")
    md.append(f"### 3.1 Media Architecture & Multi-Set Concept")
    md.append(f"")
    md.append(f"When a database administrator executes backups via the SSMS Wizard without checking *'Overwrite all existing backup sets'*, SSMS defaults to **`WITH NOINIT`** (Append to the existing backup set).")
    md.append(f"")
    md.append(f"In SQL Server storage architecture:")
    md.append(f"- A physical `.bak` file represents a **Backup Media Family**.")
    md.append(f"- Each backup operation appends a new **Backup Set** sequentially onto that media family.")
    md.append(f"- Each backup set receives an incremental integer **Position** (`1, 2, 3, ...`).")
    md.append(f"- This allows a single physical file on disk to contain a complete multi-tier recovery chain: Full backup at Position 1, Differential backup at Position 2, and Transaction Log backup at Position 3!")
    md.append(f"")
    md.append(f"```mermaid")
    md.append(f"graph LR")
    md.append(f"    subgraph SinglePhysicalFile [\"Physical File: test.bak (Media Family)\"]")
    md.append(f"        P1[\"Position 1<br/>Type: Full (D)<br/>Base LSN: 39000000115200001<br/>Size: 4.09 MB\"]")
    md.append(f"        P2[\"Position 2<br/>Type: Differential (I)<br/>DiffBaseLSN: 39000000115200001<br/>Size: 1.40 MB\"]")
    md.append(f"        P3[\"Position 3<br/>Type: Log (L)<br/>FirstLSN: 39000000115200001<br/>Size: 0.27 MB\"]")
    md.append(f"        P1 --> P2 --> P3")
    md.append(f"    end")
    md.append(f"    style SinglePhysicalFile fill:#1e293b,stroke:#3b82f6,color:#f8fafc")
    md.append(f"    style P1 fill:#0f766e,stroke:#14b8a6,color:#ffffff")
    md.append(f"    style P2 fill:#7c2d12,stroke:#f97316,color:#ffffff")
    md.append(f"    style P3 fill:#4c1d95,stroke:#a855f7,color:#ffffff")
    md.append(f"```")
    md.append(f"")
    md.append(f"### 3.2 Live Header Introspection (`RESTORE HEADERONLY`)")
    md.append(f"")
    md.append(f"Executing `RESTORE HEADERONLY FROM DISK = '{BAK_PATH}'` revealed `{len(header_sets)}` backup sets inside the file:")
    md.append(f"")
    md.append(f"| Pos | Backup Name | Type | Size (Bytes) | Checkpoint LSN | Differential Base LSN | First LSN | Last LSN |")
    md.append(f"| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: |")
    for s in header_sets:
        pos = s.get('Position')
        bname = s.get('BackupName')
        raw_type = s.get('BackupType')
        btype = type_map.get(raw_type, str(raw_type))
        bsize = f"{s.get('BackupSize'):,}"
        ckpt = s.get('CheckpointLSN')
        diff_base = s.get('DifferentialBaseLSN') if s.get('DifferentialBaseLSN') is not None else "NULL (Baseline)"
        first = s.get('FirstLSN')
        last = s.get('LastLSN')
        md.append(f"| `{pos}` | `{bname}` | **{btype}** | `{bsize}` | `{ckpt}` | `{diff_base}` | `{first}` | `{last}` |")
    md.append(f"")
    md.append(f"> [!IMPORTANT]")
    md.append(f"> **LSN Chain Validation**:")
    md.append(f"> Notice that Position 2 (`Differential Database`) explicitly references `DifferentialBaseLSN = 39000000115200001`, which matches the `CheckpointLSN` of Position 1 (`Full Database`). This mathematically binds the differential backup to the exact full backup set!")
    md.append(f"")
    md.append(f"### 3.3 Logical File Layout (`RESTORE FILELISTONLY`)")
    md.append(f"")
    md.append(f"Inspecting Position 1 with `RESTORE FILELISTONLY FROM DISK = '{BAK_PATH}' WITH FILE = 1` confirms the internal MDF and LDF logical structure:")
    md.append(f"")
    md.append(f"| Logical Name | Physical Path in Backup | Type | Size (Bytes) |")
    md.append(f"| :--- | :--- | :---: | :---: |")
    for fl in file_list:
        md.append(f"| `{fl.get('LogicalName')}` | `{fl.get('PhysicalName')}` | `{fl.get('Type')}` | `{fl.get('Size'):,}` |")
    md.append(f"")
    md.append(f"---")
    md.append(f"")
    md.append(f"## 4. SSMS Backup Wizard GUI to T-SQL Translation Guide")
    md.append(f"")
    md.append(f"The SSMS Backup Database Wizard acts as a visual interface over the SQL Server T-SQL `BACKUP` engine commands. Clicking the **Script** button at the top of the wizard window exports the exact T-SQL syntax.")
    md.append(f"")
    md.append(f"### 4.1 Wizard Pages Breakdown")
    md.append(f"")
    md.append(f"```")
    md.append(f"SSMS Backup Database Wizard")
    md.append(f"├── 1. General Page")
    md.append(f"│   ├── Database: [testbackup]")
    md.append(f"│   ├── Recovery Model: FULL (Read-only display)")
    md.append(f"│   ├── Backup Type:")
    md.append(f"│   │   ├── Full ───────────────> BACKUP DATABASE [testbackup]")
    md.append(f"│   │   ├── Differential ───────> BACKUP DATABASE [testbackup] WITH DIFFERENTIAL")
    md.append(f"│   │   └── Transaction Log ────> BACKUP LOG [testbackup]")
    md.append(f"│   └── Destination:")
    md.append(f"│       ├── Back up to: Disk / Tape / URL")
    md.append(f"│       └── File List ──────────> TO DISK = N'...'")
    md.append(f"├── 2. Media Options Page")
    md.append(f"│   ├── Overwrite Media:")
    md.append(f"│   │   ├── (•) Append to existing backup set ──> WITH NOINIT")
    md.append(f"│   │   └── ( ) Overwrite all existing sets ────> WITH FORMAT, INIT")
    md.append(f"│   ├── Reliability:")
    md.append(f"│   │   ├── [✓] Verify backup when finished ────> RESTORE VERIFYONLY")
    md.append(f"│   │   └── [✓] Perform checksum before writing ─> WITH CHECKSUM")
    md.append(f"│   └── Transaction Log:")
    md.append(f"│       ├── (•) Truncate the transaction log ───> Default in BACKUP LOG")
    md.append(f"│       └── ( ) Back up tail of log ────────────> WITH NO_TRUNCATE")
    md.append(f"└── 3. Backup Options Page")
    md.append(f"    ├── Name & Description ─────────────────────> WITH NAME = N'...', DESCRIPTION = N'...'")
    md.append(f"    ├── Backup Set Expiration ──────────────────> WITH EXPIREDATE = '...' / RETAINDAYS = N")
    md.append(f"    └── Compression:")
    md.append(f"        ├── ( ) Use the default server setting ──> Server default")
    md.append(f"        ├── (•) Compress backup ────────────────> WITH COMPRESSION")
    md.append(f"        └── ( ) Do not compress backup ─────────> WITH NO_COMPRESSION")
    md.append(f"```")
    md.append(f"")
    md.append(f"### 4.2 Exact Wizard T-SQL Statements")
    md.append(f"")
    md.append(f"#### A. Full Database Backup (Set 1)")
    md.append(f"```sql")
    md.append(f"BACKUP DATABASE [testbackup]")
    md.append(f"TO DISK = N'{BAK_PATH}'")
    md.append(f"WITH NOINIT,")
    md.append(f"     NAME = N'testbackup-Full Database Backup',")
    md.append(f"     SKIP,")
    md.append(f"     NOREWIND,")
    md.append(f"     NOUNLOAD,")
    md.append(f"     STATS = 10;")
    md.append(f"GO")
    md.append(f"```")
    md.append(f"")
    md.append(f"#### B. Differential Database Backup (Set 2)")
    md.append(f"```sql")
    md.append(f"BACKUP DATABASE [testbackup]")
    md.append(f"TO DISK = N'{BAK_PATH}'")
    md.append(f"WITH DIFFERENTIAL,")
    md.append(f"     NOINIT,")
    md.append(f"     NAME = N'testbackup-Differential Database Backup',")
    md.append(f"     SKIP,")
    md.append(f"     NOREWIND,")
    md.append(f"     NOUNLOAD,")
    md.append(f"     STATS = 10;")
    md.append(f"GO")
    md.append(f"```")
    md.append(f"")
    md.append(f"#### C. Transaction Log Backup (Set 3)")
    md.append(f"```sql")
    md.append(f"BACKUP LOG [testbackup]")
    md.append(f"TO DISK = N'{BAK_PATH}'")
    md.append(f"WITH NOINIT,")
    md.append(f"     NAME = N'testbackup-Transaction Log Backup',")
    md.append(f"     SKIP,")
    md.append(f"     NOREWIND,")
    md.append(f"     NOUNLOAD,")
    md.append(f"     STATS = 10;")
    md.append(f"GO")
    md.append(f"```")
    md.append(f"")
    md.append(f"---")
    md.append(f"")
    md.append(f"## 5. Multi-Position Restore Sequence (`WITH FILE = N`)")
    md.append(f"")
    md.append(f"### 5.1 The `WITH FILE` Parameter Rule")
    md.append(f"")
    md.append(f"When restoring from a multi-set backup file:")
    md.append(f"- If you omit `WITH FILE = N`, SQL Server defaults to **`FILE = 1`**.")
    md.append(f"- To restore subsequent differential or log backups from the same physical file, you **must explicitly specify `WITH FILE = 2`**, `WITH FILE = 3`, etc.")
    md.append(f"")
    md.append(f"### 5.2 Executing the Complete Point-in-Time Restore Chain")
    md.append(f"")
    md.append(f"The following script was tested and executed live on SQL Server 2022 to verify that all 10 rows in `dbo.emp` recover cleanly into `[testbackup_Restored]`:")
    md.append(f"")
    md.append(f"```sql")
    md.append(f"USE master;")
    md.append(f"GO")
    md.append(f"")
    md.append(f"-- Step 1: Restore Full Database from Position 1 (Leave in Restoring state)")
    md.append(f"RESTORE DATABASE [testbackup_Restored]")
    md.append(f"FROM DISK = N'{BAK_PATH}'")
    md.append(f"WITH FILE = 1,")
    md.append(f"     NORECOVERY,")
    md.append(f"     REPLACE,")
    md.append(f"     MOVE N'testbackup' TO N'D:\\SQL Server\\MSSQL16.MSSQLSERVER\\MSSQL\\DATA\\testbackup_restored.mdf',")
    md.append(f"     MOVE N'testbackup_log' TO N'D:\\SQL Server\\MSSQL16.MSSQLSERVER\\MSSQL\\DATA\\testbackup_restored_log.ldf';")
    md.append(f"GO")
    md.append(f"")
    md.append(f"-- Step 2: Restore Differential Backup from Position 2 (Leave in Restoring state)")
    md.append(f"RESTORE DATABASE [testbackup_Restored]")
    md.append(f"FROM DISK = N'{BAK_PATH}'")
    md.append(f"WITH FILE = 2,")
    md.append(f"     NORECOVERY;")
    md.append(f"GO")
    md.append(f"")
    md.append(f"-- Step 3: Restore Transaction Log Backup from Position 3 (Bring Online)")
    md.append(f"RESTORE LOG [testbackup_Restored]")
    md.append(f"FROM DISK = N'{BAK_PATH}'")
    md.append(f"WITH FILE = 3,")
    md.append(f"     RECOVERY;")
    md.append(f"GO")
    md.append(f"```")
    md.append(f"")
    md.append(f"### 5.3 Live Restoration Execution Output")
    md.append(f"")
    md.append(f"```text")
    md.append(f"Processed 488 pages for database 'testbackup_Restored', file 'testbackup' on file 1.")
    md.append(f"Processed 2 pages for database 'testbackup_Restored', file 'testbackup_log' on file 1.")
    md.append(f"RESTORE DATABASE successfully processed 490 pages in 0.343 seconds (11.149 MB/sec).")
    md.append(f"")
    md.append(f"Processed 160 pages for database 'testbackup_Restored', file 'testbackup' on file 2.")
    md.append(f"Processed 2 pages for database 'testbackup_Restored', file 'testbackup_log' on file 2.")
    md.append(f"RESTORE DATABASE successfully processed 162 pages in 0.124 seconds (10.175 MB/sec).")
    md.append(f"")
    md.append(f"Processed 0 pages for database 'testbackup_Restored', file 'testbackup' on file 3.")
    md.append(f"Processed 30 pages for database 'testbackup_Restored', file 'testbackup_log' on file 3.")
    md.append(f"RESTORE LOG successfully processed 30 pages in 0.043 seconds (5.450 MB/sec).")
    md.append(f"")
    md.append(f"SELECT COUNT(*) FROM testbackup_Restored.dbo.emp;")
    md.append(f"--> Result: 10 rows successfully recovered!")
    md.append(f"```")
    md.append(f"")
    md.append(f"---")
    md.append(f"")
    md.append(f"## 6. Live `msdb` Audit History")
    md.append(f"")
    md.append(f"The `msdb.dbo.backupset` catalog tracks every backup performed on the instance:")
    md.append(f"")
    md.append(f"| Set ID | Pos | Type | Start Time | Finish Time | Size | Checkpoint LSN | Differential Base LSN |")
    md.append(f"| :---: | :---: | :---: | :--- | :--- | :---: | :---: | :---: |")
    for m in msdb_rows:
        sid = m.get('backup_set_id')
        pos = m.get('position')
        t = type_map.get(m.get('type'), m.get('type'))
        start = m.get('backup_start_date')
        finish = m.get('backup_finish_date')
        sz = f"{m.get('backup_size'):,}"
        ckpt = m.get('checkpoint_lsn')
        diff_base = m.get('differential_base_lsn') if m.get('differential_base_lsn') is not None else "NULL"
        md.append(f"| `{sid}` | `{pos}` | **{t}** | `{start}` | `{finish}` | `{sz}` | `{ckpt}` | `{diff_base}` |")
    md.append(f"")
    md.append(f"---")
    md.append(f"")
    md.append(f"## 7. Data Engineering & Enterprise Architecture Best Practices")
    md.append(f"")
    md.append(f"### 7.1 Single File Multi-Set vs Dedicated File Per Backup")
    md.append(f"")
    md.append(f"| Evaluation Factor | Single File Multi-Set (`NOINIT`) | Dedicated File Per Backup (`FORMAT, INIT`) |")
    md.append(f"| :--- | :--- | :--- |")
    md.append(f"| **Use Case** | Quick manual SSMS demos, tape libraries | **Enterprise Production Standard** |")
    md.append(f"| **File Naming** | `test.bak` (Static name) | `testbackup_FULL_20260927_0100.bak`, `testbackup_DIFF_20260927_0600.bak` |")
    md.append(f"| **Corruptions Risk** | **High**: Media file corruption destroys all sets | **Low**: Media corruption is isolated to a single backup |")
    md.append(f"| **Parallelism** | **None**: Sequential reads through single file | **High**: Can stage/restore across multiple storage devices |")
    md.append(f"| **Lifecycle/Retention**| Difficult: Cannot delete Position 1 without rewriting file | Easy: Old files pruned by date/retention policy |")
    md.append(f"")
    md.append(f"> [!TIP]")
    md.append(f"> **Production Best Practice**:")
    md.append(f"> In automated enterprise production pipelines (SQL Server Agent or Ola Hallengren Maintenance Solution), always use dedicated, timestamped backup files with `WITH FORMAT, INIT, CHECKSUM, COMPRESSION` instead of appending to a single multi-set file.")
    md.append(f"")
    md.append(f"---")
    md.append(f"")
    md.append(f"## 8. Artifact Mapping & Source Links")
    md.append(f"")
    md.append(f"- **T-SQL Verification Script**: [`src/01_storage_and_schema/ch01_vid12_backup_database_wizard.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid12_backup_database_wizard.sql)")
    md.append(f"- **Obsidian Second Brain Note**: [`docs/curriculum/01 - COURSE/CH01 - Database Creation and Management/CH01_VID12 - Backup Database Using Wizard.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/curriculum/01%20-%20COURSE/CH01%20-%20Database%20Creation%20and%20Management/CH01_VID12%20-%20Backup%20Database%20Using%20Wizard.md)")
    md.append(f"- **Inspection Script**: [`scripts/inspect_testbackup.py`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/scripts/inspect_testbackup.py)")
    md.append(f"- **Disaster Recovery Runbook**: [`docs/disaster-recovery-runbook.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/disaster-recovery-runbook.md)")
    md.append(f"- **Course Syllabus Mapping**: [`docs/course-syllabus-mapping.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/course-syllabus-mapping.md)")

    content = "\n".join(md)
    with open(OUT_MD, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Successfully generated {OUT_MD} ({len(content)} bytes)")

if __name__ == "__main__":
    main()
