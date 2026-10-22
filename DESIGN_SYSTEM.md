# Portfolio V2 Design System Specification

> **Target Audience:** Design System Reference & AI Prompt Context for Claude  
> **Purpose:** Feed directly into Claude to generate new case studies, sub-pages, UI modules, and components that seamlessly match Portfolio V2.  
> **Source Files:** `src/styles.css`, `src/case-study.css`, `src/BlazeupCaseStudy.jsx`, `src/ZevoxCaseStudy.jsx`

---

## 1. Design Philosophy & Aesthetic Identity

Portfolio V2 is built on a **warm, tactile, editorial aesthetic** inspired by premium Swiss typography, Dieter Rams' industrial precision, and warm Japanese paper tones:

- **Warm Light Canvas:** Never use stark `#FFFFFF` as the main canvas background. The base canvas is a warm alabaster oatmeal (`#F5F4F0`), with alternating sections tinted in warm limestone (`#EDEAE2`).
- **Deep Carbon Ink (Not Pure Black):** Primary typography and prominent elements use `#17171A`—a softer, richer carbon ink that feels human and editorial rather than digital and harsh.
- **Section Rhythm & Pacing:** Sections alternate deliberately between the default canvas (`#F5F4F0`) and warm tinted bands (`#EDEAE2`), separated by hairline borders (`#E2E0D8`) to create visual breathing room.
- **Squircle Geometry & Tactile Elevation:** Containers, cards, and image frames use generous squircle radii (`16px` to `20px`) with `corner-shape: squircle; -webkit-corner-smoothing: 0.6;`, paired with ultra-soft ambient shadows rather than harsh drop shadows.
- **High Information Density with Visual Clarity:** Case studies emphasize systematic thinking, explicit information architecture (IA), atomic component breakdowns, and interactive or visual demonstrations.

---

## 2. Complete Color Palette & Token Reference

### A. Surface & Canvas Tokens
| CSS Variable | HEX / Value | Role / Usage |
| :--- | :--- | :--- |
| `--bg-canvas` | `#F5F4F0` | **Primary background** for the whole site and standard case study sections. |
| `--bg-surface-warm` / `--cream` | `#EDEAE2` | **Alternating tinted section background** (`.case-section-tinted`), pill badges, and input fills. |
| `--bg-surface-card` | `#E2DFD7` | Deeper warm tone for hovered buttons, nested cards, and progress tracks. |
| `--bg-surface-white` | `#FFFFFF` | Used **sparingly** inside cards (e.g. persona cards), image frames, and floating modals. |
| `--bg-surface-subtle` | `#F0EEE8` | Ultra-light warm tint for chips and nested backgrounds. |
| `--cream-light` | `#F4F2EC` | Subtle gradient stop and hero highlights. |

### B. Ink & Typography Tokens (Light Canvas)
| CSS Variable | HEX / Value | Role / Usage |
| :--- | :--- | :--- |
| `--ink` / `--text-primary` | `#17171A` | **Primary headings (H1, H2, H3)**, key numbers, high-emphasis text, active icons. |
| `--text-secondary` | `#5A5850` | **Body copy**, intros, descriptions, metadata values, card paragraphs. |
| `--text-muted` | `#8E8A80` | **Captions**, uppercase section kickers, dates, secondary metadata labels. |
| `--text-subtle` | `#A3A096` | Low-priority indicators, placeholder text, disabled states. |

### C. Dark Canvas Tokens (Contained Dark Cards & Footers)
| CSS Variable | HEX / Value | Role / Usage |
| :--- | :--- | :--- |
| `--surface-dark` | `#121513` | Deep dark charcoal canvas for dark callouts and footer sections. |
| `--surface-dark-card` | `#171D18` | Contained dark card surface. |
| `--surface-dark-elevated` | `#1F2620` | Hovered dark card or floating dark element. |
| `--text-inverse` | `#FFFFFF` | Primary white text on dark surfaces. |
| `--text-inverse-secondary` | `#9DA79F` | Secondary soft green-grey text on dark surfaces. |
| `--text-inverse-muted` | `#788279` | Muted subtitles and labels on dark surfaces. |
| `--text-inverse-subtle` | `rgba(255, 255, 255, 0.45)` | Low-contrast text on dark surfaces. |

