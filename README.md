# Tripora — Your Intelligent Travel Companion

> **A Next-Generation Travel-Tech Platform & Personalized Itinerary Planner**  
> *Second Independent Product Edition — Exploratory, Energetic, Intelligent, Contemporary, and Premium.*

This workspace contains **Tripora**, located in the `tripora/` directory:
- `tripora/backend/`: Python FastAPI backend with Pydantic, Uvicorn, Pytest, Gemini AI service & Supabase RLS migrations.
- `tripora/frontend/`: React 18, Vite, TypeScript, Tailwind CSS, Leaflet & Recharts web application.

Refer to [`tripora/README.md`](./tripora/README.md) for full architecture details, feature tour, and setup instructions.

## Quick Start

### 1. Start Backend:
```powershell
cd tripora\backend
.\venv\Scripts\uvicorn app.main:app --port 8000
```

### 2. Start Frontend:
```powershell
cd tripora\frontend
npm run dev
```
Access the application at `http://localhost:5173`.

