# CH01_VID13: Backup & SQL Server Agent Jobs Automation — Live Telemetry & Verification Report

> **Environment**: Microsoft SQL Server 2022 Developer Edition (64-bit)  
> **Instance**: `Sohila`  
> **Course**: MaharaTech Course 2305 (*Implementing and Developing SQL Server Objects*)  
> **Instructor**: Eng. Rami Mohamed Abonagi (ITI / MCIT Egypt)  
> **Target Database**: `[ITI]` (Recovery Model: `FULL`)  
> **Live Physical Backup File**: `D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\iti.bak`  
> **Extraction Timestamp**: `2026-09-28 00:08:26`  

---

## 1. Executive Summary & Core Architectural Principles

In **CH01_VID13**, Eng. Rami Mohamed Abonagi explains enterprise database scheduling, automated backups, and reactive event alerting using **SQL Server Agent**.

### The Core Equations of SQL Server Agent:
```text
1. Jobs = Query + [Schedule, Event]
2. SQL Server Agent = Background Windows Service executing asynchronous multi-step workloads
3. Job Trigger Modes:
   ├── [On Demand]   : Manually triggered via SSMS or msdb.dbo.sp_start_job
   ├── [Schedule]    : Time-driven recurring execution (e.g. daily at 12:00 AM)
   └── [Listen Alert]: Event-driven reaction triggered by threshold violations
4. Alerts Architecture (3 Categories):
   ├── Events [Error]: SQL Server error numbers (e.g. 823/824) or Severity levels (16–25)
   ├── Performance   : Performance counters (e.g. General Statistics -> User Connections > 10)
   └── WMI           : Windows Management Instrumentation OS & storage events
5. Operators:
   └── Administrative notification endpoints (Email, Pager, Net Send) notifying admins (e.g. ahmed)
```

---

## 2. Live SQL Server Agent Service Telemetry

The Windows Service hosting the Agent engine was started and verified live:

| Service Name | Startup Type | Current Status | Last Startup Time |
| :--- | :---: | :---: | :--- |
| `SQL Server Agent (MSSQLSERVER)` | `Manual` | **`Running`** | `2026-09-27 23:43:18.2221650 +03:00` |

---

## 3. Live Agent Objects Configured in `msdb`

### 3.1 Operator: `[ahmed]`

Created as the primary administrative alerting endpoint:

| Operator ID | Name | Enabled | E-mail Address |
| :---: | :--- | :---: | :--- |
| `1` | **`ahmed`** | `Yes` | `ahmed@gmail.com` |

### 3.2 Job: `[ITIbackupJob]` & Step `[Q1]`

- **Job ID**: `FD5C8164-F515-4087-9C9B-E4B9F7FCE216`
- **Job Name**: `ITIbackupJob`
- **Enabled**: `Yes`
- **Date Created**: `2026-09-27 23:55:01.883000`
- **Date Modified**: `2026-09-28 00:06:31.460000`

#### Step Configuration (`sysjobsteps`):
| Step ID | Name | Subsystem | Database | Success Action | Failure Action |
| :---: | :--- | :---: | :---: | :--- | :--- |
| `1` | **`Q1`** | `TSQL` | `master` | `Quit with success` | `Quit with failure` |

#### Step 1 T-SQL Command:
```sql
backup database ITI
to disk='D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\iti.bak'
```

### 3.3 Schedule: `[sch1]`

| Schedule ID | Name | Frequency Type | Interval | Start Time | Summary |
| :---: | :--- | :---: | :---: | :---: | :--- |
| `30` | **`sch1`** | `Daily (4)` | `Every 1 Day` | `12:00:00 AM (0)` | Occurs every day at 12:00:00 AM |

### 3.4 Alert: `[alert1]` (Performance Condition Alert)

Directly matching the SSMS Alert configuration from the video:

| Alert Name | Status | Condition Definition | Action: Execute Job | Action: Notify Operator |
| :--- | :---: | :--- | :--- | :--- |
| **`alert1`** | `Enabled` | `General Statistics|User Connections||>|10` | **`ITIbackupJob`** | **`ahmed`** (Email) |

