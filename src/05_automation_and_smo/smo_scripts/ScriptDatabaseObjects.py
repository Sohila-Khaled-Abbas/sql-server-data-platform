"""
ScriptDatabaseObjects.py
Module: 05_automation_and_smo/smo_scripts
Purpose: Database-as-Code administrative utility using Python and pyodbc to extract
         and version-control DDL definitions for all user database objects.
"""

import os
import sys
import argparse
from datetime import datetime

try:
    import pyodbc
except ImportError:
    print("Error: pyodbc module is required. Run 'pip install pyodbc' to install.")
    sys.exit(1)


def parse_arguments():
    parser = argparse.ArgumentParser(
        description="Automated SQL Server Schema DDL Scripter"
    )
    parser.add_argument(
        "--server", default="localhost", help="SQL Server Instance (default: localhost)"
    )
    parser.add_argument(
        "--database", default="OmniFlowDB", help="Database Name (default: OmniFlowDB)"
    )
    parser.add_argument(
        "--output-dir", default="./exported_schema", help="Output directory for DDL scripts"
    )
    return parser.parse_args()


def get_connection(server: str, database: str):
    """Establishes an ODBC connection using Windows Authentication."""
    connection_strings = [
        f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};DATABASE={database};Trusted_Connection=yes;",
        f"DRIVER={{SQL Server}};SERVER={server};DATABASE={database};Trusted_Connection=yes;",
    ]
    for conn_str in connection_strings:
        try:
            conn = pyodbc.connect(conn_str, timeout=10)
            return conn
        except pyodbc.Error:
            continue
    raise ConnectionError(f"Could not connect to SQL Server '{server}' using Windows Authentication.")


def export_programmability_objects(conn, output_dir: str):
    """Exports Procedures, Views, Triggers, and Functions via sys.sql_modules."""
    cursor = conn.cursor()
    query = """
    SELECT 
        s.name AS [SchemaName],
        o.name AS [ObjectName],
        o.type_desc AS [ObjectType],
        m.definition AS [SqlDefinition]
    FROM sys.sql_modules m
    JOIN sys.objects o ON m.object_id = o.object_id
    JOIN sys.schemas s ON o.schema_id = s.schema_id
    WHERE o.is_ms_shipped = 0
    ORDER BY o.type_desc, s.name, o.name;
    """
    cursor.execute(query)
    rows = cursor.fetchall()

    print(f">>> Found {len(rows)} programmability objects to export.")

    for schema, obj_name, obj_type, definition in rows:
        type_folder = obj_type.lower().replace(" ", "_")
        target_folder = os.path.join(output_dir, type_folder)
        os.makedirs(target_folder, exist_ok=True)

        file_path = os.path.join(target_folder, f"{schema}.{obj_name}.sql")
        with open(file_path, "w", encoding="utf-8") as f:
            header = (
                f"-- ------------------------------------------------------------\n"
                f"-- Object: {schema}.{obj_name} ({obj_type})\n"
                f"-- Exported on: {datetime.utcnow().isoformat()}Z\n"
                f"-- ------------------------------------------------------------\n\n"
            )
            f.write(header)
            f.write(definition or "-- No definition found\n")
            f.write("\nGO\n")

        print(f"    Exported: {schema}.{obj_name} -> {file_path}")


def main():
    args = parse_arguments()
    print("=" * 65)
    print("  SQL Server Automated Schema DDL Scripter")
    print(f"  Target: {args.server} / {args.database}")
    print(f"  Output Directory: {args.output_dir}")
    print("=" * 65)

    os.makedirs(args.output_dir, exist_ok=True)

    try:
        conn = get_connection(args.server, args.database)
        print(">>> Connected successfully to SQL Server.")
        export_programmability_objects(conn, args.output_dir)
        conn.close()
        print(">>> Schema export completed successfully.")
    except Exception as ex:
        print(f"Error during schema extraction: {ex}")
        sys.exit(1)


if __name__ == "__main__":
    main()