### D. Border & Divider Tokens
| CSS Variable | HEX / Value | Role / Usage |
| :--- | :--- | :--- |
| `--border-subtle` | `rgba(23, 23, 26, 0.06)` | Subtle card outlines and divider rules. |
| `--border-light` | `#E2E0D8` | **Default border** for sections, image frames, and metadata dividers. |
| `--border-medium` | `#CFCDC5` | **Hover borders**, active states, and focus rings. |
| `--border-dark-light` | `rgba(255, 255, 255, 0.12)` | Borders on dark surface containers. |

### E. Accent, Status & Gradient Tokens
| CSS Variable | HEX / Value | Role / Usage |
| :--- | :--- | :--- |
| `--accent` | `#17171A` | Primary interactive color (monochrome ink ethos). |
| `--accent-hover` | `#000000` | High-contrast hover state. |
| `--status-green` | `#88B896` | Organic sage green for status indicators and success tags. |
| `--status-green-dark` | `#5E7566` | Deep sage green for high-contrast status text. |
| `--status-green-glow` | `rgba(136, 184, 150, 0.25)` | Subtle green glow on live badges. |
| Studio Card Gradient | `linear-gradient(135deg, #E6E2D8 0%, #EDEAE2 50%, #F5F3ED 100%)` | Warm limestone gradient used in hero showcase cards. |
| Eyebrow Line Gradient | `linear-gradient(90deg, #CFCDC5, transparent)` | Horizontal trailing rule for uppercase section kickers. |

---

## 3. Typography System & Baseline Modular Scale

### Font Families
```css
/* Display & Headlines */
font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Body & UI Elements */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```
*Google Fonts embed:*
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Manrope:wght@500;600;700;800&display=swap" rel="stylesheet">
```

### Modular Type Scale (Strict 4px Baseline)
| Token / Level | Font Family | Size | Weight | Line Height | Letter Spacing | Color |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | Manrope | `clamp(64px, 8.5vw, 120px)` | 700 / 800 | `1.0` | `-0.04em` | `--text-primary` |
| **Case Title (H1)** | Manrope | `clamp(34px, 4.2vw, 58px)` | 700 / 800 | `1.12` | `-0.03em` | `--text-primary` |
| **Section Title (H2)** | Manrope | `clamp(28px, 3.2vw, 42px)` | 700 | `1.15` | `-0.025em` | `--text-primary` |
| **Card Heading (H3)** | Manrope | `24px` | 700 | `1.28` | `-0.02em` | `--text-primary` |
| **Subheading (H4)** | Manrope | `20px` | 600 | `1.30` | `-0.015em` | `--text-primary` |
| **Lead / Intro Copy** | Inter | `16px` | 400 | `1.65` | `-0.005em` | `--text-secondary` |
| **Body Regular** | Inter | `14px` | 400 | `1.55` | `0` | `--text-secondary` |
| **UI Interactive** | Inter | `14px` | 500 / 600 | `1.30` | `-0.005em` | `--text-primary` |
| **Metadata Value** | Inter | `15px` | 400 | `1.50` | `0` | `--text-primary` |
| **Eyebrows / Kickers** | Inter | `12px` (uppercase) | 600 | `1.35` | `0.12em` | `--text-secondary` |
| **Badges / Micro** | Inter | `12px` (uppercase) | 600 | `1.25` | `0.08em` | `--text-primary` |
| **Captions & Notes** | Inter | `13px` | 400 | `1.50` | `0.01em` | `--text-muted` |

---

## 4. Spacing, Geometry & Radii

### Corner Radii
```css
--radius-sm: 10px;      /* Small chips, micro badges */
--radius-md: 16px;      /* Standard image frames, buttons, small cards */
--radius-lg: 20px;      /* Large showcase cards, visual frames, persona cards */
--radius-xl: 28px;      /* Feature cards, hero cards */
--radius-pill: 9999px;  /* Pill buttons, back links, status badges */
```
*Squircle smoothing applied to primary cards:*
```css
border-radius: 16px; /* or 20px */
corner-shape: squircle;
-webkit-corner-smoothing: 0.6;
```

### Elevation & Shadows
```css
--shadow-sm: 0 2px 8px rgba(23, 23, 26, 0.04);
--shadow-md: 0 12px 28px -6px rgba(23, 23, 26, 0.07);
--shadow-lg: 0 20px 40px -8px rgba(23, 23, 26, 0.12);

