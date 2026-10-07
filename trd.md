# Technical Requirements Document (TRD)
## Smart Garbage Management System — Tech Stack

**Author:** Ayush
**Version:** 1.0
**Status:** Draft
**Last Updated:** September 24, 2026

---

## 1. Purpose
This document defines the complete technology stack for the Smart Garbage Management System, explains why each tool was chosen, and confirms the stack stays simple enough for a solo, beginner-to-intermediate-level DevOps project — nothing here should require infrastructure knowledge beyond what's needed to demonstrate core DevOps practices (containerization, CI/CD, deployment).

---

## 2. Simplicity Check (Design Principle)

Before listing the stack, the guiding rule for every choice below is:

> **Use the tool with the least setup overhead that still teaches the real concept.**

This is why, throughout this document, the free/no-billing-account options are chosen over more "enterprise" alternatives (e.g., Leaflet over Google Maps, Zapier over building a custom notification microservice, Render over Kubernetes). Nothing in this stack requires a paid tier to build or demo end-to-end.

---

## 3. Frontend

| Tool | Purpose | Why this one (not something heavier) |
|---|---|---|
| **React + Vite** | Builds the Citizen, Staff, and Admin views | Fast build tool, lightweight dev server, standard modern React setup (`npm create vite@latest`) — avoids legacy CRA |
| **React Router** | Page navigation (login, dashboard, complaint form, etc.) | Standard, minimal-config routing — no need for a meta-framework like Next.js for this scope |
| **React-Leaflet + OpenStreetMap** | Displays zone routes and stop markers on a map | Free, no API key or billing account required (unlike Google Maps API). *Note: Map container must have explicit CSS height (e.g., 400px).* |
| **Axios or native Fetch** | Calling your backend API | Fetch is built-in and sufficient; Axios only if you want cleaner syntax — either is fine, don't overthink this choice |
| **Plain CSS or Tailwind CSS** | Styling | Simple, lightweight styling matching the government portal design guide — avoids heavy UI component libraries |

---

## 4. Backend

| Tool | Purpose | Why this one |
|---|---|---|
| **Node.js + Express** | REST API server | Minimal, well-documented, matches your existing MERN experience |
| **Mongoose** | MongoDB object modeling | Adds schema validation on top of raw MongoDB driver calls — worth the small learning curve |
| **jsonwebtoken (JWT)** | Auth tokens | Standard, stateless auth — no need for a session-store service (e.g., Redis) at this scale |
| **bcrypt** | Password hashing | Industry-standard, one function call to hash/compare |
| **dotenv** | Environment variable management locally | Keeps secrets out of code before they move to Render's environment settings |

**Simplicity note:** no GraphQL, no microservices split, no message queue (Kafka/RabbitMQ) — a single Express monolith is the right size for this project. Splitting into microservices would add real infrastructure complexity (service discovery, inter-service auth) that teaches DevOps concepts you don't need for a project this size, and would actively work against the "finish it well" goal from your PRD discussion.

---

## 5. Database & Data Models

| Tool | Purpose | Why this one |
|---|---|---|
| **MongoDB** | Primary datastore (Users, Zones, Routes, DailyRoutes, Complaints, PickupRequests, Payments) | Already decided; document model fits this app's data reasonably well |
| **MongoDB Atlas** (free tier, M0 cluster) | Hosted database for deployment | Free, no server management, pairs cleanly with Render since Render doesn't host MongoDB natively |
| **Replica set (Atlas provides this by default)** | Enables multi-document transactions | Needed for payment-confirmation + request-creation atomicity — Atlas gives you this out of the box, no manual replica-set configuration required |

### Core Schema Highlights
- **Users**: `name`, `email`, `passwordHash`, `role` (`citizen` \| `staff` \| `admin`), `zoneId`, `address`. (Public signup defaults to `citizen`; staff/admin provisioned by admin or seed script).
- **Zones & Routes**: Static route templates (`orderedStopCoordinates`) representing the standard collection sequence.
- **DailyRoutes**: Daily driver tracking log (`date`, `zoneId`, `driverId`, `stops: [{ stopId, address, coordinates, status, skipReason, completedAt }]`, `overallStatus`). Prevents mutating static route templates.
- **Complaints**: `citizenId`, `zoneId`, `category`, `description`, `photoUrl`, `location`, `status`.
- **PickupRequests & Payments**: Razorpay order/payment records linked with scheduled pickup details and refund audit states.

---

## 6. Payments

