# Blazeup Compliance — Case Study (Latest 22-10-26 Version)

> **Document Type:** Production Case Study Specification & Content Blueprint  
> **Source Component:** `src/BlazeupCaseStudy.jsx` & `src/case-study.css`  
> **Source Origin:** `Blazeup_casestudy_221026.html` adapted to Portfolio V2 Design System  
> **Status:** Live on Portfolio V2 (`#/case-study/blazeup`)  
> **Protection:** Password-Gated (Enterprise Confidentiality)  
> **Valid Passwords:** `blazeup`, `blazeup2026`, `design`, `nithin`  
> **Access Contact:** [nithin161298@gmail.com](mailto:nithin161298@gmail.com)

---

## 00. Navigation Chrome & Password Gate

- **Floating Chapter Navigation (Desktop Right Rail):** Fixed interactive sidebar tracking 8 sections: `Intro`, `Problem`, `Process`, `Dashboard`, `Flow`, `Surfaces`, `Edge cases`, and `Outcome`.
- **Reading Progress Bar:** 3px fixed bar at top, carbon ink (`#17171A`), dynamically scaled across scroll depth.
- **Top Action Bar:** `← Back to Selected Work` + `Protected · Click to Lock` status button.
- **Password Gate:** Protects proprietary workflows under client confidentiality agreements. Unlocks with `blazeup` and persists across session.

---

## 01. Case Hero (`#intro` — Canvas Band `#F5F4F0`)

- **Eyebrow:** `Case Study · Compliance Module`
- **Headline (H1):** `Blazeup Compliance: Structuring Enterprise Complexity`
- **Lead Description:** *"Turning messy regulatory tracking into a calm, transparent enterprise workflow, from an unrefined hackathon prototype to a module shipped inside an award-winning ERP."*
- **Award Accolade:** `● Part of Blazeup · India’s Best Design Project 2026`
- **Studio Visual Card:** Warm limestone gradient card (`linear-gradient(135deg, #E6E2D8 0%, #EDEAE2 50%, #F5F3ED 100%)`) with squircle corners, soft ambient glow, macro dashboard image (`/case/dashboard.webp`), and scroll-driven parallax drawer (`/case/drawer-obligation.webp`).
- **Metadata Grid (4 Columns):**
  - **Role:** UI Design Intern
  - **Timeline:** May 2026 – August 2026
  - **Scope:** IA · UI execution · Design system
  - **Origin:** Terralogic hackathon project

---

## 02. The Problem / Stakes (`#stakes` — Dark Band `#121513`)

- **Eyebrow:** `01 / The problem`
- **Heading (H2):** `Compliance is an enterprise’s legal shield. The prototype had the logic, but not the hierarchy.`
- **Pills Row:** `Millions in regulatory exposure`, `Multi-jurisdiction mandates`, `Zero margin for a late filing` (with organic sage green dots `#88B896`).
- **Intro Paragraph:** *"Blazeup began as an internal Terralogic hackathon project. The calculations worked, but hundreds of statutory obligations were visually chaotic, easy to misread and hard to triage."*
- **Persona Cards (Dark Theme):**
  - **01 / Admin side — System Admin:** *"Internal specialists who maintain the frameworks, the catalog and the obligations every client relies on."* (`Covered in 04 · Interaction flow`)
  - **02 / Client side — Client User:** *"Corporate compliance officers who need high-level awareness of their own active obligations, deadlines and penalties."* (`Covered in 03 · Client dashboard`)

---

## 03. Process (`#process` — Canvas Band `#F5F4F0`)

- **Eyebrow:** `02 / Process`
- **Heading (H2):** `Structure first, pixels second.`
- **Intro Paragraph:** *"With no documentation and no product manager to ask, I used AI as an auditing partner to question flows and surface edge cases, and locked the information architecture before opening Figma."*
- **5-Step Milestone Timeline:**
  1. `01 / Hackathon prototype` — Working logic, no hierarchy.
  2. `02 / UX audit` — No PRD, no PM. Gemini and Claude as sounding boards.
  3. `03 / IA locked` — Structure and entity relationships agreed first.
  4. `04 / UI in Figma` — Built on the Blazeup design system.
  5. `05 / Shipped` — Integrated into the core platform.

---

## 04. Macro Layout · Client Side (`#dashboard` — Warm Band `#EDEAE2`)

- **Eyebrow:** `03 / Macro layout · Client side`
- **Heading (H2):** `The client dashboard: what needs attention right now?`
- **Lead Paragraph:** *"This is the view for the client tracking their own compliance, not the admin side where frameworks and obligations are set up."*
- **Subheading:** *Inside the dashboard: Dense compliance data, readable at a glance.*
- **Interactive Before / After Comparison Slider:**
  - Before: `/case/dashboard-before.jpg` (Previous compliance dashboard)
  - After: `/case/dashboard.jpg` / `.webp` (Redesigned compliance dashboard)
  - Interactive drag slider with `⇄` thumb handle, "Before" and "After" pill badges, and caption: *"Drag to compare. Both are cropped to the same height; the previous dashboard ran noticeably longer."*
- **4 Consolidation & Improvement Cards:**
  1. **Fewer stacked panels:** The long run of separate cards, including an empty Penalty Exposure panel, is consolidated so the key content fits higher on the page.
  2. **Health you can read:** Framework health moved from a row of mostly N/A gauges to a ranked list of scores.
  3. **Urgency is explicit:** Deadlines now carry PENDING and OVERDUE tags, with overdue rows picked out in red.
  4. **Actions where they belong:** Rows of bright orange buttons became a quiet Quick Links list, so the page leads with data rather than calls to action.
