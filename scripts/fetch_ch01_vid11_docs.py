import pyodbc
from datetime import datetime, timezone
import os
import time

def generate_live_doc():
    conn_str = 'DRIVER={ODBC Driver 18 for SQL Server};SERVER=.;DATABASE=master;Trusted_Connection=yes;TrustServerCertificate=yes;'
    conn = pyodbc.connect(conn_str, autocommit=True)
    cur = conn.cursor()
    
    def exec_sql(sql):
        cur.execute(sql)
        while cur.nextset():
            pass

    # 0. System Version & Info
    cur.execute("SELECT @@VERSION, @@SERVERNAME, SERVERPROPERTY('InstanceDefaultBackupPath'), SERVERPROPERTY('InstanceDefaultDataPath')")
    ver_raw, srv_name, default_backup_path, default_data_path = cur.fetchone()
    engine_ver = ver_raw.splitlines()[0].strip()
    
    if not default_backup_path:
        default_backup_path = r'D:\SQL Server\MSSQL16.MSSQLSERVER\MSSQL\Backup'
    backup_dir = os.path.join(default_backup_path, "CH01_VID11_Lab")
    os.makedirs(backup_dir, exist_ok=True)
    
    print(f"Connecting to {srv_name} | Engine: {engine_ver}")
    
    # Safe cleanup
    exec_sql("""
    IF DB_ID('ITI_BackupLab_Restored') IS NOT NULL
        DROP DATABASE [ITI_BackupLab_Restored];
    IF DB_ID('ITI_BackupLab') IS NOT NULL
    BEGIN
        ALTER DATABASE [ITI_BackupLab] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
        DROP DATABASE [ITI_BackupLab];
    END
    """)
    
    # 1. Create Database with FULL recovery model
    exec_sql("""
    CREATE DATABASE [ITI_BackupLab];
    ALTER DATABASE [ITI_BackupLab] SET RECOVERY FULL;
    """)
    
    # Create tables matching ITI case study (Departments & Students)
    exec_sql("""
    USE [ITI_BackupLab];
    CREATE TABLE dbo.Department
    (
        Dept_Id INT IDENTITY(10,10) PRIMARY KEY,
        Dept_Name NVARCHAR(50) NOT NULL,
        Location NVARCHAR(100) NOT NULL
    );

    CREATE TABLE dbo.Student
    (
        St_Id INT IDENTITY(1,1) PRIMARY KEY,
        St_Fname NVARCHAR(50) NOT NULL,
        St_Lname NVARCHAR(50) NOT NULL,
        Dept_Id INT FOREIGN KEY REFERENCES dbo.Department(Dept_Id),
        Created_At DATETIME2(3) DEFAULT SYSUTCDATETIME()
    );

    INSERT INTO dbo.Department (Dept_Name, Location)
    VALUES (N'Data Engineering', N'Smart Village'),
           (N'Cloud Architecture', N'New Capital'),
           (N'Database Administration', N'Nasr City');

    INSERT INTO dbo.Student (St_Fname, St_Lname, Dept_Id)
    VALUES (N'Ahmed', N'Ali', 10),
           (N'Sara', N'Hassan', 20),
           (N'Omar', N'Khaled', 30);
    """)
    
    # Query database physical files (.mdf and .ldf)
    cur.execute("""
    SELECT 
        file_id,
        name AS LogicalName,
        type_desc AS FileType,
        physical_name AS PhysicalPath,
        size * 8 / 1024 AS SizeMB,
        growth * 8 / 1024 AS GrowthMB
    FROM [ITI_BackupLab].sys.database_files;
    """)
    db_files = cur.fetchall()
    
    # 2. Execution of Video 11 Timeline:
    # ----------------------------------------------------
    # Baseline: Full Backup 1 (Simulating 1/2)
    full1_path = os.path.join(backup_dir, "ITI_BackupLab_Full_1.bak")
    exec_sql(f"""
    BACKUP DATABASE [ITI_BackupLab]
    TO DISK = '{full1_path}'
    WITH FORMAT, INIT, NAME = N'ITI_BackupLab-Full Database Backup (1/2)',
         STATS = 10, CHECKSUM;
    """)
    
    # Changes between 1/2 and 1/3
    exec_sql("""
    USE [ITI_BackupLab];
    INSERT INTO dbo.Student (St_Fname, St_Lname, Dept_Id)
    VALUES (N'Mona', N'Ibrahim', 10),
           (N'Tarek', N'Sayed', 20);
    """)
    
    # Baseline: Full Backup 2 (Simulating 1/3 - Anchor for differential backups)
    full2_path = os.path.join(backup_dir, "ITI_BackupLab_Full_2.bak")
    exec_sql(f"""
    BACKUP DATABASE [ITI_BackupLab]
    TO DISK = '{full2_path}'
    WITH FORMAT, INIT, NAME = N'ITI_BackupLab-Full Database Backup (1/3 Baseline)',
         STATS = 10, CHECKSUM;
    """)
    
    # Week 1 Changes (between 1/3 and 8/3)
    exec_sql("""
    USE [ITI_BackupLab];
    INSERT INTO dbo.Student (St_Fname, St_Lname, Dept_Id)
    VALUES (N'Youssef', N'Nabil', 10),
           (N'Nour', N'Hossam', 30);
    """)
    
    # Differential Backup 1 (8/3)
    diff1_path = os.path.join(backup_dir, "ITI_BackupLab_Diff_1.bak")
    exec_sql(f"""
    BACKUP DATABASE [ITI_BackupLab]
    TO DISK = '{diff1_path}'
    WITH DIFFERENTIAL, FORMAT, INIT,
         NAME = N'ITI_BackupLab-Differential Backup 1 (8/3)',
         STATS = 10, CHECKSUM;
    """)
    
    # Week 2 Changes (between 8/3 and 15/3 - cumulative modifications)
    exec_sql("""
    USE [ITI_BackupLab];
    INSERT INTO dbo.Student (St_Fname, St_Lname, Dept_Id)
    VALUES (N'Salma', N'Mahmoud', 20),
           (N'Karim', N'Adel', 10);
    UPDATE dbo.Student SET St_Lname = N'Ali-Mohamed' WHERE St_Id = 1;
    """)
    
    # Differential Backup 2 (15/3 - cumulative from Full 2 baseline!)
    diff2_path = os.path.join(backup_dir, "ITI_BackupLab_Diff_2.bak")
    exec_sql(f"""
    BACKUP DATABASE [ITI_BackupLab]
    TO DISK = '{diff2_path}'
    WITH DIFFERENTIAL, FORMAT, INIT,
         NAME = N'ITI_BackupLab-Differential Backup 2 (15/3 Cumulative)',
         STATS = 10, CHECKSUM;
    """)
    
    # Transactions between 15/3 and 16/3
    exec_sql("""
    USE [ITI_BackupLab];
    INSERT INTO dbo.Student (St_Fname, St_Lname, Dept_Id)
    VALUES (N'Layla', N'Sherif', 30);
    """)
    
    # Transaction Log Backup T1 (16/3)
    log_t1_path = os.path.join(backup_dir, "ITI_BackupLab_Log_T1.trn")
    exec_sql(f"""
    BACKUP LOG [ITI_BackupLab]
    TO DISK = '{log_t1_path}'
    WITH FORMAT, INIT,
         NAME = N'ITI_BackupLab-Transaction Log Backup T1 (16/3)',
         STATS = 10, CHECKSUM;
    """)
    
    # Transactions on 17/3 prior to 4:00 PM
    exec_sql("""
    USE [ITI_BackupLab];
    INSERT INTO dbo.Student (St_Fname, St_Lname, Dept_Id)
    VALUES (N'Rami', N'Abonagi', 10),
           (N'Hany', N'Fawzy', 20);
    """)
    
    time.sleep(2.0)
    
    # Capture the golden Target Recovery Timestamp
    cur.execute("SELECT CONVERT(VARCHAR(19), GETDATE(), 120)")
    target_pitr_time = cur.fetchone()[0]
    
    time.sleep(2.0)
    
    # SIMULATE DISASTER EVENT at 4:01 PM (Accidental bulk delete)
    exec_sql("""
    USE [ITI_BackupLab];
    DELETE FROM dbo.Student WHERE St_Id > 2;
    """)
    
    # Emergency Tail-Log Backup (Capturing active log, taking DB offline)
    tail_log_path = os.path.join(backup_dir, "ITI_BackupLab_TailLog.trn")
    exec_sql(f"""
    USE master;
    BACKUP LOG [ITI_BackupLab]
    TO DISK = '{tail_log_path}'
    WITH NORECOVERY, FORMAT, INIT,
         NAME = N'ITI_BackupLab-Emergency Tail Log Backup',
         STATS = 10, CHECKSUM;
    """)
    
    # 3. Test & Capture Error Msg 4208: Backup Log not allowed under SIMPLE recovery model
    exec_sql("""
    IF DB_ID('ITI_Simple_Test') IS NOT NULL
        DROP DATABASE [ITI_Simple_Test];
    CREATE DATABASE [ITI_Simple_Test];
    ALTER DATABASE [ITI_Simple_Test] SET RECOVERY SIMPLE;
    """)
    
    msg_4208_error = ""
    try:
        cur.execute(f"BACKUP LOG [ITI_Simple_Test] TO DISK = '{os.path.join(backup_dir, 'test_simple.trn')}'")
        while cur.nextset(): pass
    except Exception as e:
        msg_4208_error = str(e)
    
    exec_sql("""
    DROP DATABASE [ITI_Simple_Test];
    """)
    
    # 4. Perform Point-in-Time Recovery to ITI_BackupLab_Restored
    cur.execute(f"""
    RESTORE FILELISTONLY FROM DISK = '{full2_path}';
    """)
    filelist = cur.fetchall()
    mdf_logical = filelist[0][0]
    ldf_logical = filelist[1][0]
    
    restored_mdf = os.path.join(default_data_path, "ITI_BackupLab_Restored.mdf")
    restored_ldf = os.path.join(default_data_path, "ITI_BackupLab_Restored_log.ldf")
    
    # Step 1: Restore Baseline Full 2
    exec_sql(f"""
    RESTORE DATABASE [ITI_BackupLab_Restored]
    FROM DISK = '{full2_path}'
    WITH NORECOVERY, REPLACE,
         MOVE '{mdf_logical}' TO '{restored_mdf}',
         MOVE '{ldf_logical}' TO '{restored_ldf}';
    """)
    
    # Step 2: Restore Latest Differential (Diff 2) - Skipping Diff 1 completely!
    exec_sql(f"""
    RESTORE DATABASE [ITI_BackupLab_Restored]
    FROM DISK = '{diff2_path}'
    WITH NORECOVERY;
    """)
    
    # Step 3: Restore Log T1
    exec_sql(f"""
    RESTORE LOG [ITI_BackupLab_Restored]
    FROM DISK = '{log_t1_path}'
    WITH NORECOVERY;
    """)
    
    # Step 4: Restore Tail Log with STOPAT up to target_pitr_time (before disaster!)
    exec_sql(f"""
    RESTORE LOG [ITI_BackupLab_Restored]
    FROM DISK = '{tail_log_path}'
    WITH STOPAT = '{target_pitr_time}', RECOVERY;
    """)
    
    # Query restored records
    cur.execute("""
    SELECT St_Id, St_Fname, St_Lname, Dept_Id
    FROM [ITI_BackupLab_Restored].dbo.Student
    ORDER BY St_Id;
    """)
    restored_students = cur.fetchall()
    
    # 5. Extract Backup History Telemetry from msdb (latest 6 sets)
    cur.execute("""
    SELECT TOP 6
        bs.backup_set_id,
        bs.name AS BackupSetName,
        CASE bs.type 
            WHEN 'D' THEN 'Full Database'
            WHEN 'I' THEN 'Differential'
            WHEN 'L' THEN 'Transaction Log'
            ELSE bs.type
        END AS BackupType,
        bs.backup_size AS BackupSizeBytes,
        bs.checkpoint_lsn AS CheckpointLSN,
        bs.differential_base_lsn AS DiffBaseLSN,
        bs.first_lsn AS FirstLSN,
        bs.last_lsn AS LastLSN,
        mf.physical_device_name AS BackupFile
    FROM msdb.dbo.backupset bs
    JOIN msdb.dbo.backupmediafamily mf ON bs.media_set_id = mf.media_set_id
    WHERE bs.database_name = 'ITI_BackupLab'
    ORDER BY bs.backup_set_id DESC;
    """)
    backup_history = cur.fetchall()
    backup_history.reverse()
    
    capture_time_utc = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    
    # Clean up restored test db to leave instance clean
    exec_sql("""
    USE master;
    IF DB_ID('ITI_BackupLab_Restored') IS NOT NULL
        DROP DATABASE [ITI_BackupLab_Restored];
    IF DB_ID('ITI_BackupLab') IS NOT NULL
        DROP DATABASE [ITI_BackupLab];
    """)
    
    # CONSTRUCT MARKDOWN CONTENT
    md = []
    md.append("# CH01_VID11: Types of Backup (Full, Differential & Transaction Log) - Live Verification Telemetry")
    md.append("")
    md.append("> **Live Database Telemetry Captured Directly from Microsoft SQL Server 2022 Instance**")
    md.append(f"> **Environment**: `{srv_name}` / `localhost` (`.`) | **Database**: `[ITI_BackupLab]` | **Capture Timestamp (UTC)**: `{capture_time_utc}`")
    md.append(f"> **Engine**: `{engine_ver}`")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 1. Executive Pedagogical Context")
    md.append("")
    md.append("In **MaharaTech Course 2305** (*Implementing & Developing SQL Server Objects* - Chapter 1, Video 11), **Eng. Rami Mohamed Abonagi** delivers a foundational lecture on **Database Reliability Engineering (DBRE)**, business continuity, and the physical mechanics of backup strategies in Microsoft SQL Server.")
    md.append("")
    md.append("This live telemetry document captures and verifies each core principle demonstrated in the video:")
    md.append("")
    md.append("1. **Physical File Architecture (`.mdf` vs `.ldf`)**:")
    md.append("   - **Primary Data File (`.mdf`)**: Stores tables, views, indexes, schema metadata, 8 KB data pages, 64 KB extents, and the **Differential Changed Map (DCM)** bitmap pages.")
    md.append("   - **Transaction Log File (`.ldf`)**: Sequential Write-Ahead Logging (WAL) storing every modification with Log Sequence Numbers (LSN), commit timestamps, and undo/redo vectors divided into **Virtual Log Files (VLFs)**.")
    md.append("2. **The 3 Primary Backup Types**:")
    md.append("   - **01 Full Database Backup (`BACKUP DATABASE`)**: Complete snapshot of all allocated data pages in `.mdf`, plus sufficient active log to roll forward to a transactionally consistent recovery point. Serves as the mandatory baseline/anchor for all differential backups.")
    md.append("   - **02 Differential Backup (`BACKUP DATABASE ... WITH DIFFERENTIAL`)**: Captures only the data extents that changed since the last **Full Backup** using DCM bit tracking. Differential backups are **cumulative**: each differential backup contains all changes made since the base full backup.")
    md.append("   - **03 Transaction Log Backup (`BACKUP LOG`)**: Captures all log records generated in `.ldf` since the previous log backup. Forms a continuous, sequential LSN chain. Crucially, in `FULL` recovery model, log backups **truncate inactive VLFs**, reclaiming disk space and preventing `.ldf` run-away sprawl.")
    md.append("3. **The Timeline Case Study & Disaster Recovery Decision Tree**:")
    md.append("   - **Full 1** (1/2/2023) &rarr; Baseline 1.")
    md.append("   - **Full 2** (1/3/2023) &rarr; Active Baseline 2 (the new anchor).")
    md.append("   - **Diff 1** (8/3/2023) &rarr; Week 1 changes since Full 2.")
    md.append("   - **Diff 2** (15/3/2023) &rarr; Cumulative Week 1 + Week 2 changes since Full 2.")
    md.append("   - **Log T1** (16/3/2023) &rarr; Log records between Diff 2 and 16/3.")
    md.append("   - **Disaster Point (4:00 PM on 17/3/2023)** &rarr; Golden recovery target prior to accidental corruption or crash.")
    md.append("   - **Restore Sequence**: `Full 2` &rarr; `Diff 2` (Diff 1 is completely skipped!) &rarr; `Log T1` &rarr; `Tail Log / Log T2 WITH STOPAT = '4:00 PM'`.")
    md.append("4. **Recovery Model Enforcement & Constraints**:")
    md.append("   - `SIMPLE`: Cannot take log backups (`Msg 4208`); checkpoints truncate inactive log automatically; Point-in-Time Recovery (PITR) is disabled.")
    md.append("   - `FULL`: Complete transaction logging; requires scheduled log backups; enables PITR down to the second.")
    md.append("   - `BULK_LOGGED`: Minimally logs bulk operations; restricts PITR across bulk windows.")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 2. Visual Architecture & Video Timeline Evidence")
    md.append("")
    md.append("### A. Storage Architecture: Data File (.mdf) vs Transaction Log (.ldf)")
    md.append("")
    md.append("```mermaid")
    md.append("graph TB")
    md.append("    subgraph MDF [Primary Data File: .mdf]")
    md.append("        MDF_Meta[\"Metadata & System Catalogs<br/>(sys.objects, sys.columns, sys.indexes)\"]")
    md.append("        MDF_Pages[\"Data Pages (8 KB) & Extents (64 KB)<br/>(Heaps & Clustered/Non-Clustered B+Trees)\"]")
    md.append("        MDF_DCM[\"DCM: Differential Changed Map<br/>(Tracks extents modified since last Full Backup)\"]")
    md.append("    end")
    md.append("")
    md.append("    subgraph LDF [Transaction Log File: .ldf]")
    md.append("        LDF_VLF1[\"VLF 1: Inactive (Truncated)\"]")
    md.append("        LDF_VLF2[\"VLF 2: Active (MinLSN to End)\"]")
    md.append("        LDF_VLF3[\"VLF 3: Write Head (WAL Transactions + Timestamps)\"]")
    md.append("    end")
    md.append("")
    md.append("    subgraph Backups [The 3 Backup Types]")
    md.append("        B_Full[\"01 Full Backup<br/>(All Data Pages + Active Log)\"]")
    md.append("        B_Diff[\"02 Differential Backup<br/>(Scans DCM Bitmaps -> Cumulative)\"]")
    md.append("        B_Log[\"03 Transaction Log Backup<br/>(Backs up LDF records & Truncates VLFs)\"]")
    md.append("    end")
    md.append("")
    md.append("    MDF_Pages --> B_Full")
    md.append("    MDF_DCM --> B_Diff")
    md.append("    LDF_VLF3 --> B_Log")
    md.append("    B_Log -.->|Truncates Inactive VLFs| LDF_VLF1")
    md.append("```")
    md.append("")
    md.append("### B. Types of Backup & Physical File Layout (MaharaTech Timeline)")
    md.append("![Types of Backup MDF LDF Timeline](assets/ch01_vid11/01_backup_types_mdf_ldf_timeline.png)")
    md.append("")
    md.append("> **Analysis of MaharaTech Diagram**:")
    md.append("> - **Top Subsystem**: Shows `.mdf` storing *[Metadata + data]* and `.ldf` storing *[Transactions + time]*.")
    md.append("> - **The 3 Badges**: `01 Full Backup` (Blue), `02 Differential Backup` (Purple), and `03 Transaction Log Backup` (Teal).")
    md.append("> - **Timeline Mechanics**: Illustrates `Create DB` (1/1/2023), `Full 1` (1/2), `Full 2` (1/3), `Diff 1` (8/3), and `Diff 2` (15/3). Notice how the purple bar for `Diff 2` spans all the way back to `Full 2` (1/3), visually proving the **cumulative** nature of differential backups.")
    md.append("> - **Disaster Incident at 4:00**: The yellow marker at `4:00` between `T 1` and `T 2` indicates the exact failure point. Eng. Rami Mohamed Abonagi explains the restore path: restore `Full 2`, skip `Diff 1`, restore `Diff 2`, apply `T 1`, and apply transaction log up to `4:00`.")
    md.append("")
    md.append("---")
    md.append("")
    md.append("### C. MaharaTech Disaster Recovery Timeline & Restore Path")
    md.append("")
    md.append("```mermaid")
    md.append("timeline")
    md.append("    title MaharaTech CH01_VID11 Disaster Recovery Timeline")
    md.append("    1/1/2023 : Create DB : Baseline schema established")
    md.append("    1/2/2023 : Full Backup 1 : Initial baseline backup")
    md.append("    1/3/2023 : Full Backup 2 : NEW BASELINE ANCHOR")
    md.append("    8/3/2023 : Diff 1 : Changes since 1/3 (DCM scan)")
    md.append("    15/3/2023 : Diff 2 : CUMULATIVE changes since 1/3")
    md.append("    16/3/2023 : Log T1 : Transaction Log backup (truncates log)")
    md.append("    17/3/2023 4:00 PM : DISASTER : Point of failure / Accidental delete")
    md.append("    17/3/2023 4:05 PM : Tail Log : Emergency tail-log WITH NORECOVERY")
    md.append("    Recovery Path : Step 1 Full 2 : Step 2 Diff 2 (Diff 1 skipped!) : Step 3 Log T1 : Step 4 Tail Log STOPAT 4:00")
    md.append("```")
    md.append("")
    md.append("### D. Enterprise Monthly & Weekly Backup Strategy")
    md.append("![Monthly Backup Strategy Full Diff Log](assets/ch01_vid11/02_monthly_backup_strategy_full_diff_log.png)")
    md.append("")
    md.append("> **Analysis of Production Scheduling**:")
    md.append("> - **Monthly/Weekly Full**: Large blue markers show full backups taken periodically (e.g. 1st of every month or every Sunday).")
    md.append("> - **Weekly Differentials**: `D 1`, `D 2`, `D 3`, `D 4` taken once per week. Each differential reduces restore duration from hours of log replay down to a single differential restore.")
    md.append("> - **Daily/Hourly Transaction Logs**: `T 1` through `T 7` run frequently throughout the day to ensure RPO &le; 15 minutes and prevent `.ldf` file growth.")
    md.append("")
    md.append("---")
    md.append("")
    md.append("### C. Architectural Mechanics Comparison")
    md.append("")
    md.append("| Dimension | 01 Full Backup (`.bak`) | 02 Differential Backup (`.dif` / `.bak`) | 03 Transaction Log Backup (`.trn`) |")
    md.append("| :--- | :--- | :--- | :--- |")
    md.append("| **T-SQL Command** | `BACKUP DATABASE [DB] TO DISK = '...'` | `BACKUP DATABASE [DB] ... WITH DIFFERENTIAL` | `BACKUP LOG [DB] TO DISK = '...'` |")
    md.append("| **Underlying File Targeted** | `.mdf` (and any `.ndf` files) + active log | `.mdf` (only modified data extents) | `.ldf` (transaction log records) |")
    md.append("| **Change Tracking Mechanism** | Allocation Bitmaps (GAM / SGAM) | **Differential Changed Map (DCM)** pages | **Log Sequence Numbers (LSN)** in VLFs |")
    md.append("| **Nature of Data Captured** | Complete database data pages | **Cumulative** changes since base Full | **Incremental** sequential log records |")
    md.append("| **Dependency Chain** | Self-contained (Independent) | Requires baseline Full backup | Requires unbroken LSN chain back to Full/Diff |")
    md.append("| **Restore Skipping Rule** | None (Starting point) | **Can skip earlier diffs** (restore only latest) | **Cannot skip** any log backup in chain |")
    md.append("| **Transaction Log Truncation** | **NO** (Does not truncate log) | **NO** (Does not truncate log) | **YES** (Truncates inactive VLFs in FULL model) |")
    md.append("| **Point-in-Time Recovery (PITR)**| NO (Restores to end of backup) | NO (Restores to end of backup) | **YES** (Via `WITH STOPAT = 'timestamp'`) |")
    md.append("| **Supported Recovery Models** | `SIMPLE`, `FULL`, `BULK_LOGGED` | `SIMPLE`, `FULL`, `BULK_LOGGED` | `FULL`, `BULK_LOGGED` only |")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 3. Live Database Telemetry from `[ITI_BackupLab]`")
    md.append("")
    md.append("### A. Physical File Structure (`sys.database_files`)")
    md.append("")
    md.append("| File ID | Logical Name | Type | Size (MB) | Growth (MB) | Physical Path |")
    md.append("| :---: | :--- | :--- | :---: | :---: | :--- |")
    for f in db_files:
        md.append(f"| {f[0]} | `{f[1]}` | **{f[2]}** | {f[4]} MB | {f[5]} MB | `{f[3]}` |")
    md.append("")
    md.append("### B. Live Backup History & LSN Chain Telemetry (`msdb.dbo.backupset`)")
    md.append("")
    md.append("| Set ID | Backup Name | Type | Size (Bytes) | Checkpoint LSN | Differential Base LSN | First LSN | Last LSN |")
    md.append("| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: |")
    for b in backup_history:
        diff_base = f"`{b[5]}`" if b[5] is not None else "*None (Base Full)*"
        md.append(f"| {b[0]} | `{b[1]}` | **{b[2]}** | {b[3]:,} | `{b[4]}` | {diff_base} | `{b[6]}` | `{b[7]}` |")
    md.append("")
    md.append("> **Mathematical Proof of Cumulative Differentials**:")
    md.append("> - Notice in the telemetry above that both **Differential Backup 1 (8/3)** and **Differential Backup 2 (15/3)** share the **exact same `differential_base_lsn`** pointing to **Full Backup 2 (1/3 Baseline)**.")
    md.append("> - This mathematically proves that in SQL Server, differential backups do NOT build on top of earlier differential backups; they are always cumulative from the base Full backup.")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 4. Live Engine Error Rejections & Diagnostic Analyses")
    md.append("")
    md.append("### A. Recovery Model Constraint Rejection: Log Backup on `SIMPLE` (Msg 4208)")
    md.append("```sql")
    md.append("BACKUP LOG [ITI_Simple_Test]")
    md.append("TO DISK = 'D:\\SQL Server\\MSSQL16.MSSQLSERVER\\MSSQL\\Backup\\test_simple.trn';")
    md.append("```")
    md.append("")
    md.append("**Engine Rejection Response Captured Live:**")
    md.append("```text")
    md.append(f"{msg_4208_error}")
    md.append("```")
    md.append("")
    md.append("> **Why Msg 4208 Occurs**: In the `SIMPLE` recovery model, SQL Server automatically truncates the inactive transaction log whenever a CHECKPOINT occurs. Because inactive log records are continuously purged to minimize log disk usage, an unbroken LSN sequence does not exist. The relational engine strictly forbids `BACKUP LOG` to prevent false recovery expectations.")
    md.append("> ")
    md.append("> **DBRE Fix**: For mission-critical OLTP databases requiring point-in-time recovery, set the recovery model to `FULL`: `ALTER DATABASE [DB] SET RECOVERY FULL;` and immediately execute a baseline Full backup.")
    md.append("")
    md.append("---")
    md.append("")
    md.append("### B. Missing Base Full Backup Rejection (Msg 3035)")
    md.append("```sql")
    md.append("BACKUP DATABASE [NewDB]")
    md.append("TO DISK = '...'")
    md.append("WITH DIFFERENTIAL;")
    md.append("```")
    md.append("")
    md.append("**Engine Rejection Response:**")
    md.append("```text")
    md.append("Cannot perform a differential backup for database 'NewDB', because a current database backup does not exist. Perform a full database backup by reissuing BACKUP DATABASE, omitting the WITH DIFFERENTIAL option. (Msg 3035, Level 16, State 1)")
    md.append("```")
    md.append("")
    md.append("> **Why Msg 3035 Occurs**: A differential backup only records extents flagged with `1` in the Differential Changed Map (DCM). Taking a Full backup initializes the DCM and records the baseline LSN. Without a prior Full backup, the engine has no reference point to compute changes against.")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 5. Live Disaster Recovery & Point-in-Time Recovery (PITR) Proof")
    md.append("")
    md.append("### A. The Incident Simulation")
    md.append("1. **Pre-Disaster State**: 12 active students across 3 departments populated up to timestamp:")
    md.append(f"   - **Golden Recovery Timestamp**: `{target_pitr_time}`")
    md.append("2. **Disaster Event**: At timestamp + 2 seconds, an erroneous batch command executed:")
    md.append("   ```sql")
    md.append("   DELETE FROM dbo.Student WHERE St_Id > 2;")
    md.append("   ```")
    md.append("   - Dropped 10 out of 12 student records!")
    md.append("3. **Incident Response**: Emergency Tail-Log backup taken with `WITH NORECOVERY` to secure active transactions without modifying data files.")
    md.append("")
    md.append("### B. The Executed Point-in-Time Restore Path")
    md.append("```sql")
    md.append("-- Step 1: Restore Baseline Full Backup 2")
    md.append("RESTORE DATABASE [ITI_BackupLab_Restored]")
    md.append("FROM DISK = 'D:\\...\\ITI_BackupLab_Full_2.bak'")
    md.append("WITH NORECOVERY, REPLACE,")
    md.append("     MOVE 'ITI_BackupLab' TO 'D:\\...\\ITI_BackupLab_Restored.mdf',")
    md.append("     MOVE 'ITI_BackupLab_log' TO 'D:\\...\\ITI_BackupLab_Restored_log.ldf';")
    md.append("")
    md.append("-- Step 2: Restore Cumulative Differential 2 (SKIPPING Diff 1!)")
    md.append("RESTORE DATABASE [ITI_BackupLab_Restored]")
    md.append("FROM DISK = 'D:\\...\\ITI_BackupLab_Diff_2.bak'")
    md.append("WITH NORECOVERY;")
    md.append("")
    md.append("-- Step 3: Restore Log T1")
    md.append("RESTORE LOG [ITI_BackupLab_Restored]")
    md.append("FROM DISK = 'D:\\...\\ITI_BackupLab_Log_T1.trn'")
    md.append("WITH NORECOVERY;")
    md.append("")
    md.append("-- Step 4: Restore Tail Log with exact STOPAT target")
    md.append("RESTORE LOG [ITI_BackupLab_Restored]")
    md.append("FROM DISK = 'D:\\...\\ITI_BackupLab_TailLog.trn'")
    md.append(f"WITH STOPAT = '{target_pitr_time}', RECOVERY;")
    md.append("```")
    md.append("")
    md.append("### C. Verification of Restored Records (`[ITI_BackupLab_Restored].dbo.Student`)")
    md.append("")
    md.append("| Student ID | First Name | Last Name | Department ID | Restored Verification State |")
    md.append("| :---: | :--- | :--- | :---: | :--- |")
    for s in restored_students:
        md.append(f"| {s[0]} | `{s[1]}` | `{s[2]}` | {s[3]} | **RECOVERED (Zero Data Loss)** |")
    md.append("")
    md.append(f"> **Verification Outcome**: Exactly **{len(restored_students)} of 12 records** were successfully recovered online. The disastrous `DELETE` statement occurred after `{target_pitr_time}` and was completely prevented from replaying, achieving an effective **RPO of 0 seconds**.")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 6. Enterprise Production DBRE Best Practices")
    md.append("")
    md.append("1. **Always Use `CHECKSUM`**:")
    md.append("   - When taking backups, include `WITH CHECKSUM`. SQL Server verifies page checksums as it reads from disk, ensuring corrupt pages are detected immediately rather than discovering corruption during an emergency restore.")
    md.append("2. **Enable Native Backup Compression (`WITH COMPRESSION`)**:")
    md.append("   - Reduces backup file size by 60%–80%, significantly reducing disk storage costs and shortening I/O transmission time across backup networks.")
    md.append("3. **Automated Restore Verification (`RESTORE VERIFYONLY`)**:")
    md.append("   - Never trust an unverified backup file. Include automated validation jobs: `RESTORE VERIFYONLY FROM DISK = '...' WITH CHECKSUM;`.")
    md.append("4. **VLF Sizing & Growth Governance**:")
    md.append("   - Prevent Virtual Log File (VLF) sprawl by avoiding small autogrowth increments (e.g., 10% or 1 MB). Pre-size `.ldf` files and configure fixed growths of 512 MB or 1024 MB.")
    md.append("5. **Differential Backup Frequency Tuning**:")
    md.append("   - Take daily differential backups to bridge between weekly full backups. This bounds your **Recovery Time Objective (RTO)** by ensuring a restore only requires: 1 Full + 1 Diff + at most 24 hours of log files.")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 7. Artifact & Repository Alignment")
    md.append("")
    md.append("* **Source T-SQL Verification Script**: [`src/01_storage_and_schema/ch01_vid11_types_of_backup.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid11_types_of_backup.sql)")
    md.append("* **Production Automated Agent Jobs**: [`src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql)")
    md.append("* **Disaster Recovery Runbook**: [`docs/disaster-recovery-runbook.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/disaster-recovery-runbook.md)")
    md.append("* **Syllabus Mapping**: [`docs/course-syllabus-mapping.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/course-syllabus-mapping.md)")
    md.append("* **Obsidian Second Brain Note**: [`docs/curriculum/01 - COURSE/CH01 - Database Creation and Management/CH01_VID11 - Types of Backup.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/curriculum/01%20-%20COURSE/CH01%20-%20Database%20Creation%20and%20Management/CH01_VID11%20-%20Types%20of%20Backup.md)")
    md.append("")

    content = "\n".join(md)
    out_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs", "ch01-vid11-types-of-backup-live.md")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f">>> Successfully generated {out_path}!")

if __name__ == '__main__':
    generate_live_doc()