| Tool | Purpose | Why this one |
|---|---|---|
| **Razorpay** | Payment gateway for special/bulk pickup fees | Well-suited for India-based deployment/testing, has a free test/sandbox mode, and a straightforward Node SDK |
| **Razorpay Orders API** | Creates a payment order for a pickup request | Equivalent concept to Stripe's PaymentIntent — one order per pickup request |
| **Razorpay Webhooks** | Confirms payment status server-side | Critical: payment status must be updated only when Razorpay's webhook fires (`payment.captured` verified via HMAC crypto signature), never from frontend redirect |
| **Razorpay Refunds API** | Handles the >24h cancellation refund policy | Single API call against a captured payment ID |
| **ngrok** (Local Dev) | Local webhook tunnel | Exposes `http://localhost:5000` to Razorpay webhook callbacks during local testing |

**Simplicity note:** Razorpay's checkout can be embedded via their standard Checkout.js script — no need to build custom card-input UI, which keeps PCI-compliance concerns off your plate entirely.

---

## 7. Media Storage

| Tool | Purpose | Why this one |
|---|---|---|
| **Cloudinary** | Stores complaint photos and pickup request photos | Free tier is generous, simple REST/SDK upload pattern, no need to manage your own file storage/CDN |

---

## 8. Automation

| Tool | Purpose | Why this one |
|---|---|---|
| **Zapier** | Sends confirmation emails, reminders, and status-change notifications | Free tier's 100 tasks/month is sufficient for a demo-scale project; no need to self-host anything |
| **Zapier "Catch Hook" trigger** | Receives event pings from your backend (pickup confirmed, complaint status changed) | Simple `fetch()` POST call from Express with `{ email, name, subject, body }` payload |
| **Zapier "Schedule" trigger / Cron** | Sends daily collection reminders | Zapier Schedule ping or Express scheduler invoking the Catch Hook for scheduled zone collections |

---

## 9. DevOps & Infrastructure

| Tool | Purpose | Why this one |
|---|---|---|
| **Docker** | Containerizes frontend and backend | Core DevOps requirement — 2 containers (frontend static server/nginx, backend node); database lives on Atlas, avoiding local replica-set complexity |
| **docker-compose** | Runs frontend + backend together locally | Simple two-service compose file with environment variables connecting to Atlas |
| **GitHub Actions** | CI/CD pipeline (install → lint/test → build → deploy trigger) | Free for public repos, no separate CI server to manage |
| **Render** | Hosts backend (Web Service) and frontend (Static Site) | Free tier available, connects directly to GitHub for auto-deploy — avoids manually configuring servers, load balancers, or DNS |
| **MongoDB Atlas** | Hosted database | Covered above — pairs with Render since Render itself doesn't offer MongoDB |

**Simplicity note:** No Kubernetes, no separate reverse proxy/load balancer setup, no manual server provisioning (EC2, etc.). Render abstracts all of that away, which is appropriate — the DevOps learning value here is in Docker + CI/CD + environment/secrets management, not in learning cloud infrastructure from scratch.

---

## 10. Full Stack Summary Table

| Layer | Technology |
|---|---|
| Frontend | React, Vite, React Router, React-Leaflet |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose, hosted on MongoDB Atlas |
| Auth | JWT, bcrypt |
| Payments | Razorpay (Orders, Webhooks with HMAC, Refunds, ngrok for local dev) |
| Media | Cloudinary |
| Maps | Leaflet + OpenStreetMap |
| Automation | Zapier (Catch Hook) |
| Containers | Docker + docker-compose (Frontend + Backend) |
| CI/CD | GitHub Actions |
| Hosting | Render (frontend + backend), MongoDB Atlas (database) |

---

## 11. Complexity Audit — What We Deliberately Avoided

| Considered | Avoided because |
|---|---|
| Google Maps API | Requires a billing account/API key setup — no functional benefit over Leaflet at this scope |
| Kubernetes | Massive overkill for a 2-container app; Docker + docker-compose already demonstrates the core concept |
| Microservices architecture | Adds inter-service communication complexity with no benefit for an app this size |
| GraphQL | REST is simpler to reason about and sufficient for this data model |
| Self-hosted n8n / custom notification service | Zapier removes an entire deployment/maintenance concern |
| Redis/session store | JWT is stateless — no session store needed |
| Custom card-input UI (PCI scope) | Razorpay Checkout.js handles this — no reason to build it yourself |

---

## 12. Conclusion
This stack covers every required capability from the PRD (API integration, payments, media upload, automation, mapping) while keeping infrastructure choices at the minimum complexity needed to demonstrate real DevOps skills: containerization, CI/CD, environment/secrets management, and cloud deployment — without introducing tools whose main effect would be to add setup time rather than learning value.