/* Case Study Showcase Frame Shadow */
box-shadow: 0 16px 40px -20px rgba(23, 23, 26, 0.08);

/* Hero Visual Overlapping Layer Shadow */
box-shadow: 0 32px 64px -24px rgba(23, 23, 26, 0.25);
```

### Section Rhythm & Container Rules
- **Container Max Width:** `1200px` centered with responsive inline padding `clamp(16px, 4vw, 40px)`.
- **Section Padding:** `padding: 80px 0;` (mobile: `padding: 56px 0;`).
- **Alternating Tinted Rhythm:**
  - Standard section: transparent on `--bg-canvas` (`#F5F4F0`).
  - Tinted section: `.case-section-tinted` with `background-color: var(--bg-surface-warm);` and `border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light);`.

---

## 5. Standard Component Blueprints for Case Studies

When Claude creates a case study page, it should assemble these standard components in sequence:

### Component 1: Reading Progress Bar
Fixed at the very top of the window, tracks scroll depth.
```html
<div class="case-progress-bar" style="transform: scaleX(0.45);" aria-hidden="true"></div>
```
```css
.case-progress-bar {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 3px;
  background-color: var(--text-primary);
  transform-origin: left;
  z-index: 1000;
  pointer-events: none;
}
```

### Component 2: Top Action Bar
Back navigation and optional lock/status badge.
```html
<div class="case-top-bar">
  <a href="#work" class="case-back-link">
    <svg class="case-back-arrow" ...><!-- ArrowLeft --></svg>
    <span>Back to Selected Work</span>
  </a>
  <button type="button" class="case-lock-status-btn">
    <svg ...><!-- Lock or Shield --></svg>
    <span>Protected · Click to Lock</span>
  </button>
</div>
```

### Component 3: Eyebrow Header Row
Standardized kicker with trailing gradient divider rule.
```html
<div class="case-eyebrow-row">
  <span class="case-eyebrow-text">02 — Overview & Role</span>
  <span class="case-eyebrow-line"></span>
</div>
```
```css
.case-eyebrow-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}
.case-eyebrow-text {
  font-family: var(--font-family-body);
  font-size: var(--text-eyebrow-size);
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-secondary);
}
.case-eyebrow-line {
  height: 1px;
  width: 72px;
  background: linear-gradient(90deg, var(--border-medium), transparent);
  opacity: 0.8;
}
```

### Component 4: 2-Column Section Header Grid
Used across all major sections: Headline on the left, lead paragraph on the right.
```html
<div class="case-section-head-grid">
  <h2 class="case-section-title">The Admin Dashboard.</h2>
  <p class="case-section-intro">
    A high-density compliance cockpit designed to answer “what needs attention right now?” at a single glance.
  </p>
</div>
```
```css
.case-section-head-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 48px;
  align-items: flex-start;
  margin-bottom: 48px;
}
@media (max-width: 860px) {
  .case-section-head-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
```

### Component 5: 4-Column Metadata Grid
Displays project credentials below the hero title.
```html
<div class="case-meta-grid">
  <div class="case-meta-item">
    <div class="case-meta-label">Role</div>
    <p class="case-meta-value">UI Design Intern</p>
  </div>
  <div class="case-meta-item">
    <div class="case-meta-label">Scope</div>
    <p class="case-meta-value">UI execution · IA refinement · Design system</p>
  </div>
  <div class="case-meta-item">
    <div class="case-meta-label">Product</div>
    <p class="case-meta-value">Blazeup ERP</p>
  </div>
  <div class="case-meta-item">
    <div class="case-meta-label">Origin</div>
    <p class="case-meta-value">Terralogic Hackathon</p>
  </div>
</div>
```

### Component 6: Warm Studio Visual Showcase Card
Hero visual card with layered mockups and squircle corners.
```css
.case-hero-visual-card {
  position: relative;
  width: 100%;
  border-radius: 20px;
  corner-shape: squircle;
  -webkit-corner-smoothing: 0.6;
  overflow: hidden;
  background: linear-gradient(135deg, #E6E2D8 0%, #EDEAE2 50%, #F5F3ED 100%);
  border: 1px solid var(--border-light);
  padding: 5% 5% 6% 5%;
  box-shadow: 0 24px 48px -20px rgba(23, 23, 26, 0.08);
}
```

