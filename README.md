# LaunchCircle (Starter)

A minimal full-stack starter for the LaunchCircle idea: **FastAPI** backend, **Next.js 14** frontend, **Postgres**, and **Redis** — all orchestrated with **Docker Compose**.

This is a lightweight scaffold so you can run locally fast. It includes a health endpoint and a simple landing page. You can extend it with your matching, messaging, and projects features.

## Quick start

```bash
# 1) Copy .env.example to .env and adjust if needed
cp .env.example .env

# 2) Build & run
docker compose up --build

# Web:    http://localhost:3000
# API:    http://localhost:8000/api/docs
# Health: http://localhost:8000/api/health
```

## Structure
```
launchcircle/
  apps/
    api/   # FastAPI
    web/   # Next.js
  docker-compose.yml
  .env.example
  README.md
```

## Next Steps
- Add your DB models and Alembic migrations under `apps/api`.
- Build onboarding, projects list, and matching pages in `apps/web/app`.
- Configure auth (next-auth) and secure cookies.
