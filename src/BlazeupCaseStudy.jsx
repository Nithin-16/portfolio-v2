import React, { useEffect, useState, useRef } from "react";
import { ArrowLeft, ArrowRight, Lock, Unlock, Eye, EyeOff } from "lucide-react";
import "./case-study.css";

/**
 * BlazeupCaseStudy Component
 * Based on the latest design & structural blueprint (Blazeup_casestudy_221026.html),
 * fully adapted to Portfolio V2's warm design system, typography, and 12-column grid.
 */
const VALID_PASSWORDS = ["blazeup", "blazeup2026", "design", "nithin"];

const chapters = [
  { id: "intro", label: "Intro" },
  { id: "stakes", label: "Problem" },
  { id: "process", label: "Process" },
  { id: "dashboard", label: "Dashboard" },
  { id: "flow", label: "Flow" },
  { id: "surfaces", label: "Surfaces" },
  { id: "edge", label: "Edge cases" },
  { id: "impact", label: "Outcome" },
];

/**
 * Interactive Before / After Image Comparison Slider
 */
function DashboardCompareSlider({ before, after }) {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="case-compare-wrap">
      <div className="case-compare-frame">
        <picture>
          <img
            src={before}
            alt="Previous compliance dashboard"
            className="case-compare-img"
            draggable="false"
          />
        </picture>
        <picture>
          <img
            src={after}
            alt="Redesigned compliance dashboard"
            className="case-compare-img"
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            draggable="false"
          />
        </picture>

        <span className="case-compare-badge-after">After</span>
        <span className="case-compare-badge-before">Before</span>

        <div className="case-compare-divider-line" style={{ left: `${sliderPos}%` }}>
          <span className="case-compare-handle">⇄</span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          aria-label="Compare the previous and redesigned dashboards"
          className="case-compare-range-input"
        />
      </div>
      <p className="case-caption">
        Drag to compare. Both are cropped to the same height; the previous dashboard ran noticeably longer.
      </p>
    </div>
  );
}

/**
 * Reusable Screenshot Pin Figure with leader lines and synchronized notes
 */
