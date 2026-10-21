import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "./case-study.css";

/**
 * ZevoxCaseStudy Component
 * An open, warm-canvas continuous Behance-style case study presentation
 * for Zevox - A Crypto-Enabled Fintech Wallet.
 * Features the project header and metadata, followed immediately by
 * all 11 high-resolution presentation slices flowing continuously one below another.
 */
export default function ZevoxCaseStudy({ onBack, onNavigate }) {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Reading progress tracker (ink tone matching Blazeup)
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(1, Math.max(0, window.scrollY / totalHeight)));
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const metadata = [
    { label: "Role", value: "UI / UX Designer & Visual Identity" },
    { label: "Scope", value: "Mobile App, Design System, Visa Debit Card" },
    { label: "Product", value: "Zevox, a crypto-enabled fintech wallet" },
    { label: "Focus", value: "Cross-border payments & remittances" },
  ];

  const presentationSlices = [
    {
      id: "cover",
      webp: "/case/zevox/01-cover.webp",
      jpg: "/case/zevox/01-cover.jpg",
      alt: "ZEVOX — Exchange effortlessly. Where Payments Move Simply Without Borders",
    },
    {
      id: "overview",
      webp: "/case/zevox/02-project-overview.webp",
      jpg: "/case/zevox/02-project-overview.jpg",
      alt: "Zevox Project Overview — Global Payments Without Borders",
    },
    {
      id: "branding",
      webp: "/case/zevox/03-branding-intro.webp",
      jpg: "/case/zevox/03-branding-intro.jpg",
      alt: "Zevox Brand Experience on Mobile Device",
    },
    {
      id: "timeline",
      webp: "/case/zevox/04-timeline.webp",
      jpg: "/case/zevox/04-timeline.jpg",
      alt: "Design Process & Timeline — Discovery, Design, Delivery",
    },
    {
      id: "principles",
      webp: "/case/zevox/05-key-insights.webp",
      jpg: "/case/zevox/05-key-insights.jpg",
      alt: "Platform Principles — Transparency Wins, Simplicity Matters, Flexibility Required",
    },
    {
      id: "problem",
      webp: "/case/zevox/06-problem-statement.webp",
      jpg: "/case/zevox/06-problem-statement.jpg",
      alt: "Problem Statement & Solution Framework",
    },
    {
      id: "typography",
      webp: "/case/zevox/07-typography.webp",
      jpg: "/case/zevox/07-typography.jpg",
      alt: "Typography & Color Tokens — Geist Sans and Electric Purple System",
    },
    {
      id: "screens",
      webp: "/case/zevox/08-screens.webp",
      jpg: "/case/zevox/08-screens.jpg",
      alt: "Detailed Mobile Application Screens & Feature Architecture",
    },
    {
      id: "mockups",
      webp: "/case/zevox/09-mockups.webp",
      jpg: "/case/zevox/09-mockups.jpg",
      alt: "Application Mockups & Isometric Device Views",
    },
    {
      id: "card",
      webp: "/case/zevox/10-physical-card.webp",
      jpg: "/case/zevox/10-physical-card.jpg",
      alt: "Hardware Packaging, Tablet Experience & Zevox Visa Debit Card",
    },
    {
      id: "thankyou",
      webp: "/case/zevox/11-thank-you.webp",
      jpg: "/case/zevox/11-thank-you.jpg",
      alt: "Thanks For Scrolling — Zevox Crypto-Enabled Fintech Wallet",
    },
  ];

  return (
    <div className="case-study-page">
      {/* ── Reading Progress Bar ── */}
      <div
        className="case-progress-bar"
        style={{ transform: `scaleX(${scrollProgress})` }}
        aria-hidden="true"
      />

      <div className="container">
        {/* ── Top Bar: Back Link + Open Status Badge ── */}
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
            <span>Case Study 02 · Open Project</span>
          </div>
        </div>

        {/* ── 01. CASE HERO ── */}
        <section className="case-hero" style={{ paddingBottom: "24px" }}>
          <div className="case-eyebrow-row">
            <span className="case-eyebrow-text">02 — Case Study · Cross-Border Fintech</span>
            <span className="case-eyebrow-line" />
          </div>

          <h1 className="case-hero-title">
            <span className="case-hero-title-accent">Zevox:</span>
            <br />
            Where Payments Move Simply Without Borders
          </h1>

          <p className="case-hero-desc">
            A crypto-enabled fintech wallet designed to make global remittances effortless, transparent,
            and reliable. Engineered with modern cryptographic rails, intuitive UX, and an integrated
            physical Visa debit card experience.
          </p>

          <div className="case-award-badge">
            <span className="case-award-dot" />
            <span>Case Study 02 · Cross-Border Fintech Platform</span>
          </div>

          {/* Metadata Grid (Focused purely on designer, no collaborators) */}
          <div className="case-meta-grid" style={{ marginBottom: "32px" }}>
            {metadata.map((item) => (
              <div key={item.label} className="case-meta-item">
                <div className="case-meta-label">{item.label}</div>
                <p className="case-meta-value">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CONTINUOUS VERTICAL BEHANCE STREAM (Images One After Another) ── */}
        <section className="zevox-flow-stream" aria-label="Zevox Case Study Presentation Slices">
          {presentationSlices.map((slice, index) => (
            <div key={slice.id} className="zevox-flow-slice">
              <picture>
                <source srcSet={slice.webp} type="image/webp" />
                <img
                  src={slice.jpg}
                  alt={slice.alt}
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding={index < 2 ? "sync" : "async"}
                />
              </picture>
            </div>
          ))}
        </section>

        {/* ── BOTTOM NAVIGATION ── */}
        <footer className="case-footer-nav" style={{ marginTop: "64px", paddingBottom: "96px" }}>
          <button
            type="button"
            onClick={() => {
              if (onNavigate) onNavigate("blazeup");
              else window.location.hash = "#/case-study/blazeup";
            }}
            className="case-nav-btn case-nav-btn-prev"
          >
            <ArrowLeft size={16} />
            <span>← Previous: Blazeup Compliance</span>
          </button>

          <a
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              if (onBack) onBack();
              else window.location.hash = "#work";
            }}
            className="case-nav-btn"
          >
            <span>Back to Selected Work</span>
          </a>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate("contact");
              else if (onBack) onBack();
              else window.location.hash = "#contact";
            }}
            className="case-nav-btn case-nav-btn-next"
          >
            <span>Let's talk about product design</span>
            <ArrowRight size={16} />
          </a>
        </footer>
      </div>
    </div>
  );
}