- **Client Dashboard Pin Figure (6 Pins):**
  1. *Headline numbers first* (32.8% X, 9.1% Y): On track, overdue, due soon, overall health and penalty exposure sit in one row, readable before any scrolling.
  2. *Status at a glance* (30.0% X, 26.5% Y): A single donut shows how many obligations are on track.
  3. *Where the risk sits* (58.0% X, 26.5% Y): A risk-tier breakdown (High, Medium) shows where the exposure is concentrated.
  4. *Urgency without opening* (86.8% X, 36.8% Y): Upcoming deadlines carry PENDING and OVERDUE tags, so priority is clear at a glance.
  5. *Framework health* (5.5% X, 67.0% Y): Per-framework scores show which frameworks need attention first.
  6. *Penalties surfaced* (36.7% X, 67.0% Y): Unpaid and Paid tabs keep open penalties in view without leaving the dashboard.

---

## 05. Interaction Flow · Admin Side (`#flow` — Canvas Band `#F5F4F0`)

- **Eyebrow:** `04 / Interaction flow · Admin side`
- **Heading (H2):** `Keeping users in context.`
- **Intro Paragraph:** *"Admins needed to manage active frameworks and also browse and adopt new ones, without losing their place in the system."*
- **3-Step Administrative Cards:**
  1. `01 / Manage in the table` — Admins work from the frameworks table.
  2. `02 / Click Browse Catalog` — The catalog drawer opens over the table, so the table never disappears.
  3. `03 / Inspect, then adopt` — Each framework can be read and adopted without leaving the page.
- **Primary Drawer Mockup:** `/case/catalog.webp` (Browse Framework Catalog drawer open over the frameworks table).
- **Subheading:** *Inside the drawer: Making each framework readable before you adopt it.*
- **Side-by-Side Drawer Evolution (4 Cols vs 8 Cols):**
  - **Before (Left):** `/case/catalog-early.webp` + *"Just a name, a version and a short description. Nothing about who issued it, what kind of framework it is, how big it is, or whether and when it was adopted."* + `✕ Unclear jurisdiction · No type · No adoption info`
  - **After (Right):** `/case/catalog-card.webp` PinFigure with 3 pins:
    - *Who issued it* (93.0% X, 13.5% Y, from 41%): The issuing body (EU Commission, SEC / PCAOB) makes the jurisdiction clear before anyone adopts.
    - *What it is, and how big* (93.0% X, 29.7% Y, from 46%): A type tag (Regulation, Audit framework) and an obligation count (88, 62) show the kind of framework and the workload it adds.
    - *Adoption state* (93.0% X, 36.2% Y, from 46%): Adopted frameworks show a green tick, an explicit timestamp (“You adopted v1.3 on 25 May, 2025”) and a disabled button.
- **Reused Drawer Pattern:** Custom framework creation uses the same slide-out pattern (`/case/create-framework.webp`), so adopting and authoring feel like one system.

---

## 06. Contextual Workflows (`#surfaces` — Warm Band `#EDEAE2`)

- **Eyebrow:** `05 / Contextual workflows`
- **Heading (H2):** `Match the surface to the cognitive load.`
- **Interactive Pill Mode Switcher:**
  - `Quick add · Drawer`: *"Stay in the list. Lightweight obligation additions stay in a slide-out drawer so the master table remains visible behind it."*
  - `Deep work · Full page`: *"Give heavy work a canvas. ESG mapping, penalty structures and filing schedules need focus, so they get a dedicated full page. Scroll inside the frame to explore it."*
  - Workflow Chips (for Full page): `Basic information`, `Schedule`, `Penalty`, `Filing guidance`, `ESG`, `Evidence config`, `Alert template`.
- **Mockup Frame:** Scrollable preview displaying `/case/obligation-drawer.webp` or `/case/obligation-page.webp`.

---

## 07. Edge Cases (`#edge` — Canvas Band `#F5F4F0`)

- **Eyebrow:** `06 / Edge cases`
- **Heading (H2):** `An empty state should never be a dead end.`
- **Intro Paragraph:** *"When no frameworks are adopted, the screen says what it is and prompts the first action: adopt a framework."*
- **Visual Card:** `/case/empty-state.webp` in an elevated squircle frame with a soft sage glow ring.

---

## 08. Outcome & Impact (`#impact` — Dark Band `#121513`)

- **Eyebrow:** `07 / Outcome`
- **Heading (H2):** `Shipped into the Blazeup core platform.`
- **Intro Paragraph:** *"The refined information architecture and modernised UI were integrated into the production ERP. This project laid the foundation for my ongoing product design work at Lollypop and Swantech."*
- **3 Outcome Cards:**
  1. `01 / AI as a UX partner` — Using LLMs as critique partners surfaced ambiguous states and challenged my mental model before I drew a pixel.
  2. `02 / Design system discipline` — Sticking to existing components and tokens made the module feel native to the wider ERP.
  3. `03 / Graphic design is a superpower` — My visual background shaped the type hierarchy and layout system for dense data. B2B software doesn’t have to look boring.
- **Footer Navigation:** `← Back to Selected Work` + `Next: Zevox Crypto Wallet →`.
