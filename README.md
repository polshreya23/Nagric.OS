# Nagrik.OS: Autonomous Civic Action & Orchestration Grid

**Nagrik.OS** is a next-generation civic platform engineered for national-scale digital governance. Unlike traditional, reactive portals that rely on search bars and forms, Nagrik.OS uses **multimodal AI agents** and **geospatial intelligence** to orchestrate government schemes proactively and heal urban infrastructure automatically.

---

## 🚀 Hackathon Core Pitch (The 10/10 Wow Factor)
*   **The Problem**: Portals like UMANG and MyGov require high digital literacy, forcing citizens to research complex legal requirements, fill out hundreds of input fields, and manage applications across separate departments.
*   **The Solution**: Nagrik.OS introduces **Proactive Life-Event Orchestration (PLEO)** and **Self-Healing Civic Infrastructure (SHCI)**. Citizens interact via a speech-driven AI avatar ("Jarvis") in 15+ native dialects.
*   **The Innovation**: 
    1.  **Zero-Search Scheme Recommendation**: A life-event is mapped directly to schemes. The AI matches eligibility rules, validates parameters, and pre-fills forms from a secure **DigiVault**.
    2.  **Edge-AI Grievance Deduplication**: When reporting issues via video, local spatial data is evaluated against a 15-meter buffer to identify duplicate submissions, preventing backend tickets clog.
    3.  **Vulnerability-Weighted Dispatching**: Complaint priority combines physical severity with the reporter's social vulnerability index (e.g. BPL, disability status), routing updates straight to municipal worker devices using route optimization.

---

## 🛠️ Complete Project Folder Layout

```
nagrik-os/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Database mapping (PostgreSQL + PostGIS)
│   ├── src/
│   │   ├── config/               # Gemini client & DB connectors
│   │   ├── controllers/          # Grievance, Scheme, DigiVault, Scam controllers
│   │   ├── middleware/           # File parser & authentication
│   │   ├── routes/               # API endpoint routing definition
│   │   ├── services/             # Gemini AI Service (OCR, Vision, NLP, voice processing)
│   │   ├── app.ts                # Express application setup
│   │   └── server.ts             # Bootstrapper config
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GlassCard.tsx     # Apple/Stripe-styled micro-interaction wrapper
│   │   │   ├── InteractiveMap.tsx# Incidents spatial map with route vectors
│   │   │   └── JarvisAssistant.tsx# AI voice avatar & waveform interface
│   │   ├── context/
│   │   │   └── AccessibilityContext.tsx # Drishti & Sugamya accessibility state
│   │   ├── pages/
│   │   │   ├── CitizenDashboard.tsx     # Complete Citizen Workspace
│   │   │   └── AdminDashboard.tsx       # Collector & State Admin Center
│   │   └── styles/
│   │       └── globals.css       # Core typography, glassmorphism, animations
│   ├── package.json
│   ├── postcss.config.js
│   └── tailwind.config.js
│
└── README.md                     # Pitch, schema, & execution docs
```

---

## 🧪 Database & API Grid Architecture

### Database Schema (Prisma PostgreSQL Models)
Our database utilizes **PostgreSQL** with spatial geographic data indexing to compute officer routes and avoid duplicate complaint tickets.
*   `User`: Primary user records with role mapping (Citizen, Officer, Collector, Admin).
*   `UserProfile`: Demographic metrics (annual income, BPL card status, coordinates) evaluated by the AI Scheme eligibility engine.
*   `DigiVaultDocument`: Safe storage for processed certificates, holding OCR-extracted JSON metadata.
*   `Grievance`: Spatially indexed entities holding latitude/longitude points and priority weights.
*   `ScamAlert`: SMS forwards and fake urls categorized by Gemini threat assessments.

### Backend Endpoints Table
| Endpoint | Method | Payload / Form-Data | Description |
| :--- | :--- | :--- | :--- |
| `/api/users/register` | POST | `{ phone_number, full_name, aadhaar_hash, ... }` | Registers user identity. |
| `/api/users/profile` | POST | `{ userId, annualIncome, hasBplCard, ... }` | Sets parameters for scheme eligibility evaluation. |
| `/api/grievances` | POST | Multipart (`media` file + text inputs) | Reports issue. Invokes Gemini Vision to check category, severity, fake sanity verification. Runs spatial deduplication. |
| `/api/grievances/optimize-route` | GET | `?officerId=uuid&currentLat=lat&currentLng=lng` | Calculates traveling salesperson path for field worker dispatch. |
| `/api/schemes/recommendations` | GET | `?userId=uuid` | Invokes Gemini eligibility agents. Sorts by match percentage. |
| `/api/digivault/upload` | POST | Multipart (`document` file + target language) | Runs OCR, parses values, generates plain-language jargon explanations. |
| `/api/scam-shield/evaluate` | POST | `{ content, userId }` | Runs Gemini analysis on WhatsApp forwards or URLs to flag scheme scams. |

---

## 🤖 Multimodality AI Agent Pipelines

