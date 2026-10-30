# Tripora — Your Intelligent Travel Companion

> **A Next-Generation Travel-Tech Platform & Personalized Itinerary Planner**  
> *Second Independent Product Edition — Exploratory, Energetic, Intelligent, Contemporary, and Premium.*

---

## 1. Product Vision & Distinction

**Tripora** is a complete, full-stack travel planning and discovery SaaS web application built with an editorial travel magazine aesthetic, modern travel-tech architecture, and an intelligent personal concierge.

### Key Distinct Architectural Choices:
- **Navigation Architecture**: Full-width **horizontal top navigation bar** with active route indicators and user profile actions on desktop, plus an accessible **bottom navigation bar** on mobile. No permanent left sidebar.
- **Visual Identity**:
  - **Primary**: Cobalt Blue (`#2864D8`)
  - **Secondary / Accents**: Vivid Coral (`#FF786B`)
  - **Canvas Background**: Warm White (`#FAFAF7`)
  - **Delicate Accents**: Soft Lavender (`#E9E5FF`)
  - **Surfaces**: Pale Blue (`#F0F5FF`) & Crisp Card Surfaces (`#FFFFFF`)
  - **Typography**: Geometric Sans-Serif (*Plus Jakarta Sans*) for high-density UI + Editorial Display Serif (*Playfair Display*) for headlines.
- **Asymmetrical Editorial Layouts**: Rounded photography containers, generous white space, magazine destination grids, and zero generic template cards.

---

## 2. Nine Complete Application Screens

| Screen | Route | Key Capabilities & Features |
|---|---|---|
| **1. Landing Page** | `/` | Editorial travel hero ("Explore more. Plan smarter. Travel better."), destination quick-search bar, Plan Your Journey CTA, asymmetric featured destinations grid, How It Works timeline, sample itinerary preview, and magazine footer. |
| **2. Explore Destinations** | `/explore` | Multi-category filters (Trending, Cultural, Romantic, Adventure, Weekend, Budget-Friendly), live search by city/country/region, budget ranges, optimal travel seasons, and interactive **Destination Detail Modal** with attractions, signature activities, and insider travel tips. |
| **3. Personal Dashboard** | `/dashboard` | Discovery-first dashboard with welcome greeting, **Next Adventure Spotlight Card** (countdown, route preview, budget gauge), 4 travel statistics widgets (Trips planned, Destinations explored, Total budget, Completed journeys), and saved destinations quick access. |
| **4. Trip Studio** | `/studio` | **Guided 6-Step Trip Creation Wizard**: Step 1 (Destination & calendar dates), Step 2 (Travelers count & classification), Step 3 (Travel personalities: Adventure, Cultural, Romantic, Food, etc.), Step 4 (Pace & Interests), Step 5 (Target budget, currency, lodging tier), Step 6 (Review & live synthesis trigger with confetti). |
| **5. My Journeys** | `/trips` | Trip management dashboard with tabbed views (*All Journeys*, *Upcoming*, *Drafts*, *Completed*), live search filter, date & budget sorting, cover photography, traveler badges, and actions to **Open Workspace**, **Duplicate**, **Delete**, or open **Budget Studio**. |
| **6. Smart Itinerary Workspace** | `/itinerary/:id` | Split workspace layout: **Left column** contains the chronological activity timeline (time, duration, category badges, location, transport mode, edit/delete/reorder up & down); **Right column** features an **Interactive Leaflet/OpenStreetMap** with numbered cobalt pins, route polyline, and popups. Includes single-day regeneration and full trip regeneration. |
| **7. Budget Studio** | `/budget/:id` | Dedicated financial analytics suite: Total budget ceiling, calculated estimated spending, remaining headroom, per-person expense, daily expenditure burn rate, **Recharts Donut Chart** breakdown (lodging, dining, activities, transport, shopping, misc), and an **interactive itemized expense tracker** to add/remove custom line items. |
| **8. AI Travel Assistant** | `/assistant` | Conversational travel assistant powered by Google Gemini intelligence with fallback to deterministic mock logic. Features quick prompt suggestion chips, active trip context selector, conversation history, and **one-click actionable recommendations** that update itinerary activities on confirmation. |
| **9. User Profile & Settings** | `/profile` | Profile photo avatar, personal information, travel style preferences, default currency selector, preferred language, dietary requirements, accessibility needs, saved destinations manager, and demo session reset. |

