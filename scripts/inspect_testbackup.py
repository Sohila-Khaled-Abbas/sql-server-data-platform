import pyodbc

conn = pyodbc.connect('DRIVER={ODBC Driver 18 for SQL Server};SERVER=.;DATABASE=master;Trusted_Connection=yes;TrustServerCertificate=yes;', autocommit=True)
cur = conn.cursor()

# Inspect database testbackup
cur.execute("SELECT database_id, name, state_desc, recovery_model_desc, create_date FROM sys.databases WHERE name = 'testbackup'")
print('Database info:', cur.fetchall())

cur.execute("SELECT file_id, name, physical_name, type_desc, size*8/1024 as size_mb FROM testbackup.sys.database_files")
print('Database files:', cur.fetchall())

cur.execute("SELECT TABLE_SCHEMA, TABLE_NAME FROM testbackup.INFORMATION_SCHEMA.TABLES")
print('Tables in testbackup:', cur.fetchall())

# Query emp in testbackup
cur.execute("SELECT * FROM testbackup.dbo.emp")
print('emp columns:', [desc[0] for desc in cur.description])
print('emp rows:', cur.fetchall())

# Query msdb for testbackup backups
cur.execute("""
SELECT bs.backup_set_id, bs.name, bs.type, bs.backup_start_date, bs.backup_finish_date, bs.checkpoint_lsn, bs.differential_base_lsn, bs.first_lsn, bs.last_lsn, mf.physical_device_name
FROM msdb.dbo.backupset bs
JOIN msdb.dbo.backupmediafamily mf ON bs.media_set_id = mf.media_set_id
WHERE bs.database_name = 'testbackup'
ORDER BY bs.backup_set_id
""")
print('msdb backup history for testbackup:', cur.fetchall())

# RESTORE HEADERONLY on test.bak
bak_path = r"D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\test.bak"
cur.execute(f"RESTORE HEADERONLY FROM DISK = '{bak_path}'")
header_cols = [desc[0] for desc in cur.description]
headers = cur.fetchall()
print(f'Header sets in test.bak ({len(headers)} sets):')
for i, h in enumerate(headers):
    d = dict(zip(header_cols, h))
    type_map = {1: 'Full Database', 2: 'Transaction Log', 4: 'Differential File', 5: 'Differential Database'}
    btype = type_map.get(d.get("BackupType"), str(d.get("BackupType")))
    print(f'Set {i+1}: Position={d.get("Position")}, Name="{d.get("BackupName")}", Type={btype}, DB={d.get("DatabaseName")}, Size={d.get("BackupSize"):,} bytes, CheckpointLSN={d.get("CheckpointLSN")}, DiffBaseLSN={d.get("DifferentialBaseLSN")}, FirstLSN={d.get("FirstLSN")}, LastLSN={d.get("LastLSN")}')

# RESTORE FILELISTONLY on test.bak
cur.execute(f"RESTORE FILELISTONLY FROM DISK = '{bak_path}'")
fl_cols = [desc[0] for desc in cur.description]
fl_rows = cur.fetchall()
print(f'FileList in test.bak:')
for r in fl_rows:
    d = dict(zip(fl_cols, r))
    print(f'  Logical={d.get("LogicalName")}, Physical={d.get("PhysicalName")}, Type={d.get("Type")}, Size={d.get("Size"):,} bytes')
