# Product Requirements Document (PRD)
## Smart Garbage Management System

**Author:** Ayush
**Version:** 1.0
**Status:** Draft
**Last Updated:** September 24, 2026

---

## 1. Overview

### 1.1 Purpose
A civic-tech web platform connecting citizens, waste collection staff/drivers, and municipal admins to make garbage collection trackable, reportable, and partially on-demand — replacing the current "hope the truck shows up" model with a system that supports issue reporting, route visibility, and paid special pickups.

### 1.2 Problem Statement
Citizens currently have no structured way to know when collection will happen, report missed pickups or illegal dumping, or request special/bulk waste pickup outside the regular schedule. This leads to overflowing bins, unresolved complaints, and no clear process for one-off pickup needs.

### 1.3 Goals
- Give citizens visibility into their collection schedule and route status.
- Let citizens report issues (overflow, missed pickup, illegal dumping) with photo evidence.
- Let citizens request and pay for special/bulk pickups outside the regular schedule.
- Give collection staff a clear daily route and request list.
- Give admins a dashboard to manage complaints, pickups, and zones.
- Automate notifications for reminders, confirmations, and status updates.

### 1.4 Non-Goals (Out of Scope for v1)
- Real GPS hardware / live device tracking (route progress is driver-reported via manual check-ins, not live location).
- Route optimization algorithms (routes are admin-defined and static).
- Recurring/subscription billing (only one-time payments for special pickups).
- In-app chat/messaging between users.
- Native mobile apps (web-responsive only).
- Formal dispute resolution / support ticketing system.

---

## 2. Target Users

| User Type | Description | Key Needs |
|---|---|---|
| **Citizen** | Resident reporting issues or requesting pickups | Easy reporting, visibility into schedule/route, reliable paid pickup, status updates |
| **Staff/Driver** | Collection worker assigned to a route | Clear daily stop list, ability to mark stops complete, visibility into special pickup assignments |
| **Admin** | Municipal operator managing the system | Manage zones/routes, assign complaints and pickups, monitor status, basic analytics |

---

## 3. User Stories

### Citizen
- As a citizen, I can view my zone's collection schedule and route on a map.
- As a citizen, I can report an issue (overflow/missed pickup/illegal dumping) with a photo and location.
- As a citizen, I can track the status of my complaint (submitted → assigned → in-progress → resolved).
- As a citizen, I can request a special/bulk pickup, select a date, and pay a fee upfront.
- As a citizen, I can cancel a pickup request and receive a full refund if I cancel more than 24 hours in advance.
- As a citizen, I receive automated notifications: collection day reminders, pickup confirmations, and complaint status updates.

### Staff/Driver
- As a staff member, I can view my assigned route and list of stops for the day.
- As a staff member, I can mark a stop as completed or skipped (with a reason).
- As a staff member, I can view special pickup requests assigned to me, including location and photo.

### Admin
- As an admin, I can define zones, routes, and collection schedules.
- As an admin, I can view and assign incoming complaints to staff.
- As an admin, I can view and assign special pickup requests to staff, and track their payment status.
- As an admin, I can view basic analytics: complaint volume by zone/category, pickup revenue, route completion rate.

---

## 4. Functional Requirements

### 4.1 Authentication
- Email/password auth for all roles (citizen, staff, admin). Default public signup creates citizen accounts; staff and admin accounts are provisioned by admin or seeded.
- JWT-based session management with role-based access control on protected routes.

### 4.2 Zones, Routes & Schedules
- Admin defines zones (name, area) and a static route template (ordered list of stop coordinates) per zone.
- Each zone has an assigned collection schedule (day/time).
- Citizens select their zone during registration or update it in their profile.

### 4.3 Complaint Reporting
- Citizen submits a complaint: category, location (auto-detected or manual pin), photo (Cloudinary upload).
- Complaint status pipeline: `submitted → assigned → in-progress → resolved`.
- Admin assigns complaints to staff; staff/admin can update status.

### 4.4 Special/Bulk Pickup Requests
- Citizen selects pickup type (bulk waste, construction debris, e-waste), preferred date, location (defaults to registered address with custom override).
- System applies a fixed-tier fee based on pickup type.
- Citizen pays upfront via Razorpay (Order created on backend, completed via Razorpay Checkout); payment confirmed server-side via Razorpay webhook (`payment.captured` event with HMAC signature verification), never via frontend callback alone.
- On payment confirmation, request is created and queued for admin assignment to staff.
- Cancellation: full refund (Razorpay Refunds API) if canceled more than 24 hours before the scheduled pickup; no refund inside that window.

### 4.5 Route & Map Visibility
- Citizens see their zone's route displayed on a map with stop markers.
- Progress shown as "stop X of Y completed," based on daily staff check-ins — not live GPS.

### 4.6 Staff Operations
- Staff view their assigned daily route stops for the day and mark each as completed or skipped (with reason).
- Staff view special pickup requests assigned to them.

