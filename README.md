# 🏛️ Smart Garbage Management System
### Swachh Civic Waste Monitoring & On-Demand Dispatch Portal

[![CI](https://github.com/ayushydv071/Smart-Garbage-Management/actions/workflows/ci.yml/badge.svg)](https://github.com/ayushydv071/Smart-Garbage-Management/actions/workflows/ci.yml)
![Node Version](https://img.shields.io/badge/node-v20%2B-blue)
![React](https://img.shields.io/badge/frontend-React%20%2B%20Vite-coral)
![Database](https://img.shields.io/badge/database-MongoDB%20Atlas-green)
![Docker](https://img.shields.io/badge/docker-containerized-2496ED)
![License](https://img.shields.io/badge/license-ISC-lightgrey)

---

## 📌 1. Overview & Purpose

The **Smart Garbage Management System** is a civic-tech web platform connecting **citizens**, **municipal sanitation drivers/crews**, and **city administrators** to make urban waste collection transparent, reliable, and trackable.

Built with a **government portal design philosophy** (*clarity over decoration*), it prioritizes high legibility, standardized color hierarchy, accessibility, and functional feedback.

```
┌─────────────────────────────────────────────────────────────┐
│               Smart Garbage Management Portal               │
├─────────────────┬───────────────────────┬───────────────────┤
│  👤 CITIZEN     │  🚛 SANITATION STAFF  │  🏛️ MUNICIPAL ADM  │
│  • Live Routes  │  • Daily Checklist    │  • Command Center │
│  • File Issue   │  • Mark Complete/Skip │  • KPI Metrics    │
│  • Book Pickup  │  • Shift Progress     │  • Staff Dispatch │
└─────────────────┴───────────────────────┴───────────────────┘
```

---

## ✨ 2. Key Features by Persona

### 👤 Citizen Portal
- **Interactive Collection Route Map:** Full-width map powered by Leaflet & OpenStreetMap showing scheduled collection routes, completed stops, pending stops, and registered citizen address pins.
- **Restrained Live Fleet Tracker:** Real-time collection truck marker (`DL-04-E-1029`) with a non-intrusive pulsing ring animation, ETA estimates, and driver information popups.
- **Issue & Complaint Reporting:** Lodge grievances (overflowing bin, missed pickup, illegal dumping) with photo evidence upload and live status tracking (`submitted → in-progress → resolved`).
- **On-Demand Special/Bulk Pickup:** Multi-step wizard to book special collection (bulk furniture, construction rubble, e-waste, garden trimmings) with automated fee calculations and Razorpay payment simulation.
- **Fair Cancellation Policy:** Full 100% refund support for bookings cancelled >24 hours prior to scheduled dispatch.

### 🚛 Sanitation Crew & Driver View
- **Mobile-First Shift Checklist:** Built specifically for drivers and field sanitation crews on smartphones.
- **Stop Verification:** Clear address and location checklist with one-tap "Mark Complete" or "Skip" (with mandatory audit reason).
- **Shift Progress Bar:** Real-time visual tracking of completed stops vs. total scheduled stops for the shift.

### 🏛️ Municipal Administration Center
- **Executive KPI Cards:** Real-time metrics for total complaints, resolution rate (%), special pickup revenue, and route completion percentages.
- **Searchable & Filterable Workflows:** Instant filtering by status (`submitted`, `in-progress`, `resolved`) and full-text search.
- **Staff Dispatching:** Dynamic assignment of complaint tickets to available drivers and compaction vehicles.
- **Table Polish & Pagination:** Paginated tables with row hover interactions and accessible status pills paired with functional icons.

### 🛠️ Evaluator Demo Toolbar
- **Jury / Reviewer Switcher:** Collapsible bottom-pinned toolbar that allows immediate one-click switching between **Citizen (Ayush)**, **Staff (Ramesh)**, and **Admin (Dr. Sunita)** personas without requiring separate credential logins.

---

## 🎨 3. Design System & Accessibility

The UI strictly adheres to the civic design principles documented in [`design.md`](./design.md):

| Color | Hex | Role & Usage |
|---|---|---|
| **Cream** | `#F5EBDD` | Primary background surface (warm, paper-like feel) |
| **Coral** | `#F2765E` | Primary action color (buttons, important highlights) |
| **Blue** | `#315B8C` | Informational color (headers, route lines, links, success) |
| **Dark Brown** | `#413333` | Primary text and low-opacity borders |

- **Accessibility-First Status Pills:** Status is never communicated by color alone. Every pill pairs functional icons (Checkmark for Resolved, Spinner for In-Progress, Clock for Pending, Alert for Skipped) with clear text labels.
- **Micro-Interactions & Feedback:** Flat toast notifications (no heavy shadows/gradients) and inline button spinners to confirm actions and prevent duplicate submissions.

---

## 🏗️ 4. Tech Stack & Architecture

```
                    ┌─────────────────────────┐
                    │      React + Vite       │
                    │ (Leaflet, Lucide, CSS)  │
                    └───────────┬─────────────┘
                                │ REST / JSON
                                ▼
                    ┌─────────────────────────┐
                    │   Node.js + Express     │
                    │  (JWT Auth, Multer)     │
                    └───────────┬─────────────┘
                                │ Mongoose
                                ▼
                    ┌─────────────────────────┐
                    │  MongoDB Atlas Cluster  │
                    │ (Users, Routes, Orders) │
                    └─────────────────────────┘
```

- **Frontend:** React 18, Vite, React Router v6, React-Leaflet, Leaflet, Lucide React, IBM Plex Sans.
- **Backend:** Node.js 20, Express, Mongoose ODM, JSON Web Tokens (JWT), bcryptjs, Multer.
- **Database:** MongoDB Atlas (Cloud Replica Set).
- **Containerization & CI/CD:** Docker (`node:20-alpine`), GitHub Actions CI pipeline.
- **Hosting / Deployment:** Vercel (Frontend rewrites) / Render (Backend Web Service).

---

## 📁 5. Directory Structure

```text
Smart-Garbage-Management/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI workflow
├── backend/
│   ├── controllers/             # Express route controllers
│   ├── middleware/              # Auth guards, role verification, multer upload
│   ├── models/                  # Mongoose models (User, Zone, Route, Complaint, Pickup)
│   ├── routes/                  # Express API routes
│   ├── utils/                   # Pricing logic & error handlers
│   ├── .dockerignore            # Docker ignore file
│   ├── .env.example             # Backend environment template
│   ├── Dockerfile               # Production multi-step Dockerfile
│   ├── package.json
│   ├── seed.js                  # Database seed script for Admin/Staff
│   └── server.js                # Express app entry & /health endpoint
├── frontend/
│   ├── public/                  # Public assets
│   ├── src/
│   │   ├── components/          # Navbar, LeafletMap, StatusBadge, Toast, DemoToolbar
│   │   ├── context/             # AppContext (State, micro-interactions, toasts)
│   │   ├── data/                # Mock data fixtures
│   │   ├── pages/               # Dashboard, ComplaintForm, PickupRequest, Admin, Staff
│   │   ├── App.jsx              # Main router & shell layout
│   │   ├── index.css            # Civic design system styles
│   │   └── main.jsx
│   ├── package.json
│   ├── vercel.json              # SPA client rewrite rules
│   └── vite.config.js
├── design.md                    # UI/UX design specifications (v1.1)
├── prd.md                       # Product Requirements Document
├── trd.md                       # Technical Requirements Document
└── README.md
```

---

## 🚀 6. Getting Started & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) *(optional, for containerization)*
- MongoDB Atlas database connection string *(or local MongoDB instance)*

---

### Step 1: Clone Repository
```bash
git clone https://github.com/ayushydv071/Smart-Garbage-Management.git
cd Smart-Garbage-Management
```

---

### Step 2: Backend Setup
1. Navigate into the backend directory:
   ```bash
   cd backend
   npm install
   ```

2. Create `.env` from template:
   ```bash
   cp .env.example .env
   ```
   Configure your environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_token
   ADMIN_EMAIL=admin@garbage.com
   ADMIN_PASSWORD=Admin@12345
   STAFF_EMAIL=staff@garbage.com
   STAFF_PASSWORD=Staff@12345
   ```

3. Seed initial municipal database records (Admin & Staff accounts):
   ```bash
   npm run seed
   ```

4. Start backend server:
   ```bash
   npm run dev
   # Server runs on http://localhost:5000
   ```

5. Verify server health:
   ```bash
   curl http://localhost:5000/health
   # Returns: {"status":"ok","db":"connected","uptime":...}
   ```

---

### Step 3: Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   # App runs on http://localhost:5173
   ```

3. Build for production:
   ```bash
   npm run build
   ```

---

### Step 4: Run with Docker
You can build and package the backend into a lightweight Docker image:
```bash
docker build -t garbage-backend ./backend
docker run -p 5000:5000 --env-file ./backend/.env garbage-backend
```

---

## 📡 7. API Endpoints Reference

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/health` | Server uptime & DB connection monitor | Public |
| `POST` | `/auth/signup` | Citizen registration | Public |
| `POST` | `/auth/login` | Email/password login returning JWT | Public |
| `GET` | `/zones` | List all municipal collection zones | Authenticated |
| `GET` | `/routes` | Get route templates | Authenticated |
| `GET` | `/daily-routes` | Active daily driver check-in logs | Staff / Admin |
| `POST` | `/complaints` | File grievance with photo upload | Citizen |
| `PATCH` | `/complaints/:id` | Update complaint status & staff dispatch | Admin |
| `POST` | `/pickups` | Create bulk pickup booking | Citizen |
| `POST` | `/pickups/:id/cancel`| Cancel pickup & initiate refund | Citizen |

---

## 🔄 8. CI/CD Automation

This repository includes a pre-configured [GitHub Actions CI Pipeline](.github/workflows/ci.yml) that executes on every push and pull request to the `main` branch:
- **Backend Job:** Syntax verification across all Node.js files, dependency validation with `npm ci`, and automated Docker container build (`garbage-backend`).
- **Frontend Job:** Vite production asset compilation and bundle verification.

---

## 📜 9. License

This project is licensed under the [ISC License](LICENSE).
Developed for municipal waste tracking and modern civic governance.
