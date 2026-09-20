---
type: case-study
title: "OmniFlow SQL Server 2022 Enterprise Data Platform"
status: completed
tags:
  - portfolio
  - data-engineering
  - dbre
---

# Portfolio Case Study — OmniFlow Enterprise Data Platform

## 🎯 Executive Summary
Engineered an enterprise data platform on Microsoft SQL Server 2022 Developer Edition, translating raw operational transactions into an analytical Kimball star schema. Features physical multi-filegroup storage allocation, streaming Table-Valued Parameter (TVP) ingestion, event-driven DDL audit triggers, C# SQL CLR cryptographic extensions, and automated disaster recovery maintenance chains.

## 🏗️ Key Architecture Pillars
1. **Physical Storage Engine**: Segregated PRIMARY, DATA_FG, INDEX_FG, and ARCHIVE_FG filegroups with sliding-window partition switching.
2. **Procedural Ingestion**: High-throughput batch streaming via UDTTs eliminating client round-trips.
3. **Governance & Auditing**: Schema modification defense capturing EVENTDATA() XML payloads.
4. **Kimball Data Mart**: OmniFlowDW featuring surrogate keys and automated SCD Type 2 tracking.
5. **CI/CD Verification**: Automated pytest suite running against a containerized SQL Server 2022 instance on GitHub Actions.