> [!TIP]
> **Alert Condition Explained**:
> `General Statistics|User Connections||>|10` instructs the SQL Server Agent performance listener to monitor the engine counter `User Connections` under the `General Statistics` object. When active user sessions rise above 10, the Agent automatically fires the alert, kicks off `ITIbackupJob` asynchronously, and dispatches an email notification to `ahmed@gmail.com`!

---

## 4. Live Execution History (`sysjobhistory`)

Auditing `msdb.dbo.sysjobhistory` confirms successful executions triggered both manually and via Alert:

| Instance ID | Step | Status | Run Date | Run Time | Duration | Outcome Message |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `1039` | `(Job outcome)` | **Succeeded** | `20260928` | `405` | `1s` | The job succeeded.  The Job was invoked by Alert 1.  The last step to run was step 1 (Q1).  NOTE: Failed to notify 'ahme... |
| `1038` | `Q1` | **Succeeded** | `20260928` | `405` | `1s` | Executed as user: NT SERVICE\SQLSERVERAGENT. Processed 880 pages for database 'ITI', file 'ITI' on file 17. [SQLSTATE 01... |
| `1036` | `(Job outcome)` | **Succeeded** | `20260928` | `345` | `2s` | The job succeeded.  The Job was invoked by Alert 1.  The last step to run was step 1 (Q1).  NOTE: Failed to notify 'ahme... |
| `1035` | `Q1` | **Succeeded** | `20260928` | `345` | `2s` | Executed as user: NT SERVICE\SQLSERVERAGENT. Processed 880 pages for database 'ITI', file 'ITI' on file 16. [SQLSTATE 01... |
| `1034` | `(Job outcome)` | **Succeeded** | `20260928` | `323` | `3s` | The job succeeded.  The Job was invoked by Alert 1.  The last step to run was step 1 (Q1).  NOTE: Failed to notify 'ahme... |
| `1033` | `Q1` | **Succeeded** | `20260928` | `324` | `2s` | Executed as user: NT SERVICE\SQLSERVERAGENT. Processed 880 pages for database 'ITI', file 'ITI' on file 15. [SQLSTATE 01... |
| `1032` | `(Job outcome)` | **Succeeded** | `20260928` | `303` | `5s` | The job succeeded.  The Job was invoked by Alert 1.  The last step to run was step 1 (Q1).  NOTE: Failed to notify 'ahme... |
| `1031` | `Q1` | **Succeeded** | `20260928` | `303` | `5s` | Executed as user: NT SERVICE\SQLSERVERAGENT. Processed 880 pages for database 'ITI', file 'ITI' on file 14. [SQLSTATE 01... |
| `1030` | `(Job outcome)` | **Succeeded** | `20260928` | `243` | `2s` | The job succeeded.  The Job was invoked by Alert 1.  The last step to run was step 1 (Q1).  NOTE: Failed to notify 'ahme... |
| `1029` | `Q1` | **Succeeded** | `20260928` | `243` | `2s` | Executed as user: NT SERVICE\SQLSERVERAGENT. Processed 880 pages for database 'ITI', file 'ITI' on file 13. [SQLSTATE 01... |

---

## 5. Physical Backup Media Verification (`iti.bak`)

- **Physical Path**: `D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\iti.bak`
- **Current File Size**: `133,197,824` bytes (`127.03` MB)
- **Appended Sets in Media Family**: `21` backup sets discovered via `RESTORE HEADERONLY`:

| Position | Type | Size (Bytes) | Checkpoint LSN | First LSN | Last LSN | Backup Finish Time |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `1` | **Full Database** | `7,299,072` | `41000000343200001` | `41000000343200001` | `41000000345600001` | `2026-09-27 23:38:41` |
| `2` | **Transaction Log** | `77,824` | `41000000343200001` | `41000000343200001` | `41000000348000001` | `2026-09-27 23:40:13` |
| `3` | **Full Database** | `7,294,976` | `41000000375200001` | `41000000375200001` | `41000000377600001` | `2026-09-27 23:55:22` |
| `4` | **Full Database** | `7,294,976` | `41000000387200001` | `41000000387200001` | `41000000389600001` | `2026-09-28 00:00:02` |
| `5` | **Full Database** | `7,294,976` | `42000000004000001` | `42000000004000001` | `42000000006400001` | `2026-09-28 00:00:03` |
| `6` | **Full Database** | `7,294,976` | `42000000016000001` | `42000000016000001` | `42000000018400001` | `2026-09-28 00:00:25` |
| `7` | **Full Database** | `7,294,976` | `42000000028000001` | `42000000028000001` | `42000000030400001` | `2026-09-28 00:00:50` |
| `8` | **Full Database** | `7,294,976` | `42000000040000001` | `42000000040000001` | `42000000042400001` | `2026-09-28 00:01:05` |
| `9` | **Full Database** | `7,294,976` | `42000000052000001` | `42000000052000001` | `42000000054400001` | `2026-09-28 00:01:25` |
| `10` | **Full Database** | `7,294,976` | `42000000064000001` | `42000000064000001` | `42000000066400001` | `2026-09-28 00:01:43` |
| `11` | **Full Database** | `7,294,976` | `42000000076000001` | `42000000076000001` | `42000000078400001` | `2026-09-28 00:02:04` |
| `12` | **Full Database** | `7,294,976` | `42000000088000001` | `42000000088000001` | `42000000090400001` | `2026-09-28 00:02:24` |
| `13` | **Full Database** | `7,294,976` | `42000000100000001` | `42000000100000001` | `42000000102400001` | `2026-09-28 00:02:45` |
| `14` | **Full Database** | `7,294,976` | `42000000112000001` | `42000000112000001` | `42000000114400001` | `2026-09-28 00:03:07` |
| `15` | **Full Database** | `7,294,976` | `42000000124000001` | `42000000124000001` | `42000000126400001` | `2026-09-28 00:03:25` |
| `16` | **Full Database** | `7,294,976` | `42000000136000001` | `42000000136000001` | `42000000138400001` | `2026-09-28 00:03:46` |
| `17` | **Full Database** | `7,294,976` | `42000000148000001` | `42000000148000001` | `42000000150400001` | `2026-09-28 00:04:06` |
| `18` | **Full Database** | `7,294,976` | `42000000160000001` | `42000000160000001` | `42000000162400001` | `2026-09-28 00:04:27` |
| `19` | **Transaction Log** | `1,129,472` | `42000000160000001` | `41000000348000001` | `42000000164800001` | `2026-09-28 00:04:27` |
| `20` | **Full Database** | `7,294,976` | `42000000175200001` | `42000000175200001` | `42000000177600001` | `2026-09-28 00:06:27` |
| `21` | **Transaction Log** | `143,360` | `42000000175200001` | `42000000164800001` | `42000000180000001` | `2026-09-28 00:06:27` |

---

## 6. Full Lecture T-SQL Script

```sql
-- Core lecture backup & restore commands executed in CH01_VID13:
backup database ITI
to disk='D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\iti.bak';

backup log ITI
to disk='D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\iti.bak';

restore database ITI
from disk='D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\iti.bak';
```

---

## 7. Artifact Links

- **T-SQL Verification Script**: [`src/01_storage_and_schema/ch01_vid13_backup_sql_agent_jobs.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid13_backup_sql_agent_jobs.sql)
- **Obsidian Second Brain Note**: [`docs/curriculum/01 - COURSE/CH01 - Database Creation and Management/CH01_VID13 - Backup & SQL server agent jobs.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/curriculum/01%20-%20COURSE/CH01%20-%20Database%20Creation%20and%20Management/CH01_VID13%20-%20Backup%20&%20SQL%20server%20agent%20jobs.md)
- **Inspection Script**: [`scripts/inspect_iti_agent.py`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/scripts/inspect_iti_agent.py)