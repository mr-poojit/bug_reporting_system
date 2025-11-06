# Bug Reporting System

A full-stack bug tracker built with:
- Backend: Django 5 + Django REST Framework + SimpleJWT + django-filter + drf-spectacular
- Frontend: React + Vite + TypeScript + Zustand state, axios client
- Auth: JWT (access/refresh)
- DB: SQLite (dev)

The app supports Projects, Issues, and Comments with search/filtering, quick updates, and a polished UI with light/dark themes and subtle animations.

---

## Contents
- Quick Start (Local)
- Quick Start (Docker Compose)
- Environment Variables
- Project Structure
- Useful Commands
- API Overview
- Frontend Details (Theme, UI)
- Troubleshooting

---

## Quick Start (Local)

Prereqs:
- Node 18+ (or 20+ recommended)
- Python 3.11+
- Git Bash or PowerShell on Windows

From the project root:

1) Backend - create/activate venv and run server

```bash
# Windows (Git Bash)
python -m venv myenv
source ./myenv/Scripts/activate

pip install -r backend/requirements.txt

# Optional envs; safe defaults exist
export SECRET_KEY=my-dev-secret
export DEBUG=True
export CORS_ALLOW_ALL_ORIGINS=True

# DB setup
python backend/manage.py makemigrations core
python backend/manage.py migrate

# optional: create admin user
python backend/manage.py createsuperuser

# run dev server (http://localhost:8000)
python backend/manage.py runserver 0.0.0.0:8000
```

Verify: open `http://localhost:8000/api/docs/`.

2) Frontend - configure base URL and run

```bash
cd frontend
# Ensure frontend points to backend
printf "VITE_API_BASE=http://localhost:8000/api\n" > .env.local

npm install
npm run dev
```

Open the printed URL (typically `http://localhost:5173`).

---

## Quick Start (Docker Compose)

Prereqs:
- Docker Desktop running (WSL2 backend enabled on Windows)

From project root:

```bash
docker compose up --build
```

- Backend: `http://localhost:8000/api/docs/`
- Frontend: `http://localhost:5173`

The compose service runs: `python manage.py makemigrations core && python manage.py migrate && python manage.py runserver 0.0.0.0:8000`.

Create a user inside the container (if needed):

```bash
docker compose exec backend python manage.py createsuperuser
```

---

## Environment Variables

Backend (`backend/bugtracker/settings.py` reads these):
- `SECRET_KEY` (default: `dev-secret`)
- `DEBUG` (default: `True`)
- `ALLOWED_HOSTS` (default: `*`)
- `CORS_ALLOW_ALL_ORIGINS` (default: `True`)

Frontend:
- `VITE_API_BASE` (default in `src/api.ts` is `http://localhost:8000/api`)
  - You can set it in `frontend/.env.local`.

---

## Project Structure

```
bug_reporting_system/
  backend/
    bugtracker/
      __init__.py
      asgi.py              # created/fixed
      settings.py
      urls.py
      wsgi.py              # created/fixed
    core/
      models.py            # Project, Issue, Comment
      serializers.py
      permissions.py
      filters.py
      views.py             # API views
      urls.py              # /api/... endpoints
    DockerFile             # backend Dockerfile
    manage.py              # created/fixed entrypoint
    requirements.txt
  frontend/
    src/
      api.ts               # axios client (reads VITE_API_BASE)
      store.ts             # auth + theme store
      components/
        Loader.tsx
        Protected.tsx
        ThemeToggle.tsx    # light/dark toggle
      pages/
        Login.tsx
        Projects.tsx
        ProjectIssues.tsx
        IssueDetail.tsx
      App.tsx
      main.tsx
    DockerFile
    package.json
  docker-compose.yml       # dev stack
  README.md
```

---

## Useful Commands

Backend (local):
```bash
# activate venv
source ./myenv/Scripts/activate

# apply migrations
python backend/manage.py makemigrations core
python backend/manage.py migrate

# create admin user
python backend/manage.py createsuperuser

# run server
python backend/manage.py runserver 0.0.0.0:8000
```

Docker:
```bash
docker compose up --build
# open new terminal when running and exec into backend
docker compose exec backend python manage.py createsuperuser
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## API Overview

Base URL: `/api`

Auth:
- `POST /api/auth/register/` → create user (fields: `username`, `password`, optional `email`)
- `POST /api/auth/token/` → obtain JWT tokens (`access`, `refresh`)
- `POST /api/auth/token/refresh/` → refresh access token

Projects:
- `GET/POST /api/projects/`

Issues:
- `GET/POST /api/projects/{projectId}/issues/` (filters: `status`, `priority`, `search`)
- `GET /api/issues/{id}/`
- `PATCH /api/issues/{id}/patch/` (e.g., `{ status, assignee }`)

Comments:
- `GET/POST /api/issues/{id}/comments/`

Users:
- `GET /api/users/` (for assignee dropdown)

OpenAPI Docs:
- `GET /api/docs/` (Swagger UI)
- `GET /api/schema/` (OpenAPI schema)

---

## Frontend Details (Theme, UI)

- Global light/dark mode with persistence (localStorage) and system preference as default.
- Toggle in header via `ThemeToggle` (🌞/🌙), UI uses gradient backgrounds and glass cards with subtle fade-in.
- Pages:
  - `Login.tsx`: polished auth card with helpful error messages and validation hints.
  - `Projects.tsx`: responsive project cards, create form, pagination.
  - `ProjectIssues.tsx`: filter toolbar (status/priority/search), create issue, cards with status/priority badges and quick actions.
  - `IssueDetail.tsx`: detail card, comment timeline, add comment form.

---

## Troubleshooting

Backend not reachable on 8000:
- Ensure server is running and listening on `0.0.0.0:8000` (dev server prints a startup line).
- Try `http://127.0.0.1:8000/api/docs/` vs `http://localhost:8000/api/docs/`.
- Port conflict: change to another port `python backend/manage.py runserver 0.0.0.0:9000` and set `VITE_API_BASE=http://localhost:9000/api`.

Docker can’t connect to engine:
- Start Docker Desktop, enable WSL2, then `docker version` should show both Client and Server.

Register/Login fails:
- Check Network tab in browser: request URL must be `http://localhost:8000/api/...`.
- 400 on register → payload validation (password too short, username taken). The UI now displays field-level messages.
- 401 on token → wrong credentials; create a user (`createsuperuser`) or register again with valid password.

CORS issues:
- Settings default to allow all origins in dev. If customized, set `CORS_ALLOW_ALL_ORIGINS=True`.

Reset local DB (dev only):
```bash
rm backend/db.sqlite3  # Windows: del backend\db.sqlite3
python backend/manage.py migrate
```

---

## License
MIT (for learning/demo purposes). Replace with your org’s license as needed.

