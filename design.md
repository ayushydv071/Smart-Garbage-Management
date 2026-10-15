# Design Document
## Smart Garbage Management System

**Author:** Ayush
**Version:** 1.1
**Status:** Draft
**Last Updated:** October 7, 2026

---

## 1. Design Direction

The brief: simple, easy to use, like a government website. That means the design goal here is **clarity over personality**. A citizen reporting an overflowing bin, or a staff member checking their route on a phone during a shift, should never have to think about the interface — only about the task. Every choice below is made in service of that: fewer colors used decoratively, generous text size, obvious buttons, and no motion or effects that don't communicate something.

This is not a marketing site. There is no "hero moment" to design for — the most important screen is the plain, functional one a person lands on after logging in.

---

## 2. Color System

Your chosen palette, applied by function rather than decoration:

| Color | Hex | Role |
|---|---|---|
| Cream | `#F5EBDD` | Primary background — used for page backgrounds and card surfaces, keeps the interface warm rather than clinical white |
| Coral | `#F2765E` | Primary action color — main buttons ("Report Issue," "Request Pickup," "Submit"), active nav item, key highlights |
| Blue | `#315B8C` | Secondary/informational color — links, secondary buttons, headers, the map route line, informational badges |
| Dark Brown | `#413333` | Primary text color — body text, headings, icons; also used for borders/dividers at low opacity |

### Functional extensions (derived, not new colors)
Government-style interfaces need status indicators (complaint states, payment states) that don't compete with the primary palette. Rather than introducing new hues, use tints/shades of the existing four:

- **Success / Resolved:** Blue at full strength (`#315B8C`) — avoids adding green, keeps the palette closed
- **Pending / In-progress:** Coral at 60% opacity — softer than the primary action coral, so it reads as "waiting," not "click me"
- **Error / Failed payment:** Dark brown at full strength on a light coral background — serious without introducing red, which would break the palette
- **Disabled state:** Dark brown at 30% opacity

### Usage ratio
Roughly **70% cream (background/space), 20% dark brown (text/structure), 8% blue (secondary actions/info), 2% coral (primary actions only)**. Coral should stay rare — its job is to draw the eye to the one thing a person should do on a given screen, not to decorate every button.

---

## 3. Typography

Government portals prioritize legibility over character. Recommended:

- **Primary typeface:** A plain, highly legible sans-serif with good number/label clarity — **Inter** or **IBM Plex Sans** (IBM Plex Sans is worth considering specifically since it was designed for exactly this kind of civic/institutional clarity).
- **One family only.** No separate display font — headings use the same family at a heavier weight, keeping the interface visually calm.

### Type scale
| Use | Size | Weight |
|---|---|---|
| Page title | 28px | Semibold |
| Section heading | 20px | Semibold |
| Body text | 16px | Regular |
| Form labels | 14px | Medium |
| Helper/caption text | 13px | Regular |

Line length kept under 75 characters for body text and form helper text, so paragraphs (e.g., complaint descriptions, policy notes) stay easy to scan.

**Weight as hierarchy:** section titles and card headings use Semibold; helper text, timestamps, and metadata use Regular weight at a muted dark-brown tint (e.g., 60% opacity) rather than full-strength text color — this lets the eye separate "what this is" from "detail about it" without needing a size change on every element.

---

## 4. Layout Principles

- **Left-aligned, not centered.** Government and utility interfaces are read top-to-bottom, left-to-right as forms and lists — centering text blocks (a common "AI-generated" default) would work against the utilitarian feel you want.
- **Flat surfaces, minimal shadows.** Cards use a thin `#413333` border at low opacity (e.g., 10-15%) instead of a drop shadow — flatter, more paper-like, consistent with the "official document" feel.
- **Square-ish corners, not fully rounded.** A small border-radius (4-6px) reads as approachable without tipping into the "rounded SaaS card" look.
- **No decorative imagery.** Icons should be simple line icons (e.g., a trash bin, a calendar, a map pin) used functionally — to aid scanning — never as hero illustrations.
- **Generous spacing, but not wasted space.** Padding should make forms and tables easy to tap/click on mobile, without the page feeling sparse or "empty state" by default.

---

## 5. Key Screens

