# HOPEr Setup and Deployment Notes

This guide is for engineers cloning the repository and running HOPEr locally or preparing deployment.

---

## 1) Repository Structure

- Frontend app: `src`
- Backend API: `backend`

---

## 2) Prerequisites

Install the following before setup:

- Node.js 18+ and npm
- Python 3.10+ (3.11/3.12 recommended)
- Git

---

## 3) Backend Setup (`backend`)

### 3.1 Create and activate virtual environment

Windows PowerShell:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
```

### 3.2 Install dependencies

```powershell
pip install --upgrade pip
pip install -r requirements.txt
pip install python-multipart
```

### 3.3 Create backend environment file

Create `backend/.env` with the required keys:

```env
OPENAI_API_KEY="..."
PINECONE_API_KEY="..."
```

Do not commit this file. Request these secrets from the project owner/devops team.

### 3.4 Start backend

```powershell
uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

Health check:

- [http://localhost:8000/health](http://localhost:8000/health)

Expected response:

```json
{"status":"healthy"}
```

---

## 4) Frontend Setup (`src`)

### 4.1 Install dependencies and run dev server

In a second terminal:

```powershell
cd src
npm install
npm run dev
```

### 4.2 Frontend environment for production/staging

Create `src/.env` from `src/.env.example` when needed.

Important variable:

```env
VITE_API_BASE_URL=https://your-backend-domain
```

Notes:

- Local development can use the default backend URL (`http://localhost:8000`) if `VITE_API_BASE_URL` is not set.
- For deployed frontend (HTTPS), `VITE_API_BASE_URL` must point to an HTTPS backend. HTTP API targets will be blocked by browsers (mixed-content).

---

## 5) Common Troubleshooting

### A) `Error loading ASGI app` / `Could not import module "api"`

Usually caused by one of:

- Running from the wrong folder (must run from `backend`)
- Missing Python dependencies
- Missing required environment variables

Checklist:

1. Activate `backend/venv`
2. Reinstall dependencies (`pip install -r requirements.txt`, `pip install python-multipart`)
3. Confirm `backend/.env` exists with `OPENAI_API_KEY` and `PINECONE_API_KEY`
4. Run:
   ```powershell
   python -c "import api; print('api import ok')"
   ```
   If this works, start uvicorn again.

### B) Frontend chat loads but no assistant response

Check:

- Backend is running and `/health` returns 200
- Frontend is pointing to the correct backend (`VITE_API_BASE_URL`)
- In deployed environments, API URL is HTTPS

---

## 6) Deployment Handoff Checklist

Before handing over to deployment:

- Backend secrets are provisioned securely:
  - `OPENAI_API_KEY`
  - `PINECONE_API_KEY`
- Frontend environment is set:
  - `VITE_API_BASE_URL` (HTTPS URL of backend)
- Backend service exposes `/health` and `/chat`
- CORS/network policy allows frontend origin to call backend
- No secrets are committed in Git history or tracked files

---

## 7) Quick Start Summary

Terminal 1 (backend):

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
pip install python-multipart
uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

Terminal 2 (frontend):

```powershell
cd src
npm install
npm run dev
```