function PinFigure({ src, alt, pins, notesClassName = "case-pin-notes-grid-3", className = "" }) {
  const [active, setActive] = useState(null);

  return (
    <div className={`case-pin-figure ${className}`}>
      <div className="case-pin-container">
        <picture>
          <img src={src} alt={alt} className="case-pin-img" draggable="false" loading="lazy" />
        </picture>

        {pins.map((p, i) =>
          p.from != null ? (
            <span
              key={`leader-${i}`}
              aria-hidden="true"
              className="case-pin-leader-line"
              style={{
                top: `${p.y}%`,
                left: `${p.from}%`,
                width: `${p.x - p.from}%`,
                opacity: active === null || active === i ? 0.9 : 0.25,
              }}
            />
          ) : null
        )}

        {pins.map((p, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${i + 1}. ${p.title}`}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            onClick={() => setActive(active === i ? null : i)}
            className={`case-pin-btn ${active === i ? "is-active" : ""}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <ol className={notesClassName}>
        {pins.map((p, i) => (
          <li
            key={i}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onClick={() => setActive(active === i ? null : i)}
            className={`case-pin-note-item ${active === i ? "is-active" : ""}`}
          >
            <span className="case-pin-note-badge">{i + 1}</span>
            <div>
              <h4 className="case-pin-note-title">{p.title}</h4>
              <p className="case-pin-note-desc">{p.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function BlazeupCaseStudy({ onBack, onNavigate }) {
  // Password protection state
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

  // Reading Progress Bar & Active Chapter Tracker
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState("intro");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!isUnlocked) return;

    const updateThemeAndScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(1, Math.max(0, window.scrollY / totalHeight)));
      }
      // Subtle parallax on the drawer in hero
      if (drawerRef.current) {
        drawerRef.current.style.transform = `translateY(${Math.min(window.scrollY, 700) * -0.07}px)`;
      }

      // Check if floating chapter navigation (centered vertically at 50vh) overlaps any dark section
      const midY = window.innerHeight / 2;
      const darkSections = document.querySelectorAll(".case-band-dark");
      let isOverDark = false;
      darkSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= midY + 120 && rect.bottom >= midY - 120) {
          isOverDark = true;
        }
      });
      setIsDarkTheme(isOverDark);
    };

    updateThemeAndScroll();
    window.addEventListener("scroll", updateThemeAndScroll, { passive: true });
    window.addEventListener("resize", updateThemeAndScroll, { passive: true });

    // Chapter Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setActiveChapter(entry.target.id);
            if (entry.target.classList.contains("case-band-dark")) {
              setIsDarkTheme(true);
            }
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    chapters.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", updateThemeAndScroll);
      window.removeEventListener("resize", updateThemeAndScroll);
      observer.disconnect();
    };
  }, [isUnlocked]);

  // Section 03: Client Dashboard Pins
  const dashboardPins = [
    {
      x: 32.8,
      y: 9.1,
      from: null,
      title: "Headline numbers first",
      text: "On track, overdue, due soon, overall health and penalty exposure sit in one row, readable before any scrolling.",
    },
    {
      x: 30,
      y: 26.5,
      from: null,
      title: "Status at a glance",
      text: "A single donut shows how many obligations are on track.",
    },
    {
      x: 58,
      y: 26.5,
      from: null,
      title: "Where the risk sits",
      text: "A risk-tier breakdown (High, Medium) shows where the exposure is concentrated.",
    },
    {
      x: 86.8,
      y: 36.8,
      from: null,
      title: "Urgency without opening",
      text: "Upcoming deadlines carry PENDING and OVERDUE tags, so priority is clear at a glance.",
    },
    {
      x: 5.5,
      y: 67,
      from: null,
      title: "Framework health",
      text: "Per-framework scores show which frameworks need attention first.",
    },
    {
      x: 36.7,
      y: 67,
      from: null,
      title: "Penalties surfaced",
      text: "Unpaid and Paid tabs keep open penalties in view without leaving the dashboard.",
    },
  ];

  // Section 04: Framework Catalog Card Pins
  const catalogCardPins = [
    {
      x: 93,
      y: 13.5,
      from: 41,
      title: "Who issued it",
      text: "The issuing body (EU Commission, SEC / PCAOB) makes the jurisdiction clear before anyone adopts.",
    },
    {
      x: 93,
      y: 29.7,
      from: 46,
      title: "What it is, and how big",
      text: "A type tag (Regulation, Audit framework) and an obligation count (88, 62) show the kind of framework and the workload it adds.",
    },
    {
      x: 93,
      y: 36.2,
      from: 46,
      title: "Adoption state",
      text: "Adopted frameworks show a green tick, an explicit timestamp (“You adopted v1.3 on 25 May, 2025”) and a disabled button.",
    },
  ];

  // Section 05: Contextual Workflows Tab Switcher State
  const [surfaceMode, setSurfaceMode] = useState("drawer");
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

              {/* Access Request Note (Masked from scrapers) */}
              <div className="case-gate-hint-box">
                <span className="case-gate-hint-text">
                  For portfolio review access, please contact{" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      const u = "nithin161298";
                      const d = "gmail.com";
                      window.location.href = `mailto:${u}@${d}?subject=${encodeURIComponent("Portfolio Review Access Request · Blazeup Compliance")}`;
                    }}
                    className="case-gate-contact-link"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      color: "inherit",
                      textDecoration: "underline",
                      cursor: "pointer",
                      font: "inherit",
                    }}
                  >
                    via Email
                  </button>
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
      {/* ── Reading Progress Bar ── */}
      <div
        className="case-progress-bar"
        style={{ transform: `scaleX(${scrollProgress})` }}
        aria-hidden="true"
      />

      {/* ── Floating Chapter Navigation Sidebar (Desktop Right Rail) ── */}
      <nav
        aria-label="Chapters"
        className={`case-chapters-nav ${
          isDarkTheme || activeChapter === "stakes" || activeChapter === "impact" ? "is-dark-theme" : ""
        }`}
      >
        {chapters.map(({ id, label }) => {
          const isActive = activeChapter === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className={`case-chapter-link ${isActive ? "is-active" : ""}`}
              aria-label={`Jump to ${label} chapter`}
            >
              <span className="case-chapter-label">{label}</span>
              <span className="case-chapter-dot" />
            </button>
          );
        })}
      </nav>

      {/* ── 01. INTRO / HERO SECTION ── */}
      <section id="intro" className="case-band case-band-canvas case-hero">
        <div className="container">
          {/* Top Bar: Back Link + Re-Lock Button */}
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

          {/* Eyebrow */}
          <div className="case-eyebrow-row">
            <span className="case-eyebrow-text">Case Study · Compliance Module</span>
            <span className="case-eyebrow-line" />
          </div>

          {/* Primary Two-Tone Headline */}
          <h1 className="case-hero-title">
            <span className="case-hero-title-accent">Blazeup Compliance: </span>
            <span className="case-hero-title-subtle">Structuring Enterprise Complexity</span>
          </h1>

          {/* Lead Copy */}
          <p className="case-hero-desc">
            Turning messy regulatory tracking into a calm, transparent enterprise workflow, from an
            unrefined hackathon prototype to a module shipped inside an award-winning ERP.
          </p>

          {/* Accolade Badge */}
          <div className="case-award-badge">
            <span className="case-award-dot" />
            <span>Part of Blazeup · India’s Best Design Project 2026</span>
          </div>

          {/* Visual Showcase Card with Scroll-Driven Parallax Drawer */}
          <div className="case-hero-visual-card">
            <div className="case-hero-glow" aria-hidden="true" />
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
                  ref={drawerRef}
                  src="/case/drawer-obligation.jpg"
                  alt="Create Obligation slide-out drawer"
                  className="case-hero-drawer-img"
                  loading="eager"
                />
              </picture>
            </div>
          </div>

          {/* 4-Item Metadata Grid */}
          <div className="case-meta-grid">
            <div className="case-meta-item">
              <div className="case-meta-label">Role</div>
              <p className="case-meta-value">UI Design Intern</p>
            </div>
            <div className="case-meta-item">
              <div className="case-meta-label">Timeline</div>
              <p className="case-meta-value">May 2026 – July 2026</p>
            </div>
            <div className="case-meta-item">
              <div className="case-meta-label">Scope</div>
              <p className="case-meta-value">IA · UI execution · Design system</p>
            </div>
            <div className="case-meta-item">
              <div className="case-meta-label">Origin</div>
              <p className="case-meta-value">Terralogic hackathon project</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02. STAKES / THE PROBLEM (Dark Section) ── */}
      <section id="stakes" className="case-band case-band-dark">
        <div className="container">
          <div className="case-eyebrow-row">
            <span className="case-eyebrow-text">01 / The problem</span>
            <span className="case-eyebrow-line" />
          </div>

          <div className="case-section-head-grid">
            <h2 className="case-section-title">
              Compliance is an enterprise’s legal shield. The prototype had the logic, but not the hierarchy.
            </h2>
            <p className="case-section-intro">
              Blazeup began as an internal Terralogic hackathon project. The calculations worked, but
              hundreds of statutory obligations were visually chaotic, easy to misread and hard to triage.
            </p>
          </div>

          {/* Status Metric Pills */}
          <div className="case-pills-row">
            <span className="case-pill-dark">
              <span className="case-pill-dot" />
              Millions in regulatory exposure
            </span>
            <span className="case-pill-dark">
              <span className="case-pill-dot" />
              Multi-jurisdiction mandates
            </span>
            <span className="case-pill-dark">
              <span className="case-pill-dot" />
              Zero margin for a late filing
            </span>
          </div>

          {/* Persona Comparison Cards */}
          <div className="case-personas-grid">
            <div className="case-persona-card-dark">
              <div className="case-persona-kicker">01 / Admin side</div>
              <h3 className="case-persona-title">System Admin</h3>
              <p className="case-persona-body">
                Internal specialists who maintain the frameworks, the catalog and the obligations every client relies on.
              </p>
              <div className="case-persona-coverage-tag">
                <span className="case-persona-coverage-dot" />
                <span>Covered in 04 · Interaction flow</span>
              </div>
            </div>

            <div className="case-persona-card-dark">
              <div className="case-persona-kicker">02 / Client side</div>
              <h3 className="case-persona-title">Client User</h3>
              <p className="case-persona-body">
                Corporate compliance officers who need high-level awareness of their own active obligations, deadlines and penalties.
              </p>
              <div className="case-persona-coverage-tag">
                <span className="case-persona-coverage-dot" />
                <span>Covered in 03 · Client dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03. PROCESS (Canvas Tone) ── */}
      <section id="process" className="case-band case-band-canvas">
        <div className="container">
          <div className="case-eyebrow-row">
            <span className="case-eyebrow-text">02 / Process</span>
            <span className="case-eyebrow-line" />
          </div>

          <div className="case-section-head-grid">
            <h2 className="case-section-title">Structure first, pixels second.</h2>
            <p className="case-section-intro">
              With no documentation and no product manager to ask, I used AI as an auditing partner to question
              flows and surface edge cases, and locked the information architecture before opening Figma.
            </p>
          </div>

          {/* 5-Step Process Timeline */}
          <div className="case-timeline-grid">
            <div className="case-timeline-track" aria-hidden="true" />

            <div className="case-timeline-item">
              <div className="case-timeline-node" />
              <div className="case-timeline-step-num">01</div>
              <h4 className="case-timeline-step-title">Hackathon prototype</h4>
              <p className="case-timeline-step-desc">Working logic, no hierarchy.</p>
            </div>

            <div className="case-timeline-item">
              <div className="case-timeline-node" />
              <div className="case-timeline-step-num">02</div>
              <h4 className="case-timeline-step-title">UX audit</h4>
              <p className="case-timeline-step-desc">No PRD, no PM. Gemini and Claude as sounding boards.</p>
            </div>

            <div className="case-timeline-item">
              <div className="case-timeline-node" />
              <div className="case-timeline-step-num">03</div>
              <h4 className="case-timeline-step-title">IA locked</h4>
              <p className="case-timeline-step-desc">Structure and entity relationships agreed first.</p>
            </div>

            <div className="case-timeline-item">
              <div className="case-timeline-node" />
              <div className="case-timeline-step-num">04</div>
              <h4 className="case-timeline-step-title">UI in Figma</h4>
              <p className="case-timeline-step-desc">Built on the Blazeup design system.</p>
            </div>

            <div className="case-timeline-item">
              <div className="case-timeline-node is-complete" />
              <div className="case-timeline-step-num">05</div>
              <h4 className="case-timeline-step-title">Shipped</h4>
              <p className="case-timeline-step-desc">Integrated into the core platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 04. MACRO LAYOUT · CLIENT SIDE (Warm Tinted Band) ── */}
      <section id="dashboard" className="case-band case-band-warm">
        <div className="container">
          <div className="case-eyebrow-row">
            <span className="case-eyebrow-text">03 / Macro layout · Client side</span>
            <span className="case-eyebrow-line" />
          </div>

          <div className="case-section-head-grid">
            <h2 className="case-section-title">The client dashboard: what needs attention right now?</h2>
            <p className="case-section-intro">
              This is the view for the client tracking their own compliance, not the admin side where frameworks
              and obligations are set up.
            </p>
          </div>

          {/* Subheading: Inside the Dashboard */}
          <div className="case-sub-header-block">
            <div className="case-sub-kicker">Inside the dashboard</div>
            <h3 className="case-sub-title">Dense compliance data, readable at a glance.</h3>
          </div>

          {/* Interactive Before/After Comparison Slider */}
          <DashboardCompareSlider
            before="/case/dashboard-before.jpg"
            after="/case/dashboard.jpg"
          />

          {/* 4 Dashboard Consolidation / Improvement Cards */}
          <div className="case-consolidation-grid">
            <div className="case-consolidation-item">
              <h4 className="case-consolidation-title">Fewer stacked panels</h4>
              <p className="case-consolidation-desc">
                The long run of separate cards, including an empty Penalty Exposure panel, is consolidated so the key content fits higher on the page.
              </p>
            </div>
            <div className="case-consolidation-item">
              <h4 className="case-consolidation-title">Health you can read</h4>
              <p className="case-consolidation-desc">
                Framework health moved from a row of mostly N/A gauges to a ranked list of scores.
              </p>
            </div>
            <div className="case-consolidation-item">
              <h4 className="case-consolidation-title">Urgency is explicit</h4>
              <p className="case-consolidation-desc">
                Deadlines now carry PENDING and OVERDUE tags, with overdue rows picked out in red.
              </p>
            </div>
            <div className="case-consolidation-item">
              <h4 className="case-consolidation-title">Actions where they belong</h4>
              <p className="case-consolidation-desc">
                Rows of bright orange buttons became a quiet Quick Links list, so the page leads with data rather than calls to action.
              </p>
            </div>
          </div>

          {/* Client Dashboard 6-Pin Interactive Figure */}
          <PinFigure
            src="/case/dashboard.webp"
            alt="Client compliance dashboard"
            pins={dashboardPins}
            notesClassName="case-pin-notes-grid-3"
          />
        </div>
      </section>

      {/* ── 05. INTERACTION FLOW · ADMIN SIDE (Canvas Tone) ── */}
      <section id="flow" className="case-band case-band-canvas">
        <div className="container">
          <div className="case-eyebrow-row">
            <span className="case-eyebrow-text">04 / Interaction flow · Admin side</span>
            <span className="case-eyebrow-line" />
          </div>

          <div className="case-section-head-grid">
            <h2 className="case-section-title">Keeping users in context.</h2>
            <p className="case-section-intro">
              Admins needed to manage active frameworks and also browse and adopt new ones, without losing their place in the system.
            </p>
          </div>

          {/* 3 Step Overview Cards */}
          <div className="case-admin-flow-cards">
            <div className="case-admin-flow-card">
              <div className="case-admin-flow-num">01</div>
              <h4 className="case-admin-flow-title">Manage in the table</h4>
              <p className="case-admin-flow-desc">Admins work from the frameworks table.</p>
            </div>
            <div className="case-admin-flow-card">
              <div className="case-admin-flow-num">02</div>
              <h4 className="case-admin-flow-title">Click Browse Catalog</h4>
              <p className="case-admin-flow-desc">The catalog drawer opens over the table, so the table never disappears.</p>
            </div>
            <div className="case-admin-flow-card">
              <div className="case-admin-flow-num">03</div>
              <h4 className="case-admin-flow-title">Inspect, then adopt</h4>
              <p className="case-admin-flow-desc">Each framework can be read and adopted without leaving the page.</p>
            </div>
          </div>

          {/* Main Catalog Drawer Frame */}
          <div className="case-frame">
            <picture>
              <source srcSet="/case/catalog.webp" type="image/webp" />
              <img
                src="/case/catalog.jpg"
                alt="Browse Framework Catalog drawer open over the frameworks table"
                loading="lazy"
              />
            </picture>
          </div>

          {/* Subheading: Inside the Drawer */}
          <div className="case-sub-header-block">
            <div className="case-sub-kicker">Inside the drawer</div>
            <h3 className="case-sub-title">Making each framework readable before you adopt it.</h3>
          </div>

          {/* Side-by-side Before/After Catalog Card Comparison */}
          <div className="case-catalog-split-grid">
            {/* Before (Left: 4 Cols) */}
            <div className="case-catalog-before-col">
              <div className="case-catalog-state-label">Before</div>
              <div className="case-frame">
                <picture>
                  <source srcSet="/case/catalog-early.webp" type="image/webp" />
                  <img src="/case/catalog-early.jpg" alt="Earlier catalog drawer" loading="lazy" />
                </picture>
              </div>
              <p className="case-caption" style={{ marginTop: "16px" }}>
                Just a name, a version and a short description. Nothing about who issued it, what kind of framework it is, how big it is, or whether and when it was adopted.
              </p>
              <p className="case-catalog-critique-tag">✕ Unclear jurisdiction · No type · No adoption info</p>
            </div>

            {/* After (Right: 8 Cols) */}
            <div>
              <div className="case-catalog-state-label" style={{ color: "var(--text-primary)" }}>After</div>
              <PinFigure
                src="/case/catalog-card.webp"
                alt="Framework catalog cards with issuer, type, obligation count and adoption state"
                pins={catalogCardPins}
                notesClassName="case-pin-notes-grid-1"
              />
            </div>
          </div>

          {/* Reused Drawer Pattern Grid */}
          <div className="case-drawer-reused-grid">
            <div>
              <h3 className="case-workflow-info-title">One drawer pattern, reused</h3>
              <p className="case-workflow-info-desc">
                Creating a custom framework uses the same slide-out pattern, so adopting and authoring feel like one system.
              </p>
            </div>
            <div className="case-frame">
              <picture>
                <source srcSet="/case/create-framework.webp" type="image/webp" />
                <img src="/case/create-framework.jpg" alt="Create Framework drawer" loading="lazy" />
              </picture>
            </div>
          </div>
        </div>
      </section>

      {/* ── 06. CONTEXTUAL WORKFLOWS (Warm Tinted Band) ── */}
      <section id="surfaces" className="case-band case-band-warm">
        <div className="container">
          <div className="case-eyebrow-row">
            <span className="case-eyebrow-text">05 / Contextual workflows</span>
            <span className="case-eyebrow-line" />
          </div>

          <div className="case-section-head-grid">
            <h2 className="case-section-title">Match the surface to the cognitive load.</h2>
            <p className="case-section-intro">
              Deciding when to keep users inside a lightweight drawer versus dedicating a focused full-page experience.
            </p>
          </div>

          {/* Interactive Pill Mode Switcher */}
          <div className="case-tabs-pill-row" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={surfaceMode === "drawer"}
              onClick={() => setSurfaceMode("drawer")}
              className={`case-tab-btn ${surfaceMode === "drawer" ? "is-active" : ""}`}
            >
              Quick add · Drawer
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={surfaceMode === "page"}
              onClick={() => setSurfaceMode("page")}
              className={`case-tab-btn ${surfaceMode === "page" ? "is-active" : ""}`}
            >
              Deep work · Full page
            </button>
          </div>

          {/* Split Content View */}
          <div className="case-workflows-split">
            {/* Description & Chips */}
            <div>
              {surfaceMode === "drawer" ? (
                <div>
                  <h3 className="case-workflow-info-title">Stay in the list</h3>
                  <p className="case-workflow-info-desc">
                    Lightweight obligation additions stay inside a slide-out drawer so the master table
                    remains visible and anchored behind it.
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="case-workflow-info-title">Give heavy work a canvas</h3>
                  <p className="case-workflow-info-desc">
                    ESG mapping, penalty structures, and filing schedules need focus, so they get a dedicated full page.
                    Scroll inside the frame to explore it.
                  </p>
                  <div className="case-chips-wrap">
                    {workflowChips.map((chip) => (
                      <span key={chip} className="case-chip">
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Scrollable Mockup Frame */}
            <div className="case-workflow-scroll-frame">
              {surfaceMode === "drawer" ? (
                <picture>
                  <source srcSet="/case/obligation-drawer.webp" type="image/webp" />
                  <img
                    src="/case/obligation-drawer.jpg"
                    alt="Create Obligation drawer"
                    loading="lazy"
                  />
                </picture>
              ) : (
                <picture>
                  <source srcSet="/case/obligation-page.webp" type="image/webp" />
                  <img
                    src="/case/obligation-page.jpg"
                    alt="Create Obligation full page"
                    loading="lazy"
                  />
                </picture>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 07. EDGE CASES (Canvas Tone) ── */}
      <section id="edge" className="case-band case-band-canvas">
        <div className="container">
          <div className="case-eyebrow-row">
            <span className="case-eyebrow-text">06 / Edge cases</span>
            <span className="case-eyebrow-line" />
          </div>

          <div className="case-section-head-grid">
            <h2 className="case-section-title">An empty state should never be a dead end.</h2>
            <p className="case-section-intro">
              When no frameworks are adopted, the screen says what it is and prompts the first action: adopt a framework.
            </p>
          </div>

          {/* Elevated Empty State Card */}
          <div className="case-edge-showcase">
            <div className="case-edge-inner-card">
              <picture>
                <source srcSet="/case/empty-state.webp" type="image/webp" />
                <img
                  src="/case/empty-state.jpg"
                  alt="No active frameworks empty state"
                  loading="lazy"
                />
              </picture>
            </div>
          </div>
        </div>
      </section>

      {/* ── 08. IMPACT & OUTCOME (Dark Section) ── */}
      <section id="impact" className="case-band case-band-dark">
        <div className="container">
          <div className="case-eyebrow-row">
            <span className="case-eyebrow-text">07 / Outcome</span>
            <span className="case-eyebrow-line" />
          </div>

          <div className="case-section-head-grid">
            <h2 className="case-section-title">Shipped into the Blazeup core platform.</h2>
            <p className="case-section-intro">
              The refined information architecture and modernised UI were integrated into the production ERP.
              This project laid the foundation for my ongoing product design work at Lollypop and Swantech.
            </p>
          </div>

          {/* 3 Outcome Cards */}
          <div className="case-impact-cards-grid">
            <div className="case-impact-card">
              <div className="case-impact-num">01 / AI as a UX partner</div>
              <h4 className="case-impact-title">Auditing Logic</h4>
              <p className="case-impact-body">
                Using LLMs as critique partners surfaced ambiguous states and challenged my mental model before I drew a pixel.
              </p>
            </div>

            <div className="case-impact-card">
              <div className="case-impact-num">02 / Design system discipline</div>
              <h4 className="case-impact-title">Cohesion at Scale</h4>
              <p className="case-impact-body">
                Sticking to existing components and tokens made the module feel native to the wider ERP.
              </p>
            </div>

            <div className="case-impact-card">
              <div className="case-impact-num">03 / Graphic design is a superpower</div>
              <h4 className="case-impact-title">Clarity in Complexity</h4>
              <p className="case-impact-body">
                My visual background shaped the type hierarchy and layout system for dense data. B2B software doesn’t have to look boring.
              </p>
            </div>
          </div>

          {/* Footer Navigation */}
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
                if (onNavigate) onNavigate("zevox");
                else window.location.hash = "#/case-study/zevox";
              }}
              className="case-nav-btn case-nav-btn-next"
            >
              <span>Next: Zevox Crypto Wallet</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