---

## 3. Technology Stack

### Frontend:
- **React 18** with **TypeScript**
- **Vite 6** (lightning-fast HMR and optimized production bundle)
- **Tailwind CSS 3** with bespoke Tripora color palette & font tokens
- **React Router 6** for declarative client-side routing
- **Lucide React** for modern, crisp travel iconography
- **Leaflet & OpenStreetMap** for interactive spatial routing and pins
- **Recharts** for responsive SVG budget charts
- **Canvas Confetti** for delightful celebration micro-interactions

### Backend:
- **Python 3.14**
- **FastAPI** with auto-generated OpenAPI / Swagger docs at `/docs`
- **Pydantic v2** for strict request/response data validation
- **HTTPX** for asynchronous API integration
- **Pytest** with 12 automated unit and integration tests
- **Uvicorn** ASGI server

### Database & Security:
- **Supabase PostgreSQL Schema** with full SQL migration in `backend/migrations/001_initial_schema.sql`
- **Row Level Security (RLS)** policies ensuring user data isolation
- **Zero-Friction In-Memory & Local SQLite Fallback** so the platform runs instantly out-of-the-box without requiring live credentials

---

## 4. Getting Started

### Prerequisites:
- **Node.js** (v18+)
- **Python** (v3.10+)

### 1. Run the Backend API:
```bash
cd tripora/backend

# Activate the virtual environment:
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1

# Install requirements (already pre-installed):
pip install -r requirements.txt

# Run backend test suite:
pytest

# Start the FastAPI server on port 8000:
uvicorn app.main:app --reload --port 8000
```
FastAPI documentation will be available at: `http://127.0.0.1:8000/docs`

### 2. Run the Frontend Web Application:
```bash
cd tripora/frontend

# Install dependencies (already pre-installed):
npm install --legacy-peer-deps

# Build production bundle:
npm run build

# Start the Vite development server on port 5173:
npm run dev
```
Open your browser at: `http://localhost:5173`

---

## 5. Configuration & Environment Variables

Create a `.env` file in `tripora/backend/.env` (optional):
```env
# Tripora Configuration
ENVIRONMENT=development
MOCK_MODE=true

# Google Gemini API Key (Optional — platform falls back to intelligent mock AI when omitted)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# Supabase PostgreSQL Configuration (Optional)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 6. Verification & Automated Testing

Backend unit and integration tests cover:
- Health check and API status (`/api/health`)
- Trip CRUD operations, duplication, statistics summary
- Multi-day and single-day itinerary generation
- Activity addition, deletion, and chronological reordering
- Accurate server-side budget, per-person, and category spending calculation
- Conversational AI assistant responses and actionable itinerary mutations

Run tests:
```bash
cd tripora/backend
.\venv\Scripts\pytest
# Output: 12 passed in ~0.99s
```

Frontend production build test:
```bash
cd tripora/frontend
npm run build
# Output: ✓ built in ~23s with 0 errors
```

---

## 7. Supabase Database Migration

The complete Supabase migration script is located at:
`tripora/backend/migrations/001_initial_schema.sql`

It provisions:
- `profiles`
- `trips`
- `itinerary_days`
- `activities`
- `saved_destinations`
- `travel_preferences`
- `ai_conversations`

With indexes on foreign keys and user IDs, check constraints, and Row Level Security (RLS) policies for secure user isolation (`auth.uid() = user_id`).

