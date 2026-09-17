# Security Policy

## Supported Versions

| Version | Supported |
| :--- | :--- |
| SQL Server 2022 (v16.x) | :white_check_mark: |
| SQL Server 2019 (v15.x) | :white_check_mark: |
| SQL Server 2017 & Older | :x: |

---

## Architectural Security Principles

The **OmniFlow Data Platform** enforces several built-in security guardrails:

### 1. Dynamic SQL & Injection Defense
* Direct concatenation of untrusted input into query strings is strictly prohibited.
* Dynamic SQL must be parameterized using `sys.sp_executesql` with strongly typed parameters.
* Database object names (tables, schemas, columns) used dynamically must be wrapped with `QUOTENAME()`.
* Reference implementation: [`src/04_governance_and_audit/03_dynamic_sql_guardrails.sql`](src/04_governance_and_audit/03_dynamic_sql_guardrails.sql).

### 2. DDL Governance & Destruction Prevention
* Database-level DDL triggers intercept and block unauthorized `DROP TABLE` statements on production schemas.
* Dropping critical production tables requires explicit session authorization via `SESSION_CONTEXT(N'AllowDropProductionTable')`.
* Reference implementation: [`src/04_governance_and_audit/02_ddl_and_server_triggers.sql`](src/04_governance_and_audit/02_ddl_and_server_triggers.sql).

### 3. Credential & Secret Management
* **Never** commit production passwords, connection strings, or service account credentials to Git.
* Use Windows Integrated Authentication (`-E` in `sqlcmd`) whenever running locally.
* For Docker environments, store passwords in a non-committed `.env` file based on `docker/.env.example`.

---

## Reporting a Vulnerability

If you discover a security vulnerability or injection flaw in this repository:
1. Do **not** open a public GitHub issue.
2. Send a confidential report describing the vulnerability and reproduction steps to the repository maintainer.
3. You will receive an acknowledgment within 48 hours, followed by a security patch.
