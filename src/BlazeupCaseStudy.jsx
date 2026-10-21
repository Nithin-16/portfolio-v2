import React, { useEffect, useState, useRef } from "react";
import { ArrowLeft, ArrowRight, Lock, Unlock, Eye, EyeOff } from "lucide-react";

/**
 * BlazeupCaseStudy Component
 * Password-protected case study with Portfolio V2's warm tone design system.
 */
const VALID_PASSWORDS = ["blazeup", "blazeup2026", "design", "nithin"];

export default function BlazeupCaseStudy({ onBack, onNavigate }) {
  // Password protection state (persisted across page session)
  const [isUnlocked, setIsUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem("blazeup_unlocked") === "true";
    } catch (e) {
      return false;
    }
  });

  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef(null);

  // Focus password input on mount if locked
  useEffect(() => {
    if (!isUnlocked && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isUnlocked]);

  // Handle password submission
  const handleUnlockSubmit = (e) => {
    e.preventDefault();
    const cleanInput = passwordInput.trim().toLowerCase();

    if (VALID_PASSWORDS.includes(cleanInput)) {
      try {
        sessionStorage.setItem("blazeup_unlocked", "true");
      } catch (err) {}
      setIsUnlocked(true);
      setErrorMessage("");
      window.scrollTo({ top: 0, behavior: "instant" });
    } else {
      setIsShaking(true);
      setErrorMessage("Incorrect password. Please try again or request access.");
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleLock = () => {
    try {
      sessionStorage.removeItem("blazeup_unlocked");
    } catch (err) {}
    setIsUnlocked(false);
    setPasswordInput("");
    setErrorMessage("");
  };

  // Reading Progress Bar
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!isUnlocked) return;

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(1, Math.max(0, window.scrollY / totalHeight)));
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isUnlocked]);

  // Interactive Pins for Macro Layout Section
  const [activePin, setActivePin] = useState(null);

  const pins = [
    {
      x: 32.8,
      y: 9.1,
      title: "Top Metric Cards",
      text: "Headline numbers sit at the top so status and critical risk metrics are readable before any scrolling.",
    },
    {
      x: 86.8,
      y: 36.8,
      title: "Upcoming Deadlines",
      text: "Items carry explicit PENDING and OVERDUE tags so operational urgency is clear without opening nested views.",
    },
  ];

  const metadata = [
    { label: "Role", value: "UI Design Intern" },
    { label: "Scope", value: "UI execution · IA refinement · Design system integration" },
    { label: "Product", value: "Blazeup, an intelligent ERP platform" },
    { label: "Origin", value: "Terralogic hackathon project" },
  ];

  const workflowChips = [
    "Basic information",
    "Schedule",
    "Penalty",
    "Filing guidance",
    "ESG",
    "Evidence config",
    "Alert template",
  ];

  // ── PASSWORD GATE VIEW ──
  if (!isUnlocked) {
    return (
      <div className="case-gate-page">
        <div className="container">
          <div className="case-gate-container">
            {/* Back link */}
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                if (onBack) onBack();
                else window.location.hash = "#work";
              }}
              className="case-back-link"
            >
              <ArrowLeft size={16} className="case-back-arrow" />
              <span>Back to Selected Work</span>
            </a>

            {/* Lock Card */}
            <div className={`case-gate-card ${isShaking ? "shake" : ""}`}>
              <div className="case-gate-icon-badge">
                <Lock size={24} strokeWidth={1.8} />
              </div>

              <div className="case-gate-kicker">01 — Confidential Case Study</div>
              <h1 className="case-gate-title">Blazeup Compliance</h1>
              <p className="case-gate-desc">
                This project contains proprietary enterprise workflows and research under client
                confidentiality agreements. Please enter the password to view the full case study.
              </p>

              <form onSubmit={handleUnlockSubmit} className="case-gate-form">
                <div className="case-gate-input-wrap">
                  <input
                    ref={inputRef}
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    placeholder="Enter password"
                    className={`case-gate-input ${errorMessage ? "has-error" : ""}`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="case-gate-toggle-pwd"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errorMessage && (
                  <div className="case-gate-error-msg">{errorMessage}</div>
                )}

                <button type="submit" className="case-gate-submit-btn">
                  <span>Unlock Case Study</span>
                  <ArrowRight size={15} />
                </button>
              </form>

              {/* Access Request Note */}
              <div className="case-gate-hint-box">
                <span className="case-gate-hint-text">
                  For portfolio review access, please contact{" "}
                  <a href="mailto:nithin161298@gmail.com" className="case-gate-contact-link">
                    nithin161298@gmail.com
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── UNLOCKED CASE STUDY VIEW ──
  return (
    <div className="case-study-page">
      {/* ── Reading Progress Bar (Warm Ink Tone) ── */}
      <div
        className="case-progress-bar"
        style={{ transform: `scaleX(${scrollProgress})` }}
        aria-hidden="true"
      />

      <div className="container">
        {/* ── Top Bar: Back Link + Re-Lock Button ── */}
        <div className="case-top-bar">
          <a
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              if (onBack) onBack();
              else window.location.hash = "#work";
            }}
            className="case-back-link"
          >
            <ArrowLeft size={16} className="case-back-arrow" />
            <span>Back to Selected Work</span>
          </a>

          <button
            type="button"
            onClick={handleLock}
            className="case-lock-status-btn"
            title="Lock this case study"
          >
            <Unlock size={14} />
            <span>Protected · Click to Lock</span>
          </button>
        </div>

        {/* ── 01. CASE HERO ── */}
        <section className="case-hero">
          <div className="case-eyebrow-row">
            <span className="case-eyebrow-text">01 — Case Study · Compliance Module</span>
            <span className="case-eyebrow-line" />
          </div>

          <h1 className="case-hero-title">
            <span className="case-hero-title-accent">Blazeup Compliance:</span>
            <br />
            Structuring Enterprise Complexity
          </h1>

          <p className="case-hero-desc">
            Transforming an unrefined hackathon concept into a production-ready compliance module
            for an award-winning intelligent ERP platform.
          </p>

          <div className="case-award-badge">
            <span className="case-award-dot" />
            <span>Part of Blazeup: India’s Best Design Project 2026</span>
          </div>

          {/* Metadata Grid */}
          <div className="case-meta-grid">
            {metadata.map((item) => (
              <div key={item.label} className="case-meta-item">
                <div className="case-meta-label">{item.label}</div>
                <p className="case-meta-value">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Hero Visual: Overlapping Dashboard & Slide-out Drawer in Warm Limestone Frame */}
          <div className="case-hero-visual-card">
            <div className="case-hero-visual-wrap">
              <picture>
                <source srcSet="/case/dashboard.webp" type="image/webp" />
                <img
                  src="/case/dashboard.jpg"
                  alt="Blazeup Compliance dashboard with status distribution, risk tiers and upcoming deadlines"
                  className="case-hero-main-img"
                  loading="eager"
                  fetchPriority="high"
                />
              </picture>
              <picture>
                <source srcSet="/case/drawer-obligation.webp" type="image/webp" />
                <img
                  src="/case/drawer-obligation.jpg"
                  alt="Create Obligation slide-out drawer"
                  className="case-hero-drawer-img"
                  loading="eager"
                />
              </picture>
            </div>
          </div>
        </section>

        {/* ── 02. OVERVIEW & ROLE ── */}
        <section id="case-overview" className="case-section">
          <div className="case-section-divider" />
          <div className="case-eyebrow-row">
            <span className="case-eyebrow-text">02 — Overview &amp; Role</span>
            <span className="case-eyebrow-line" />
          </div>

          <div className="case-section-head-grid">
            <h2 className="case-section-title">
              One platform for HR, Finance, CRM and Compliance.
            </h2>
            <p className="case-section-intro">
              Blazeup is an intelligent ERP that unifies the core functions of an enterprise in one place.
            </p>
          </div>

          <div className="case-overview-grid">
            <div className="case-overview-card">
              <div className="case-card-kicker">My Role</div>
              <p className="case-card-body">
                UI Design Intern. I owned UI execution, refined the information architecture, and
                integrated the compliance module seamlessly into the Blazeup core design system.
              </p>
            </div>
            <div className="case-overview-card">
              <div className="case-card-kicker">The Constraint</div>
              <p className="case-card-body">
                Adhere strictly to the new Blazeup design system, ensuring the compliance module feels
                like a native, cohesive extension rather than a standalone silo.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ── 03. CHALLENGE & USERS (Warm Surface Section) ── */}
      <section id="case-challenge" className="case-section case-section-tinted">
        <div className="container">
          <div className="case-eyebrow-row">
            <span className="case-eyebrow-text">03 — Challenge &amp; Users</span>
            <span className="case-eyebrow-line" />
          </div>

          <div className="case-section-head-grid">
            <h2 className="case-section-title">
              A hackathon idea with no clear hierarchy.
            </h2>
            <p className="case-section-intro">
              The module originated as an internal Terralogic hackathon prototype. While functional under the hood,
              it lacked visual hierarchy and structural clarity for production users.
            </p>
          </div>

          <div className="case-users-grid">
            <div className="case-user-card">
              <div className="case-user-num">01 / ADMIN PERSONA</div>
              <h3 className="case-user-role">System Admin</h3>
              <p className="case-card-body">
                Needs a dense, actionable macro view of everything in flight, plus full administrative controls to
                configure complex legal frameworks, assign deadlines, and track obligations.
              </p>
            </div>
            <div className="case-user-card">
              <div className="case-user-num">02 / END-USER PERSONA</div>
              <h3 className="case-user-role">Department User</h3>
              <p className="case-card-body">
                Needs a low-friction, focused view of the tasks specifically pending for their team, with clear filing
                guidance and zero extraneous administrative noise.
              </p>
            </div>
          </div>

          <p className="case-card-body" style={{ maxWidth: "720px", color: "var(--text-secondary)" }}>
            This case study details the <strong>Admin experience</strong>, where enterprise complexity and information
            architecture challenges were greatest.
          </p>
        </div>
      </section>

      <div className="container">
        {/* ── 04. UX AUDITING ── */}
        <section id="case-audit" className="case-section">
          <div className="case-section-divider" />
          <div className="case-eyebrow-row">
            <span className="case-eyebrow-text">04 — UX Auditing</span>
            <span className="case-eyebrow-line" />
          </div>

          <div className="case-section-head-grid">
            <h2 className="case-section-title">Structure first, pixels second.</h2>
            <p className="case-section-intro">
              Bridging the gap between an engineering prototype and a production-ready enterprise product through systematic UX auditing.
            </p>
          </div>

          <div className="case-steps-grid">
            <div className="case-step-card">
              <span className="case-step-num">01</span>
              <h3 className="case-step-title">Reality</h3>
              <p className="case-card-body">
                No formal PRD documentation and no dedicated product manager to define baseline requirements.
              </p>
            </div>
            <div className="case-step-card">
              <span className="case-step-num">02</span>
              <h3 className="case-step-title">Process</h3>
              <p className="case-card-body">
                I partnered with Gemini and Claude as UX auditing sounding boards to question flows, surface hidden edge cases, and test edge paths.
              </p>
            </div>
            <div className="case-step-card">
              <span className="case-step-num">03</span>
              <h3 className="case-step-title">Execution</h3>
              <p className="case-card-body">
                I locked the core information architecture and entity relationships before designing high-fidelity screens in Figma.
              </p>
            </div>
          </div>
        </section>

        {/* ── 05. MACRO LAYOUT & PIN FIGURE (Ink Pins) ── */}
        <section id="case-dashboard" className="case-section">
          <div className="case-section-divider" />
          <div className="case-eyebrow-row">
            <span className="case-eyebrow-text">05 — Macro Layout</span>
            <span className="case-eyebrow-line" />
          </div>

          <div className="case-section-head-grid">
            <h2 className="case-section-title">The Admin Dashboard.</h2>
            <p className="case-section-intro">
              A high-density compliance cockpit designed to answer <em>“what needs attention right now?”</em> at a single glance.
            </p>
          </div>

          <div className="case-pin-figure">
            <div className="case-pin-container">
              <picture>
                <source srcSet="/case/dashboard.webp" type="image/webp" />
                <img
                  src="/case/dashboard.jpg"
                  alt="Blazeup Compliance interactive dashboard view"
                  className="case-pin-img"
                  loading="lazy"
                />
              </picture>

              {pins.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  className={`case-pin-btn ${activePin === i ? "is-active" : ""}`}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  onMouseEnter={() => setActivePin(i)}
                  onMouseLeave={() => setActivePin(null)}
                  onClick={() => setActivePin(activePin === i ? null : i)}
                  aria-label={`Highlight feature ${i + 1}: ${p.title}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Pin Notes List */}
            <ol className="case-pin-notes">
              {pins.map((p, i) => (
                <li
                  key={i}
                  className={`case-pin-note-item ${activePin === i ? "is-active" : ""}`}
                  onMouseEnter={() => setActivePin(i)}
                  onMouseLeave={() => setActivePin(null)}
                >
                  <span className="case-pin-note-badge">{i + 1}</span>
                  <div>
                    <h3 className="case-pin-note-title">{p.title}</h3>
                    <p className="case-pin-note-desc">{p.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>

      {/* ── 06. INTERACTION FLOW (Warm Surface Section) ── */}
      <section id="case-flow" className="case-section case-section-tinted">
        <div className="container">
          <div className="case-eyebrow-row">
            <span className="case-eyebrow-text">06 — Interaction Flow</span>
            <span className="case-eyebrow-line" />
          </div>

          <div className="case-section-head-grid">
            <h2 className="case-section-title">Keeping users in context.</h2>
            <p className="case-section-intro">
              Slide-out drawers let admins inspect, configure, and adopt legal frameworks without losing their position in the data table.
            </p>
          </div>

          {/* Step 1: Management Table */}
          <div className="case-flow-step">
            <div className="case-step-label">Step 1 · Management Table</div>
            <div className="case-frame">
              <picture>
                <source srcSet="/case/frameworks.webp" type="image/webp" />
                <img src="/case/frameworks.jpg" alt="Frameworks management table" loading="lazy" />
              </picture>
            </div>
            <div className="case-caption">The primary frameworks table with sortable columns, risk badges, and quick actions.</div>
          </div>

          {/* Step 2: Browse Catalog Drawer */}
          <div className="case-flow-step">
            <div className="case-step-label">Step 2 · Browse Catalog Drawer</div>
            <div className="case-frame">
              <picture>
                <source srcSet="/case/catalog.webp" type="image/webp" />
                <img src="/case/catalog.jpg" alt="Browse Framework Catalog drawer overlaid on table" loading="lazy" />
              </picture>
            </div>
            <div className="case-caption">Overlay drawer slides in from the right, maintaining background context.</div>
          </div>

          {/* Step 2 Detail: Proposed Card vs Atomic Breakdown */}
          <div className="case-flow-split">
            <div>
              <div className="case-frame">
                <picture>
                  <source srcSet="/case/catalog-card.webp" type="image/webp" />
                  <img src="/case/catalog-card.jpg" alt="Framework Catalog Card close-up" loading="lazy" />
                </picture>
              </div>
              <div className="case-caption">The proposed Framework Catalog Card design.</div>
            </div>

            <div>
              <h3 className="case-step-title" style={{ fontSize: "22px", marginBottom: "16px" }}>
                A Card Built from Existing System Atoms
              </h3>
              <ul className="case-atom-list">
                <li className="case-atom-item">
                  <strong>Obligation counts:</strong> Explicitly communicate the workload overhead before adoption.
                </li>
                <li className="case-atom-item">
                  <strong>Framework badges:</strong> Categorical tags (Tax, Labor, ESG) enable quick scanning.
                </li>
                <li className="case-atom-item">
                  <strong>Adoption states:</strong> Clear timestamped status with disabled state once incorporated.
                </li>
              </ul>
            </div>
          </div>

          {/* Step 3: Create Framework & Earlier Iteration */}
          <div className="case-flow-split" style={{ marginTop: "56px" }}>
            <div>
              <div className="case-step-label">Step 3 · Create Framework</div>
              <div className="case-frame">
                <picture>
                  <source srcSet="/case/create-framework.webp" type="image/webp" />
                  <img src="/case/create-framework.jpg" alt="Create Framework slide-out drawer" loading="lazy" />
                </picture>
              </div>
              <div className="case-caption">Custom framework authoring flow directly inside drawer.</div>
            </div>

            <div>
              <div className="case-step-label">Design Evolution</div>
              <div className="case-frame" style={{ maxWidth: "340px" }}>
                <picture>
                  <source srcSet="/case/catalog-early.webp" type="image/webp" />
                  <img src="/case/catalog-early.jpg" alt="Earlier iteration of the catalog drawer" loading="lazy" />
                </picture>
              </div>
              <div className="case-caption">Earlier iteration before IA refinement and hierarchy audit.</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* ── 07. CONTEXTUAL WORKFLOWS ── */}
        <section id="case-workflows" className="case-section">
          <div className="case-section-divider" />
          <div className="case-eyebrow-row">
            <span className="case-eyebrow-text">07 — Contextual Workflows</span>
            <span className="case-eyebrow-line" />
          </div>

          <div className="case-section-head-grid">
            <h2 className="case-section-title">Match the surface to the cognitive load.</h2>
            <p className="case-section-intro">
              Deciding when to keep users in a drawer versus dedicating a focused full-page experience.
            </p>
          </div>

          <div className="case-flow-split">
            {/* Full page deep work */}
            <div>
              <div className="case-step-label">Deep Work · Dedicated Full Page</div>
              <div className="case-frame" style={{ maxHeight: "440px", overflow: "hidden" }}>
                <picture>
                  <source srcSet="/case/obligation-page.webp" type="image/webp" />
                  <img src="/case/obligation-page.jpg" alt="Create Obligation comprehensive full page form" loading="lazy" />
                </picture>
              </div>
              <div className="case-chips-wrap">
                {workflowChips.map((chip) => (
                  <span key={chip} className="case-chip">
                    {chip}
                  </span>
                ))}
              </div>
              <p className="case-card-body">
                ESG mapping, statutory penalty structures, and filing schedules require deep focus, so they receive a full-page canvas.
              </p>
            </div>

            {/* Quick additions drawer */}
            <div>
              <div className="case-step-label">Quick Additions · Drawer</div>
              <div className="case-frame">
                <picture>
                  <source srcSet="/case/obligation-drawer.webp" type="image/webp" />
                  <img src="/case/obligation-drawer.jpg" alt="Obligation list with lightweight drawer" loading="lazy" />
                </picture>
              </div>
              <div className="case-caption" style={{ marginTop: "16px" }}>
                Lightweight obligation additions stay inside a slide-out drawer so the parent table remains anchored and visible.
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── 08. EDGE CASES (Warm Surface Section) ── */}
      <section id="case-edge" className="case-section case-section-tinted">
        <div className="container">
          <div className="case-eyebrow-row">
            <span className="case-eyebrow-text">08 — Edge Cases</span>
            <span className="case-eyebrow-line" />
          </div>

          <div className="case-section-head-grid">
            <h2 className="case-section-title">Empty states that guide first action.</h2>
            <p className="case-section-intro">
              An empty state shouldn't be a dead end—it should clearly communicate context and prompt the primary onboarding action.
            </p>
          </div>

          <div className="case-empty-state-frame">
            <picture>
              <source srcSet="/case/empty-state.webp" type="image/webp" />
              <img src="/case/empty-state.jpg" alt="No active frameworks empty state" loading="lazy" />
            </picture>
          </div>
        </div>
      </section>

      <div className="container">
        {/* ── 09. IMPACT & REFLECTIONS ── */}
        <section id="case-impact" className="case-section">
          <div className="case-section-divider" />
          <div className="case-eyebrow-row">
            <span className="case-eyebrow-text">09 — Impact</span>
            <span className="case-eyebrow-line" />
          </div>

          <div className="case-section-head-grid">
            <h2 className="case-section-title">Integrated into the main Blazeup platform.</h2>
            <p className="case-section-intro">
              The refined information architecture and modernized UI shipped into the production ERP core.
            </p>
          </div>

          <div className="case-overview-grid">
            <div className="case-overview-card">
              <div className="case-card-kicker">AI as a UX Partner</div>
              <h3 className="case-step-title" style={{ marginTop: "8px" }}>Auditing Logic</h3>
              <p className="case-card-body">
                Using LLMs as active critique partners helped surface ambiguous user states and challenge mental models before drawing a single pixel.
              </p>
            </div>
            <div className="case-overview-card">
              <div className="case-card-kicker">Design System Discipline</div>
              <h3 className="case-step-title" style={{ marginTop: "8px" }}>Cohesion at Scale</h3>
              <p className="case-card-body">
                Relying strictly on existing components and tokens ensured the module felt like an innate part of the broader ERP ecosystem.
              </p>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="case-footer-nav">
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                if (onBack) onBack();
                else window.location.hash = "#work";
              }}
              className="case-nav-btn case-nav-btn-prev"
            >
              <ArrowLeft size={16} />
              <span>Back to Selected Work</span>
            </a>

            <button
              type="button"
              onClick={() => {
                if (onNavigate) onNavigate('zevox');
                else window.location.hash = "#/case-study/zevox";
              }}
              className="case-nav-btn case-nav-btn-next"
            >
              <span>Next: Zevox Crypto Wallet</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
