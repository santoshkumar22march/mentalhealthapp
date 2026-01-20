# Nila.ai (mentalhealthapp)

A cross-platform mental health React Native app (Expo) with a small Python backend. The app offers chat, journaling, calming exercises, and crisis detection features. This repository contains the mobile app frontend, a lightweight backend, and integration code for Supabase and other services.

## Table of contents

- [Project structure](#project-structure)
- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup — Frontend (Expo)](#setup---frontend-expo)
- [Setup — Backend (FastAPI)](#setup---backend-fastapi)
- [Environment variables](#environment-variables)
- [Development workflow](#development-workflow)
- [Testing](#testing)
- [Contributing](#contributing)
- [Files of interest](#files-of-interest)
- [License & contact](#license--contact)

## Project structure

Top-level layout (abridged):

- `app/` — Expo/React Native app with routing and screens
- `components/` — UI components (CrisisModal, Nebula, etc.)
- `context/` — React contexts (AuthContext)
- `services/` — API wrappers and services (supabase, auth, chatService)
- `lib/` — client initialization (e.g. `supabase.ts`)
- `backend/` — Python FastAPI backend (`main.py`, `requirements.txt`)
- `assets/` — static assets
- `utils/` — utility functions (e.g. `crisisDetection.ts`)

## Tech stack

- Frontend: React Native (via Expo), TypeScript, NativeWind (Tailwind for RN)
- Backend: FastAPI + Uvicorn (Python)
- Database / Auth: Supabase (client present under `lib/`)

## Prerequisites

- Node.js (recommended latest LTS)
- npm or yarn
- Expo CLI (optional — the repo uses `expo start` scripts)
- Python 3.11+ (or compatible with listed requirements)
- pip (for backend package installation)

## Setup — Frontend (Expo)

Install dependencies and start the app:

```bash
# from repo root
npm install
# start expo development server
npm run start
# or run on a device / emulator
npm run android
npm run ios
npm run web
```

Notes:
- The `package.json` includes the standard Expo scripts: `start`, `android`, `ios`, `web`.
- If you prefer yarn:

```bash
yarn
yarn start
```

## Setup — Backend (FastAPI)

The backend lives under `backend/` and uses FastAPI + Uvicorn. Install Python dependencies and run the server:

```bash
# create a venv (recommended)
python -m venv .venv
# activate the venv
# macOS / zsh
source .venv/bin/activate
# install requirements
pip install -r backend/requirements.txt
# run the backend
uvicorn backend.main:app --reload --port 8000
```

The `backend/requirements.txt` includes (example):
- fastapi
- uvicorn
- supabase
- google-generativeai
- python-dotenv

Adjust the `uvicorn` command if your `main.py` exposes the FastAPI `app` under a different import path.

## Environment variables

The project uses environment variables for Supabase and other secrets. Common locations:

- Frontend: check `lib/supabase.ts` and `services/` for the expected env names (Expo typically uses `app.json` or runtime config and `process.env`-style variables configured for EAS/Expo). For local dev you may use `.env` or an `app.json` config depending on how you run Expo.

- Backend: `backend/main.py` likely reads `.env` via `python-dotenv`. Create `backend/.env` with keys such as:

```
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
OPENAI_API_KEY=...
OTHER_KEYS=...
```

Do not check secrets into git. Add `.env` to `.gitignore`.

## Development workflow

- Frontend live reload is provided by Expo. Edit files under `app/`, `components/`, or `context/` and the app will refresh.
- Backend: run Uvicorn with `--reload` for autoreload on code change.
- When adding new native modules or doing deeper native development, follow Expo docs for managed vs bare workflows.

## Testing

There are no explicit unit tests in the repo by default. Recommended quick checks:

- Run the Expo app in simulator or on device and test flows: login, chat, journal, crisis detection.
- Manually test backend endpoints using curl or HTTP client (Postman / HTTPie):

```bash
curl http://localhost:8000/health
```

Consider adding Jest + React Native Testing Library for automated frontend tests and pytest for backend tests.

## Contributing

- Fork, create a branch with a short descriptive name, make changes, add tests, and open a PR.
- Keep changes small and focused. Add a short description of the change and any required environment setup in the PR.

## Files of interest

- `app/_layout.tsx` — app routing/layout for the React Native app
- `app/(tabs)/` — main tab screens: `chat.tsx`, `calm.tsx`, `journal.tsx`, `index.tsx`
- `services/chatService.ts` — chat-related logic and LLM integration
- `lib/supabase.ts` — Supabase client setup
- `backend/main.py` — backend entrypoint
- `backend/requirements.txt` — backend Python dependencies


