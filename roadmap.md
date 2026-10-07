# Project Roadmap — Smart Garbage Management System
## Weekly Task Breakdown (Target: Complete Within 4 Weeks)

**Order of work:** Dashboard (UI) → Backend → Payment Gateway → Automation

This roadmap assumes part-time, non-continuous work — each week is scoped so it can be picked up and finished over a few sessions rather than requiring daily work, but the whole project should be demoable well before the 4-week mark if you stay on pace.

---

## Week 1: Dashboard (Frontend UI, no backend yet)

**Goal:** All main screens exist and look right, using the design document's color system and layout, working off dummy/static data — no real API calls yet.

### Tasks
- [ ] Set up React project with Vite (`npm create vite@latest`) and React Router
- [ ] Apply the color palette and typography as global CSS/theme variables
- [ ] Build the Login/Signup page UI (public signup defaults to citizen)
- [ ] Build the Citizen Dashboard UI (static "Next Collection" info, dummy recent reports list)
- [ ] Build the Complaint Form UI (category dropdown, photo upload area, description field — no upload logic yet)
- [ ] Build the Pickup Request UI (pickup type, date picker, fee display — no payment yet)
- [ ] Build the Staff Route View UI (static checklist with dummy stops)
- [ ] Build the Admin Dashboard UI (static tables for complaints/pickups and basic KPI summary cards)
- [ ] Build shared components: buttons, input fields, status badges, navbar (per the design doc's component style guide)
- [ ] Set up Leaflet map container on Citizen Dashboard with explicit CSS height (e.g., 400px)

**End of Week 1 checkpoint:** you can click through every screen in the app and it looks finished, even though nothing is connected to real data yet.

---

## Week 2: Backend

**Goal:** Real data flowing — auth works, and every dashboard screen shows actual data from MongoDB instead of dummy content.

### Tasks
- [ ] Set up Express server + connect to MongoDB Atlas (replica set enabled for transactions)
- [ ] Build User model (`name`, `email`, `passwordHash`, `role`, `zoneId`, `address`) + signup/login endpoints (bcrypt + JWT)
- [ ] Create seed script (`npm run seed`) to provision initial Admin and Staff accounts
- [ ] Build auth middleware + role-based route protection (citizen/staff/admin)
- [ ] Build Zone, Route (static template), and DailyRoute (daily driver tracking) models + admin endpoints
- [ ] Build Complaint model + CRUD endpoints
- [ ] Connect Cloudinary upload to the Complaint Form (photo actually uploads and saves a URL)
- [ ] Build PickupRequest model + basic create/list endpoints (no payment logic yet — just create the record)
- [ ] Wire the Week 1 frontend screens to these real endpoints (replace dummy data with real fetch calls)
- [ ] Add the Leaflet map to the Citizen Dashboard, rendering real zone/route stop coordinates

**End of Week 2 checkpoint:** you can sign up, log in, submit a real complaint with a photo, see it saved in MongoDB, and view it on your dashboard — full loop, no payment involved yet.

---

## Week 3: Payment Gateway (Razorpay)

**Goal:** Special pickup requests can actually be paid for, confirmed via webhook, and refunded on cancellation.

### Tasks
- [ ] Set up a Razorpay test/sandbox account and get API keys
- [ ] Create Razorpay Order on the backend when a citizen submits a pickup request
- [ ] Integrate Razorpay Checkout.js on the frontend Pickup Request flow
- [ ] Set up `ngrok` (e.g. `npx ngrok http 5000`) to expose Express locally for Razorpay webhook testing
- [ ] Build the webhook endpoint with HMAC signature verification (`payment.captured`) to atomically update `paymentStatus` in MongoDB
- [ ] Test the whole payment flow end-to-end in sandbox mode (use Razorpay's test cards)
- [ ] Build the cancellation flow + refund logic (>24h = full refund via Razorpay Refunds API)
- [ ] Update the Pickup Request UI to show real payment/booking status and a cancel button

**End of Week 3 checkpoint:** a citizen can request a pickup, pay in test mode, see the booking confirm only after the webhook fires, and successfully cancel/get refunded if done in time.

---

## Week 4: Automation + Staff/Admin Wiring + Deployment

**Goal:** Notifications work automatically, staff/admin views are fully functional, and the whole app is containerized and live.

### Tasks
- [ ] Set up Zapier: Catch Hook trigger for pickup confirmation → email notification
- [ ] Set up Zapier / Scheduler: Daily collection reminder notifications
- [ ] Set up Zapier: complaint status-change notification
- [ ] Wire the Staff Route View to real DailyRoute data (assigned stops, mark complete/skip with reason)
- [ ] Wire the Admin Dashboard to real data (assign complaints/pickups, view status, KPI analytics summary)
- [ ] Write Dockerfiles for frontend (Vite/Nginx) and backend (Node)
- [ ] Write `docker-compose.yml` (2 services: frontend + backend, connecting to MongoDB Atlas) and test `docker-compose up`
- [ ] Set up GitHub Actions workflow (install → lint/test → build)
- [ ] Deploy backend + frontend to Render, connect MongoDB Atlas, set all environment variables/secrets
- [ ] Final end-to-end test on the live deployed URL

**End of Week 4 checkpoint:** the full app — citizen, staff, and admin flows, payments, and automated notifications — runs both locally via Docker and live on Render.

---

## If you fall behind schedule
Since this is part-time work, some weeks may slip. If that happens, protect this priority order rather than rushing everything evenly:
1. **Backend + payment flow working correctly** (Weeks 2-3) — this is the technical core and what most evaluation will focus on.
2. **Dockerization + deployment** (Week 4's infra tasks) — this is the actual "DevOps" part of a DevOps project; don't skip it to add more app features.
3. **Automation notifications** (Week 4's Zapier tasks) — nice to have, but the least critical if time runs short; the app is still fully demoable without it.
4. **Admin analytics** — the first thing to cut entirely if you're short on time.

## Quick reference: what's due each week
| Week | Focus | Key Deliverable |
|---|---|---|
| 1 | Dashboard (UI only) | Every screen clickable with dummy data |
| 2 | Backend | Real auth, complaints, and data flowing end-to-end |
| 3 | Payment Gateway | Working Razorpay payment + refund flow |
| 4 | Automation + Deployment | Zapier notifications, Docker, CI/CD, live on Render |