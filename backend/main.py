from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from .api import query

app = FastAPI(
    title="SQL Server Data Platform API",
    description="Backend for executing T-SQL queries and managing user progress.",
    version="1.0.0"
)

# Configure CORS for the frontend (Vite defaults to 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(query.router, prefix="/api/query", tags=["query"])

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "SQL Platform Backend"}

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