### 4.7 Admin Dashboard
- View/manage all zones, routes, and schedules.
- View/manage complaints (assign, update status).
- View/manage special pickup requests (assign, track payment status).
- Basic analytics: complaints by zone/category, pickup revenue, route completion rate.

### 4.8 Automation (Zapier)
- **Pickup confirmed** → confirmation email/notification to citizen (Zapier Catch Hook).
- **Collection day** → morning reminder sent to citizens in that zone (scheduled trigger or cron dispatch).
- **Complaint status change** → notification when moved to in-progress or resolved.
- **Special pickup completed** → completion notification to citizen.

---

## 5. Non-Functional Requirements

- **Security:** Razorpay webhook signature verification (crypto HMAC); secrets/environment variables never committed to source; passwords hashed (bcrypt); JWT-protected routes.
- **Reliability:** Payment and booking state changes only occur via verified webhook events, not client-side signals.
- **Data integrity:** MongoDB transactions (via replica set) used where payment and request-creation state must update atomically.
- **Scalability:** Not a primary concern for v1 (academic project scope); queries indexed on zone/status fields to avoid obvious slowdowns.
- **Availability:** Deployed on Render with no formal SLA — basic uptime expectation only.

---

## 6. Technical Architecture

| Layer | Technology |
|---|---|
| Frontend | React + React Router, React-Leaflet (maps) |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose (Atlas replica set for transactions) |
| Auth | JWT + bcrypt |
| Payments | Razorpay (Orders, Webhooks, Refunds API, Checkout.js, ngrok for local testing) |
| Media Storage | Cloudinary |
| Maps/Routing | Leaflet + OpenStreetMap |
| Automation | Zapier (Catch Hook + Schedule triggers) |
| Containerization | Docker + docker-compose (Frontend & Backend containers) |
| CI/CD | GitHub Actions |
| Hosting | Render (backend + frontend), MongoDB Atlas (database) |

### 6.1 Core Data Model (MongoDB Collections)
- **Users** — name, email, passwordHash, role (citizen / staff / admin), zoneId, address
- **Zones** — name, area, assigned route, schedule
- **Routes** — template of ordered stop coordinates per zone
- **DailyRoutes** — date, zoneId, assignedDriverId, stops: `[{ stopId, address, coordinates, status: 'pending'|'completed'|'skipped', skipReason, completedAt }]`, status
- **Complaints** — citizenId, zoneId, category, description, photoUrl, location, status
- **PickupRequests** — citizenId, type, location, scheduledDate, fee, paymentStatus, assignedStaffId, status
- **Payments** — razorpayOrderId, razorpayPaymentId, amount, status, pickupRequestId, createdAt

### 6.2 High-Level Flow
1. Citizen views zone route/schedule on map.
2. Citizen submits a complaint (with photo) or a special pickup request (with payment).
3. For pickups: payment confirmed via Razorpay webhook → request queued for assignment.
4. Admin assigns complaint/pickup to staff.
5. Staff completes stops/requests, marking status as they go.
6. Zapier sends automated notifications at each key event (confirmation, reminder, status change, completion).
7. If a pickup is canceled: refund evaluated by time-to-slot → Razorpay refund issued if eligible.

---

## 7. Success Metrics (for project evaluation / demo purposes)

- End-to-end complaint flow works without manual intervention (report → assign → resolve → notify).
- End-to-end pickup flow works without manual intervention (request → pay → webhook confirms → assign → complete → notify).
- Refund policy correctly enforced based on cancellation timing.
- CI/CD pipeline successfully builds and deploys on push to `main`.
- App runs locally via a single `docker-compose up` command (frontend + backend connected to MongoDB Atlas).

---

## 8. Milestones / Build Order

1. Auth + role-based access (citizen registration; staff/admin provisioning)
2. Zone/route data model + DailyRoute operational model + admin route management
3. Complaint reporting flow + Cloudinary upload
4. Map display of zones/routes (Leaflet)
5. Special pickup request + Razorpay Orders + Checkout.js + webhook handling + refund logic
6. Staff view — daily route checklist + assigned pickup requests
7. Admin dashboard — complaint & pickup management + basic analytics KPI cards
8. Zapier automation — reminders, confirmations, status updates
9. Dockerize (frontend and backend containers; connecting to MongoDB Atlas)
10. GitHub Actions CI/CD pipeline
11. Deploy — MongoDB Atlas + Render

---

## 9. Design Decisions (Resolved Open Questions)
- **Staff check-ins:** Manual check-in button ("Mark Complete" and "Skip with Reason") is sufficient for v1. No live GPS hardware or geofencing required.
- **Analytics dashboard:** Summary KPI stat cards and structured data tables (total complaints, pending vs resolved, pickup revenue, stops completed) to align with the minimalist government portal aesthetic without heavy charting bloat.
- **Pickup location flexibility:** Citizens can request pickups for custom addresses, defaulting to their registered home address.