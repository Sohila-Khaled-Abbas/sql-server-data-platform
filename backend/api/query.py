from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pyodbc
import os

router = APIRouter()

class QueryRequest(BaseModel):
    sql: str
    database: str = "master"

class QueryResponse(BaseModel):
    columns: list[str]
    rows: list[list]
    row_count: int
    execution_time_ms: int
    error: str | None = None

def get_connection_string(db: str) -> str:
    # Use environment variables or fallback to a local SQL Server default
    server = os.getenv("SQL_SERVER", "localhost")
    user = os.getenv("SQL_USER", "sa")
    password = os.getenv("SQL_PASSWORD", "YourStrong!Passw0rd")
    return f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};DATABASE={db};UID={user};PWD={password}"

@router.post("/", response_model=QueryResponse)
def execute_sql_query(request: QueryRequest):
    """
    Executes a T-SQL query against the actual SQL Server.
    """
    conn_str = get_connection_string(request.database)
    
    try:
        # NOTE: In a real production system, direct SQL execution from a frontend
        # is dangerous (SQL Injection). This is suitable for a learning platform/sandbox
        # if the database is strictly sandboxed or uses least-privilege credentials.
        import time
        start_time = time.time()
        
        with pyodbc.connect(conn_str, timeout=5) as conn:
            with conn.cursor() as cursor:
                cursor.execute(request.sql)
                
                # Check if it's a SELECT query (returns rows) or an action query (INSERT/UPDATE/DELETE)
                if cursor.description:
                    columns = [column[0] for column in cursor.description]
                    rows = [list(row) for row in cursor.fetchall()]
                    row_count = len(rows)
                else:
                    columns = []
                    rows = []
                    row_count = cursor.rowcount
                    conn.commit()
                    
        execution_time_ms = int((time.time() - start_time) * 1000)
        
        return QueryResponse(
            columns=columns,
            rows=rows,
            row_count=row_count,
            execution_time_ms=execution_time_ms
        )
        
    except pyodbc.Error as e:
        error_msg = str(e)
        return QueryResponse(
            columns=[],
            rows=[],
            row_count=0,
            execution_time_ms=0,
            error=error_msg
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
