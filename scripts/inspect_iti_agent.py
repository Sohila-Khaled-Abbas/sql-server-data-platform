import pyodbc

conn = pyodbc.connect('DRIVER={ODBC Driver 18 for SQL Server};SERVER=.;DATABASE=master;Trusted_Connection=yes;TrustServerCertificate=yes;', autocommit=True)
cur = conn.cursor()

# 1. SQL Agent Service
cur.execute("""
SELECT servicename, startup_type_desc, status_desc, CAST(last_startup_time AS VARCHAR(50))
FROM sys.dm_server_services
WHERE servicename LIKE '%Agent%'
""")
print('SQL Agent Service Info:', cur.fetchall())

# 2. Operators in msdb
cur.execute("""
SELECT id, name, enabled, email_address
FROM msdb.dbo.sysoperators
""")
print('Operators:', cur.fetchall())

# 3. Job Info
cur.execute("""
SELECT j.job_id, j.name, j.enabled, j.description, j.date_created, j.date_modified,
       s.step_id, s.step_name, s.subsystem, s.command, s.database_name, s.on_success_action, s.on_fail_action
FROM msdb.dbo.sysjobs j
LEFT JOIN msdb.dbo.sysjobsteps s ON j.job_id = s.job_id
WHERE j.name = 'ITIbackupJob'
""")
print('Job & Step Info:')
for row in cur.fetchall():
    print(' ', row)

# 4. Schedules
cur.execute("""
SELECT s.schedule_id, s.name, s.freq_type, s.freq_interval, s.active_start_time, s.date_created
FROM msdb.dbo.sysschedules s
JOIN msdb.dbo.sysjobschedules js ON s.schedule_id = js.schedule_id
JOIN msdb.dbo.sysjobs j ON js.job_id = j.job_id
WHERE j.name = 'ITIbackupJob'
""")
print('Job Schedules:', cur.fetchall())

# 5. Job History
cur.execute("""
SELECT h.instance_id, h.step_id, h.step_name, h.run_status, h.run_date, h.run_time, h.run_duration, h.message
FROM msdb.dbo.sysjobhistory h
JOIN msdb.dbo.sysjobs j ON h.job_id = j.job_id
WHERE j.name = 'ITIbackupJob'
ORDER BY h.instance_id DESC
""")
print('Job History:')
for row in cur.fetchall():
    print(' ', row)

# 6. RESTORE HEADERONLY on iti.bak
bak_path = r"D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\iti.bak"
cur.execute(f"RESTORE HEADERONLY FROM DISK = '{bak_path}'")
cols = [desc[0] for desc in cur.description]
rows = cur.fetchall()
print(f'Total backup sets in iti.bak: {len(rows)}')
for i, r in enumerate(rows):
    d = dict(zip(cols, r))
    type_map = {1: 'Full Database', 2: 'Transaction Log', 4: 'Differential File', 5: 'Differential Database'}
    btype = type_map.get(d.get("BackupType"), str(d.get("BackupType")))
    print(f'Set {i+1}: Pos={d.get("Position")}, Name="{d.get("BackupName")}", Type={btype}, Size={d.get("BackupSize"):,} bytes, CheckpointLSN={d.get("CheckpointLSN")}, FirstLSN={d.get("FirstLSN")}, LastLSN={d.get("LastLSN")}')