```
[Voice/Text Ingest] ➔ [Gemini Translator] ➔ [Context Router Agent]
                                                 │
      ┌──────────────────────────────────────────┼────────────────────────────────────────┐
      ▼                                          ▼                                        ▼
[Grievance Vision Parser]              [Document OCR Agent]                    [Scam Guard Analyzer]
 - Verify physical scene image         - Extract structural attributes         - Check scam keywords
 - Classify category & severity        - Generate dialect explanations         - Verify dynamic DNS registry
 - Query 15m duplicate spatial buffer  - Update profile values                 - Output warning alerts
```

---

## 🎨 UI/UX Theme Specifications
*   **Visual Direction**: Apple geometric curves, Notion structured layouts, and Stripe glassmorphic cards.
*   **Colors**: Slate dark-background (`#0F172A`), Indigo primary lines (`#312E81`), Saffron details (`#EA580C`).
*   **Transitions**: Smooth Framer Motion triggers on hover (`scale: 1.015`, `y: -2`).
*   **Drishti Mode**: Swaps stylesheets to pure black (`#000000`) and AAA yellow (`#FFFF00`), enlarging interactive surfaces to 56px.
*   **Sugamya Mode**: Toggles visual layout cards with dynamic local dialects text-to-speech.

---

## 📊 Presentation Pitch Deck & Demo Script Outline

### Slides Structure (PPT Outline)
1.  **Title**: Nagrik.OS - The Autonomous Civic Grid (Next-gen digital public infrastructure).
2.  **The Crisis**: Legacy portals are static, complex, and exclude citizens with low literacy or disabilities.
3.  **The Innovation**: Introducing Jarvis Voice Core & spatial deduplication algorithms.
4.  **Technical Stack**: Next.js, Node/Express, PostgreSQL (PostGIS), Pinecone, and Gemini 1.5 Multi-Modal APIs.
5.  **Live Showcase Flow**: Demonstration of Voice Scheme matching and spatial complaint deduplication.
6.  **Accessibility**: Visual demonstrations of Drishti and Sugamya assistance modes.
7.  **Impact & Scaling**: Deployment roadmap to municipalities, integrating with existing systems.

### 🎭 Live 3-Minute Demo Script
*   **Minute 1: The Voice Onboarding**:
    *   *Presenter*: "Watch how easily a farmer, Ramesh, registers his query. He opens the app and double-taps to talk."
    *   *Simulated Action*: The user speaks in Hindi: *"crop ruined by rains"*.
    *   *Visual Effect*: Jarvis shows animated glowing lines, translates, and matches eligibility models instantly, displaying PM Fasal Bima pre-filled on-screen.
*   **Minute 2: Self-Healing Incident Mapping**:
    *   *Presenter*: "Now, Ramesh takes a photo of a broken sewer pipe. The AI checks if it's already reported within a 15m radius."
    *   *Simulated Action*: User submits image.
    *   *Visual Effect*: The system shows: *"Duplicate Match Found - Report Grouped"* and flags priority weights on the Collector's Command Map.
*   **Minute 3: The Command Center & Scam Shield**:
    *   *Presenter*: "On the Collector's Dashboard, we see real-time issues severity scores and optimized field worker routes. We also display scam warnings from the SMS Scam Shield."
    *   *Visual Effect*: Collector dashboard renders tables and spatial route layouts, illustrating a complete government tool.

---

## 🚀 Execution & Local Startup Guide

### Pre-requisites
- Node.js (v18+)
- PostgreSQL Database with PostGIS extension enabled

### 1. Backend Setup
```bash
cd backend
npm install
# Set your DATABASE_URL and GEMINI_API_KEY inside a .env file
# Run Prisma migrations to compile database schemas
npx prisma generate
npm run dev
```

### 2. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Open `http://localhost:3000` to interact with the mockup.

---

## ☁️ Vercel Cloud Deployment Guide

Because this repository contains a divided monorepo structure (`frontend/` and `backend/`), you should deploy them as **two separate projects** in your Vercel Dashboard.

### 1. Deploying the Backend API (`backend/`)
We have added a custom [vercel.json](file:///c:/Users/Shreya/OneDrive/Desktop/New/backend/vercel.json) router configuration inside the backend directory to run the Express server as serverless functions.
1. Click **Add New Project** in Vercel.
2. Select your repository.
3. In the configuration settings, set **Root Directory** to `backend`.
4. Set **Framework Preset** to `Other` (or `Node.js`).
5. In the **Environment Variables** section, add the following variables:
   *   `GEMINI_API_KEY`: Your Google Gemini API credentials.
   *   `DATABASE_URL`: Connection string for your managed PostgreSQL database (e.g. Supabase, Neon).
6. Click **Deploy**. Vercel will build your TypeScript routes and output your backend server to `https://your-backend-project.vercel.app`.

### 2. Deploying the Next.js Frontend (`frontend/`)
Vercel has native support for Next.js and will handle imports out-of-the-box.
1. Click **Add New Project** in Vercel.
2. Select the same repository.
3. In the configuration settings, set **Root Directory** to `frontend`.
4. Set **Framework Preset** to `Next.js`.
5. Under **Build & Development Settings**, verify the build command is `next build`.
6. Click **Deploy**. Vercel will host your dashboard app at `https://your-frontend-project.vercel.app`.