### Component 7: Persona / User Cards
Clean white squircle cards with high-contrast role names and body descriptions.
```html
<div class="case-users-grid">
  <div class="case-user-card">
    <div class="case-user-num">01 / ADMIN PERSONA</div>
    <h3 class="case-user-role">System Admin</h3>
    <p class="case-card-body">Description text...</p>
  </div>
  <div class="case-user-card">
    <div class="case-user-num">02 / END-USER PERSONA</div>
    <h3 class="case-user-role">Department User</h3>
    <p class="case-card-body">Description text...</p>
  </div>
</div>
```

### Component 8: Process & Auditing 3-Step Grid
Numbered framework showing the evolution from problem to execution.
```html
<div class="case-steps-grid">
  <div class="case-step-card">
    <span class="case-step-num">01</span>
    <h3 class="case-step-title">Reality</h3>
    <p class="case-card-body">...</p>
  </div>
  ...
</div>
```

### Component 9: Contextual Workflow Chips & Pills
```html
<div class="case-chips-wrap">
  <span class="case-chip">Basic information</span>
  <span class="case-chip">Schedule</span>
  <span class="case-chip">Penalty</span>
  <span class="case-chip">ESG Mapping</span>
</div>
```
```css
.case-chip {
  display: inline-block;
  font-family: var(--font-family-body);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  background-color: var(--bg-surface-warm);
  border: 1px solid var(--border-light);
  padding: 6px 14px;
  border-radius: 9999px;
}
```

### Component 10: Footer Dual Navigation
```html
<div class="case-footer-nav">
  <a href="#work" class="case-nav-btn case-nav-btn-prev">
    <svg ...><!-- ArrowLeft --></svg>
    <span>Back to Selected Work</span>
  </a>
  <a href="#/case-study/next" class="case-nav-btn case-nav-btn-next">
    <span>Next: Project Title</span>
    <svg ...><!-- ArrowRight --></svg>
  </a>
</div>
```

---

## 6. Prompt Snippet for Claude (Feed-in Instructions)

When prompting Claude to generate a new case study, sub-page, or feature for this portfolio, paste the block below into the conversation:

```markdown
You are designing a web page for Nithin's design portfolio (Portfolio V2).
Adhere strictly to the following design system rules:

1. COLOR PALETTE:
   - Canvas Background: #F5F4F0 (Warm alabaster, NEVER stark white).
   - Tinted Section Background: #EDEAE2 (Used for alternating sections with 1px #E2E0D8 borders).
   - Primary Text: #17171A (Deep carbon ink, NEVER #000000).
   - Secondary Text: #5A5850 (Warm graphite).
   - Muted Labels / Captions: #8E8A80 (Warm stone).
   - Card Backgrounds: #FFFFFF or #EDEAE2.
   - Borders: 1px solid #E2E0D8 (Hover: #CFCDC5).
   - NO generic saturated colors (no bright blues, purples, or neon greens). Use #88B896 only for organic status badges.

2. TYPOGRAPHY:
   - Display / Headlines: 'Manrope', sans-serif (Bold / Extrabold, tight tracking -0.025em to -0.04em).
   - Body & UI: 'Inter', sans-serif (Regular 400 for body, Medium 500/Semibold 600 for UI).
   - Section Kickers: 12px uppercase, tracked at 0.12em, followed by a subtle horizontal gradient line.

3. STRUCTURE & LAYOUT:
   - Container width: 1200px max, centered, padding 16px to 40px.
   - Section rhythm: 80px vertical padding, alternating between default canvas (#F5F4F0) and tinted warm bands (#EDEAE2).
   - Section Header: 2-column grid (1.3fr title on left, 1fr intro paragraph on right).
   - Rounded corners: 16px to 20px squircle radii for cards and image frames; 9999px for pills/badges.

4. VOICE & CONTENT TONE:
   - Analytical, craft-driven, systems-oriented product design voice.
   - Highlight design constraints, trade-offs, information architecture decisions, and measurable outcomes.
```