### 5.1 Login / Signup
```
┌─────────────────────────────────┐
│  [Cream background]              │
│                                  │
│      Smart Garbage Management    │
│      ─────────────────────       │
│      [ Email            ]        │
│      [ Password         ]        │
│                                  │
│      [ Log In ]  <- coral button │
│      New here? Create an account │
└─────────────────────────────────┘
```
Single centered form (this is the one place centering is appropriate — it's a focused, single-task screen). No background imagery. Blue text link for "Create an account."

### 5.2 Citizen Dashboard
```
┌─────────────────────────────────┐
│ [Nav: Dashboard | My Reports |   │
│       Pickups | Schedule]        │
├─────────────────────────────────┤
│ Your Zone: Sector 12             │
│ Next Collection: Tomorrow, 8 AM  │
│                                  │
│ [ Report an Issue ]  <- coral    │
│ [ Request Pickup  ]  <- coral    │
│                                  │
│ Recent Reports                   │
│ • Overflowing bin — In Progress  │
│ • Missed pickup — Resolved       │
└─────────────────────────────────┘
```
Two primary actions front and center — this is the screen most citizens will use most often, so it should not require scrolling to find "Report an Issue."

### 5.3 Complaint Form
Plain vertical form: category dropdown, location (auto-filled with manual override), photo upload (a simple drag-or-tap area with a dashed dark-brown border), description text area, one coral "Submit Report" button at the bottom.

### 5.4 Pickup Request + Payment
Step-based, not all on one page: (1) select pickup type and date → (2) review fee → (3) Razorpay checkout embed → (4) confirmation screen with a clear "You're booked" message and the cancellation policy stated plainly ("Cancel more than 24 hours before your slot for a full refund").

### 5.5 Map View
Full-width map (Leaflet) with the zone's route drawn in blue, stop markers in dark brown, and the citizen's own address pinned in coral so it's immediately distinguishable. A simple sidebar or bottom sheet (mobile) lists "Stop 3 of 8 completed."

### 5.6 Staff Route View
Built mobile-first, since staff will likely check this on a phone during collection. A plain vertical checklist: each stop as a row with address, a "Mark Complete" button, and a "Skip" option with a required reason field. No map decoration needed here — the list is the interface.

### 5.7 Admin Dashboard
The one screen allowed to be table-heavy and dense, since admins are doing structured management work, not casual browsing. Tabs for Complaints / Pickups / Zones, each a sortable table with status badges using the functional color extensions from Section 2.

---

## 6. Component Style Guide

| Component | Style |
|---|---|
| Primary button | Coral background, cream text, 6px radius, no shadow |
| Secondary button | Cream background, blue border and text |
| Input field | Cream background, dark-brown 1px border, blue border on focus |
| Status badge | Pill-shaped, colored per Section 2's functional extensions, dark-brown text |
| Card | Cream surface, thin dark-brown border at low opacity, 6px radius, no drop shadow — padding kept consistent (16-20px) across all cards rather than varying per screen, so density reads as intentional, not accidental |
| Navigation bar | Blue background, cream text — the one place blue is used as a dominant surface color, giving the app a consistent "header" identity across all roles |

---

## 7. Accessibility Notes

- Coral (`#F2765E`) on cream (`#F5EBDD`) has relatively low contrast — **never use coral text on cream background**; coral is a fill/background color for buttons (with cream or dark-brown text on top of it), not a text color itself.
- Dark brown (`#413333`) on cream passes contrast comfortably for body text.
- All interactive elements need a visible focus outline (a 2px blue outline works well against the cream background) for keyboard navigation.
- Status should never be conveyed by color alone — pair every status badge with a text label ("Resolved," "Pending"), since this also serves colorblind users and keeps the government-style plainness.

---

## 8. What This Design Deliberately Avoids
In keeping with the "simple, government-style" brief:
- No gradients, no decorative illustrations
- No animated page-load sequences — transitions only respond to user actions (e.g., a status changing color when updated, not a scroll-triggered fade-in)
- No dark mode requirement for v1 — a single, consistent light theme matches the "official portal" feel and reduces build time
- No dense marketing copy — every screen's text is instructional ("Select a pickup date") rather than persuasive
- No heavy card shadows or large border-radius (see Section 4) — kept flat and square-ish rather than adopting a generic "rounded SaaS" look

---

## 9. Role Switching — Demo/Dev Mode Only

The role selection should never live in the public header as a casual dropdown next to Login — that's a real production anti-pattern (exposes role-switching to anyone, looks unfinished to an evaluator judging it as a real product).

- **After login:** replace any header role indicator with a standard user avatar/profile menu (name, role shown as a small label, logout).
- **For jury/evaluator demos specifically:** add a small collapsible "Demo Toolbar" pinned to a bottom corner of the screen, closed by default, that lets a reviewer switch between Citizen/Staff/Admin views quickly without digging through separate logins. Style it visibly differently from the rest of the UI (e.g., a dashed border, a small "DEMO" label) so it reads as a reviewer convenience, not a real app feature.

---

## 10. Admin Table Polish

Extends Section 5.7 (Admin Dashboard) and Section 6 (Component Style Guide):

- **Pagination footer:** every data table shows "Showing 1–10 of 48 entries" with page controls — never an unbounded scrolling table once data scales past a screen or two.
- **Row hover state:** a subtle background shift on hover (a few percent darker than the cream surface, not a strong highlight) — functional, confirms the row is interactive, doesn't fight the flat aesthetic.
- **Dropdown overflow:** any in-table dropdown (e.g., "Assigned Staff") must be allowed to render outside the table's clipping bounds (use a portal/overlay pattern, not `overflow: hidden` on the table container).
- **Status pills with icons:** pair each status badge with a small functional icon, not just color — a spinner-style icon for "In Progress," a checkmark for "Resolved," a clock for "Pending." This directly reinforces Section 7's accessibility rule (never convey status by color alone) rather than adding decoration.

---

## 11. Micro-Interactions & Feedback

This is a genuine gap in the original plan — Section 8 ruled out decorative motion, but confirming an action happened is functional feedback, not decoration, so it belongs:

- **Toasts:** a small, flat (no shadow/gradient) toast in the corner on key actions — "Complaint CMP-2026-0891 resolved," "Pickup request submitted." Use the functional status colors from Section 2 (blue for success, dark-brown-on-coral for errors) rather than introducing a new green.
- **Button loading state:** when an action triggers an API call (Resolve, Submit, Pay), the button shows a small inline spinner and disables itself — prevents double-submits and makes the UI feel responsive. Keep it to the button itself, not a full-page loading overlay, to stay consistent with the "no unnecessary motion" rule.

---

## 12. Live Map — Restrained Motion

Extends Section 5.5. A fully static truck marker is hard to read as "live," so a small amount of motion is justified here specifically — but keep it restrained, not decorative:

- **Adopt:** a simple pulsing ring around the active truck marker (opacity/scale animation only, using the blue from Section 2) — signals "this is live" without adding a glow/gradient effect that would break Section 8's "no gradients" rule.
- **Marker popup:** clicking a stop or the truck marker opens a small flat card (same card style as Section 6) showing driver name, vehicle identifier, and ETA — functional detail on demand, not shown by default (keeps the map itself uncluttered).