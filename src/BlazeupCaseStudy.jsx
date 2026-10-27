import React, { useEffect, useState, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "./case-study.css";

/**
 * BlazeupCaseStudy Component
 * Based on the latest design & structural blueprint (Blazeup_casestudy_221026.html),
 * fully adapted to Portfolio V2's warm design system, typography, and 12-column grid.
 */

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

/**
 * Reusable Before & After badges
 */
function BeforeTag() {
  return <span className="case-tag-before">Before</span>;
}

function AfterTag() {
  return (
    <span className="case-tag-after">
      <span className="case-tag-after-dot" />
      After
    </span>
  );
}

/**
 * Reusable Up-Close Comparison Row for deep-dive changes
 */
function UpcloseChange({ n, title, line, b, bw, a, aw, altB, altA }) {
  return (
    <div className="case-upclose-row">
      <div className="case-upclose-meta">
        <span className="case-upclose-num">0{n}</span>
        <h4 className="case-upclose-title">{title}</h4>
        <p className="case-upclose-desc">{line}</p>
      </div>
      <div
        className="case-upclose-compare-grid"
        style={{
          "--cols": bw && aw ? `${bw}fr ${aw}fr` : "1fr 1fr",
        }}
      >
        <div className="min-w-0">
          <BeforeTag />
          <div className="case-frame" style={{ marginTop: "12px" }}>
            <img src={b} alt={altB || `${title}, before`} className="case-img-responsive" draggable="false" loading="lazy" />
          </div>
        </div>
        <div className="min-w-0">
          <AfterTag />
          <div className="case-frame" style={{ marginTop: "12px" }}>
            <img src={a} alt={altA || `${title}, after`} className="case-img-responsive" draggable="false" loading="lazy" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Actions Merge Flow Comparison Row
 */
function ActionsMergeChange() {
  return (
    <div className="case-upclose-row">
      <div className="case-upclose-meta">
        <span className="case-upclose-num">01</span>
        <h4 className="case-upclose-title">Actions</h4>
        <p className="case-upclose-desc">
          The page title with its subtext, the orange header buttons and the Quick Actions bar sat outside the design system. I merged them into one Quick Links list.
        </p>
      </div>
      <div>
        <BeforeTag />
        <div className="case-frame" style={{ marginTop: "12px", backgroundColor: "#F9FAFB", padding: "clamp(10px, 1.5vw, 20px)" }}>
          <img
            src="/case/dc-b1a.jpg"
            alt="Old dashboard header with title, subtext and orange buttons"
            className="case-img-responsive"
            draggable="false"
            loading="lazy"
          />
        </div>
        <div className="case-frame" style={{ marginTop: "12px" }}>
          <img
            src="/case/dc-b1b.jpg"
            alt="Old Quick Actions bar with orange buttons"
            className="case-img-responsive"
            draggable="false"
            loading="lazy"
          />
        </div>
        <div className="case-merge-divider">
          <span className="case-merge-line" />
          <span className="case-merge-label">Merged into ↓</span>
          <span className="case-merge-line" />
        </div>
        <AfterTag />
        <div className="case-frame" style={{ marginTop: "12px", maxWidth: "440px" }}>
          <img
            src="/case/dc-a1.jpg"
            alt="Quick Links list"
            className="case-img-responsive"
            draggable="false"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

export default function BlazeupCaseStudy({ onBack, onNavigate }) {
  // Reading Progress Bar & Active Chapter Tracker
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState("intro");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const drawerRef = useRef(null);

  // Always start at top of case study on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const t = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 40);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
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
  }, []);

  // Section 05 View State
  const [surfaceMode, setSurfaceMode] = useState("compare");
  const workflowChips = [
    "Basic information",
    "Schedule",
    "Penalty",
    "Filing guidance",
    "ESG",
    "Evidence config",
    "Alert template",
  ];

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
          {/* Top Bar: Back Link + Case Category Badge */}
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

            <div className="case-lock-status-btn" style={{ cursor: "default" }}>
              <span>Case Study 01 · Enterprise SaaS</span>
            </div>
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
              <p className="case-meta-value">May 2026 – August 2026</p>
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

          {/* Macro Side-by-Side Comparison */}
          <div className="case-macro-split-grid">
            <div>
              <BeforeTag />
              <div className="case-frame" style={{ marginTop: "12px" }}>
                <img
                  src="/case/dashboard-before.jpg"
                  alt="Previous compliance dashboard"
                  className="case-img-responsive"
                  draggable="false"
                />
              </div>
            </div>
            <div>
              <AfterTag />
              <div className="case-frame" style={{ marginTop: "12px" }}>
                <img
                  src="/case/dashboard.jpg"
                  alt="Redesigned compliance dashboard"
                  className="case-img-responsive"
                  draggable="false"
                />
              </div>
            </div>
          </div>

          {/* Three changes, up close */}
          <div className="case-upclose-section">
            <p className="case-upclose-kicker">Three changes, up close</p>
            <ActionsMergeChange />
            <UpcloseChange
              n={2}
              title="Framework health"
              line="A row of mostly N/A gauges became ranked scores."
              b="/case/dc-b2.jpg"
              bw={818}
              a="/case/dc-a2.jpg"
              aw={430}
              altB="Old framework health gauge widgets with N/A scores"
              altA="Redesigned ranked framework scores"
            />
            <UpcloseChange
              n={3}
              title="Deadlines"
              line="Every item read PENDING. Now overdue ones stand out in red."
              b="/case/dc-b3.jpg"
              bw={428}
              a="/case/dc-a3.jpg"
              aw={522}
              altB="Old deadlines table with identical PENDING tags"
              altA="Redesigned deadlines with explicit red OVERDUE tags"
            />
          </div>
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
          <div className="case-sub-header-block" style={{ marginTop: "clamp(56px, 7vw, 96px)" }}>
            <div className="case-sub-kicker">Inside the drawer</div>
            <h3 className="case-sub-title">Making each framework readable before you adopt it.</h3>
          </div>

          {/* Macro Catalog Card Comparison: Side-by-side */}
          <div className="case-macro-split-grid">
            <div>
              <BeforeTag />
              <div className="case-frame" style={{ marginTop: "12px" }}>
                <img
                  src="/case/ce-b0.jpg"
                  alt="Catalog card before"
                  className="case-img-responsive"
                  draggable="false"
                />
              </div>
            </div>
            <div>
              <AfterTag />
              <div className="case-frame" style={{ marginTop: "12px" }}>
                <img
                  src="/case/ce-a0.jpg"
                  alt="Catalog card after"
                  className="case-img-responsive"
                  draggable="false"
                />
              </div>
            </div>
          </div>

          {/* Three changes, up close */}
          <div className="case-upclose-section">
            <p className="case-upclose-kicker">Three changes, up close</p>
            <UpcloseChange
              n={1}
              title="Who issued it"
              line="The issuing body (EU Commission, SEC / PCAOB) makes the jurisdiction clear."
              b="/case/ce-b1.jpg"
              bw={472}
              a="/case/ce-a1.jpg"
              aw={472}
              altB="Old card with missing issuing body and jurisdiction"
              altA="Redesigned card with clear issuing body badge"
            />
            <UpcloseChange
              n={2}
              title="What it is, how big"
              line="A type tag and an obligation count show the kind of framework and the workload it adds."
              b="/case/ce-b2.jpg"
              bw={472}
              a="/case/ce-a2.jpg"
              aw={472}
              altB="Old card without type tag or obligation count"
              altA="Redesigned card displaying regulation type and obligation count"
            />
            <UpcloseChange
              n={3}
              title="Adoption state"
              line="A green tick and a timestamp replace a bare disabled button."
              b="/case/ce-b3.jpg"
              bw={472}
              a="/case/ce-a3.jpg"
              aw={472}
              altB="Old card with generic disabled button"
              altA="Redesigned card with green adoption checkmark and explicit timestamp"
            />
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
          <div className="case-tabs-pill-row" role="tablist" aria-label="Workflow surface switcher">
            <button
              type="button"
              role="tab"
              aria-selected={surfaceMode === "compare"}
              onClick={() => setSurfaceMode("compare")}
              className={`case-tab-btn ${surfaceMode === "compare" ? "is-active" : ""}`}
            >
              Side by Side
            </button>
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

          {/* Panels Grid */}
          <div className={`case-surface-panels-grid ${surfaceMode !== "compare" ? "is-single-panel" : ""}`}>
            {(surfaceMode === "compare" || surfaceMode === "drawer") && (
              <div className="case-surface-panel">
                <span className="case-surface-panel-kicker">Quick add · Drawer</span>
                <h3 className="case-surface-panel-title">Stay in the list</h3>
                <p className="case-surface-panel-desc">
                  Lightweight additions open in a slide-out drawer, so the master table stays visible behind it.
                </p>
                <div className="case-surface-pills-row">
                  <span className="case-surface-pill">List stays visible</span>
                  <span className="case-surface-pill">Lightweight form</span>
                </div>
                <div className="case-surface-preview-frame">
                  <picture>
                    <source srcSet="/case/obligation-drawer.webp" type="image/webp" />
                    <img
                      src="/case/obligation-drawer.jpg"
                      alt="Create Obligation drawer"
                      className="case-surface-preview-img is-cover"
                      draggable="false"
                      loading="lazy"
                    />
                  </picture>
                </div>
              </div>
            )}

            {(surfaceMode === "compare" || surfaceMode === "page") && (
              <div className="case-surface-panel">
                <span className="case-surface-panel-kicker">Deep work · Full page</span>
                <h3 className="case-surface-panel-title">Give heavy work a canvas</h3>
                <p className="case-surface-panel-desc">
                  ESG mapping, penalty structures and filing schedules get a dedicated page. Scroll inside the frame to explore.
                </p>
                <div className="case-surface-pills-row">
                  {workflowChips.map((chip) => (
                    <span key={chip} className="case-surface-pill">
                      {chip}
                    </span>
                  ))}
                </div>
                <div className="case-surface-preview-frame is-scrollable">
                  <picture>
                    <source srcSet="/case/obligation-page.webp" type="image/webp" />
                    <img
                      src="/case/obligation-page.jpg"
                      alt="Create Obligation full page"
                      className="case-surface-preview-img is-natural"
                      draggable="false"
                      loading="lazy"
                    />
                  </picture>
                </div>
                <p className="case-caption" style={{ marginTop: "10px" }}>
                  Scroll inside the frame for the full form.
                </p>
              </div>
            )}
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
