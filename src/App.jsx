import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { ArrowRight, ArrowUpRight, ArrowDown, Mail, Copy, Check, X, Sliders, RotateCcw } from 'lucide-react';
import './styles.css';

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [copied, setCopied] = useState(false);
  const lenisRef = useRef(null);
  const isClickScrollingRef = useRef(false);

  // About section comparison & preview toggle state (Default: Option 01 Light Canvas)
  const [activeVariants, setActiveVariants] = useState({
    v1: true,
    v2: false,
    v3: false,
  });
  const [toolboxExpanded, setToolboxExpanded] = useState(false);
  const [handwritingActive, setHandwritingActive] = useState(false);
  const portraitWrapRef = useRef(null);

  const replayHandwriting = () => {
    setHandwritingActive(false);
    setTimeout(() => {
      setHandwritingActive(true);
    }, 60);
  };

  useEffect(() => {
    const el = portraitWrapRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHandwritingActive(true);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [activeVariants.v1]);

  const toggleVariant = (key) => {
    setActiveVariants((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      // Prevent disabling all (keep at least one active)
      if (!next.v1 && !next.v2 && !next.v3) return prev;
      return next;
    });
  };

  const soloVariant = (key) => {
    if (key === 'all') {
      setActiveVariants({ v1: true, v2: true, v3: true });
    } else {
      setActiveVariants({
        v1: key === 'v1',
        v2: key === 'v2',
        v3: key === 'v3',
      });
    }
  };

  useEffect(() => {
    // Initialize Lenis for luxurious momentum smooth scrolling across the entire site
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.8,
    });

    lenisRef.current = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Scroll listener directly wired to Lenis & native fallback
    const updateScrollState = (y) => {
      setScrolled(y > 50);

      // Do not override activeSection while smooth-scrolling from a direct click
      if (isClickScrollingRef.current) return;

      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // When reaching near the bottom of the page, guarantee Contact is active
      if (y + windowHeight >= docHeight - 80) {
        setActiveSection('contact');
        return;
      }

      // Probing line at ~35% of viewport height (just beneath floating navbar)
      const probeY = y + 220;

      const workEl = document.getElementById('work');
      const aboutEl = document.getElementById('about');
      const contactEl = document.getElementById('contact');

      if (!workEl || !aboutEl || !contactEl) return;

      const currentScroll = window.scrollY || document.documentElement.scrollTop || 0;
      const workTop = workEl.getBoundingClientRect().top + currentScroll;
      const aboutTop = aboutEl.getBoundingClientRect().top + currentScroll;
      const contactTop = contactEl.getBoundingClientRect().top + currentScroll;

      if (probeY >= contactTop - 60) {
        setActiveSection('contact');
      } else if (probeY >= aboutTop - 40) {
        setActiveSection('about');
      } else if (probeY >= workTop - 60) {
        setActiveSection('work');
      } else {
        setActiveSection(''); // In Hero section
      }
    };

    const onScroll = ({ scroll }) => {
      updateScrollState(scroll);
    };

    const onNativeScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      updateScrollState(y);
    };

    lenis.on('scroll', onScroll);
    window.addEventListener('scroll', onNativeScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onNativeScroll);
      lenis.destroy();
    };
  }, []);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    if (!targetId) {
      setActiveSection('');
      isClickScrollingRef.current = true;
      setTimeout(() => {
        isClickScrollingRef.current = false;
      }, 1150);

      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { duration: 1.1 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const target = document.getElementById(targetId);
    if (!target) return;

    // Instantly highlight the clicked section and lock active indicator during scroll animation
    setActiveSection(targetId);
    isClickScrollingRef.current = true;
    setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 1150);

    // Target the prime visual content anchor within each section for pixel-perfect landing
    let anchor = target;
    let clearance = 95; // 70px navbar bottom + 25px breathing room

    if (targetId === 'work') {
      anchor = target.querySelector('.work-header-wrap') || target;
      clearance = 95;
    } else if (targetId === 'about') {
      anchor = target.querySelector('.about-top-grid') || target;
      clearance = 95;
    } else if (targetId === 'contact') {
      anchor = target.querySelector('.contact-card') || target;
      clearance = 85;
    }

    const currentScroll = window.scrollY || document.documentElement.scrollTop || 0;
    const targetY = Math.max(0, anchor.getBoundingClientRect().top + currentScroll - clearance);

    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetY, { duration: 1.1 });
    } else {
      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('nithin.kumar@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="portfolio-app">

      {/* ── NAVIGATION ────────────────────────────────── */}
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-pill">

            {/* Left: Brand Logo & Divider */}
            <div className="nav-left">
              <a
                href="#"
                onClick={(e) => handleSmoothScroll(e, '')}
                className="brand-mark"
                aria-label="Nithin Kumar"
              >
                <span className="brand-badge">
                  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M5 23V5L23 23V5"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                    />
                  </svg>
                </span>
              </a>

              {/* Vertical Divider (revealed in floating pill) */}
              <span className="nav-pill-divider" aria-hidden="true" />
            </div>

            {/* Center: Nav links */}
            <nav className="nav-links">
              <a
                href="#work"
                onClick={(e) => handleSmoothScroll(e, 'work')}
                className={`nav-link ${activeSection === 'work' ? 'active' : ''}`}
              >
                Work
              </a>
              <a
                href="#about"
                onClick={(e) => handleSmoothScroll(e, 'about')}
                className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
              >
                About me
              </a>
              <a
                href="#contact"
                onClick={(e) => handleSmoothScroll(e, 'contact')}
                className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
              >
                Contact
              </a>
            </nav>

            {/* Right: Signature dark Resume Pill Button (adapts seamlessly) */}
            <div className="nav-actions">
              <a
                href="/Nithin-Kumar-Resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="nav-resume"
              >
                <span>Resume</span>
                <span className="nav-resume-arrow">↓</span>
              </a>
            </div>

          </div>
        </div>
      </header>

      <main>

        {/* ── HERO ───────────────────────────────────────── */}
        <section className="hero-section">

          {/* Ambient animated light streaks background */}
          <div className="hero-ambient-bg" aria-hidden="true">
            {/* Contrast depth underlays */}
            <div className="ambient-depth-shadow shadow-1" />
            <div className="ambient-depth-shadow shadow-2" />

            {/* Glowing light streak beams */}
            <div className="ambient-streak streak-beam-main" />
            <div className="ambient-streak streak-beam-sharp" />
            <div className="ambient-streak streak-beam-secondary" />
            <div className="ambient-streak streak-beam-cross" />
            <div className="ambient-streak streak-beam-ribbon" />
            <div className="ambient-streak streak-beam-accent" />

            {/* Ambient radiant light pools */}
            <div className="ambient-glow-source glow-top" />
            <div className="ambient-glow-source glow-center" />
          </div>

          {/* Center content */}
          <div className="hero-inner">

            {/* Eyebrow — small caps only */}
            <p className="hero-eyebrow">UI / UX Designer</p>

            {/* Name — Mask reveal typography */}
            <h1 className="hero-name" aria-label="Nithin Kumar.">
              <span className="hero-name-mask">
                <span className="hero-name-word word-1">Nithin&nbsp;</span>
              </span>
              <span className="hero-name-mask">
                <span className="hero-name-word word-2">
                  Kumar<span className="hero-name-period">.</span>
                </span>
              </span>
            </h1>

            {/* Tagline — Proportional headline-adjacent scale */}
            <p className="hero-tagline">
              I design digital experiences that<br />
              feel simple, useful and human.
            </p>

            {/* CTA — label on left, circle outline with masked downward scroll arrow on right */}
            <a
              href="#work"
              onClick={(e) => handleSmoothScroll(e, 'work')}
              className="hero-cta"
            >
              <span className="hero-cta-label">View My Work</span>
              <span className="hero-cta-circle">
                <span className="hero-cta-arrow-track">
                  <ArrowDown size={18} className="hero-cta-arrow" />
                </span>
              </span>
            </a>

          </div>

        </section>

        {/* ── SELECTED WORK ──────────────────────────────── */}
        <section id="work" className="work-section">
          <div className="container">

            {/* Header: Eyebrow + 2-Column Title / Desc */}
            <div className="work-header-wrap">
              <div className="work-eyebrow-row">
                <span className="work-eyebrow-text">SELECTED WORK</span>
                <span className="work-eyebrow-line" />
              </div>

              <div className="work-header-cols">
                <h2 className="work-headline">
                  Thoughtful products.<br />
                  Real user problems.
                </h2>
                <p className="work-header-desc">
                  A few selected projects where I've applied user research, design thinking and visual design to build meaningful digital experiences.
                </p>
              </div>
            </div>

            {/* Work Cards Grid */}
            <div className="work-grid">

              {/* 01 / 03: Blazeup — Full Width Featured Card */}
              <a href="http://localhost:5174" target="_blank" rel="noreferrer" className="work-featured-card">
                <div className="work-featured-content">
                  <span className="work-card-counter">01 / 03</span>

                  <div className="work-featured-body">
                    <span className="work-card-category">FINTECH &amp; B2B SAAS</span>
                    <h3 className="work-card-title">Blazeup</h3>
                    <p className="work-card-desc">
                      Turning complex compliance workflows into a simple, intuitive experience for modern businesses.
                    </p>
                  </div>

                  <div className="work-card-cta">
                    <span>View case study</span>
                    <ArrowRight size={14} className="work-cta-arrow" />
                  </div>
                </div>
              </a>

              {/* Row 2: Two equal sub-cards (Log9 & Altavista) */}
              <div className="work-subcards-row">

                {/* 02 / 03: Log9 */}
                <a href="#log9" className="work-subcard">
                  <div className="work-subcard-visual">
                    <img
                      src="/log9-visual@2x.png"
                      alt="Log9 branding and visual identity preview"
                      className="work-subcard-img"
                    />
                  </div>
                  <div className="work-subcard-footer">
                    <div className="work-subcard-meta">
                      <span className="work-subcard-num">02 / 03</span>
                      <span className="work-subcard-cat">BRANDING &amp; VISUAL IDENTITY</span>
                    </div>
                    <div className="work-subcard-main">
                      <div className="work-subcard-text">
                        <h3 className="work-subcard-name">Log9</h3>
                        <p className="work-subcard-summary">
                          Building a bold and modern visual identity for a next-gen EV battery company.
                        </p>
                      </div>
                      <div className="work-subcard-cta">
                        <span>View project</span>
                        <ArrowRight size={14} className="work-cta-arrow" />
                      </div>
                    </div>
                  </div>
                </a>

                {/* 03 / 03: Altavista */}
                <a href="#altavista" className="work-subcard">
                  <div className="work-subcard-visual">
                    <img
                      src="/altavista-visual@2x.png"
                      alt="Altavista travel discovery app concept"
                      className="work-subcard-img"
                    />
                  </div>
                  <div className="work-subcard-footer">
                    <div className="work-subcard-meta">
                      <span className="work-subcard-num">03 / 03</span>
                      <span className="work-subcard-cat">CONSUMER APP &amp; BRANDING</span>
                    </div>
                    <div className="work-subcard-main">
                      <div className="work-subcard-text">
                        <h3 className="work-subcard-name">Altavista</h3>
                        <p className="work-subcard-summary">
                          A travel discovery app concept designed for curious explorers and modern travellers.
                        </p>
                      </div>
                      <div className="work-subcard-cta">
                        <span>View project</span>
                        <ArrowRight size={14} className="work-cta-arrow" />
                      </div>
                    </div>
                  </div>
                </a>

              </div>

            </div>

          </div>
        </section>

        {/* ── ABOUT & EXPERIENCE SECTION (3-Version Interactive Preview) ── */}
        <section id="about" className="about-comparison-section">

          {/* ══════════════════════════════════════════════════════
              OPTION 01: LIGHT CANVAS (Current Minimal Layout)
              ══════════════════════════════════════════════════════ */}
          {activeVariants.v1 && (
            <div className="about-section about-version-light">
              <div className="container">
                {[activeVariants.v1, activeVariants.v2, activeVariants.v3].filter(Boolean).length > 1 && (
                  <div className="version-banner">
                    <div className="version-tag">
                      <span className="version-tag-dot" />
                      <span>Option 01: Light Canvas (Current Minimal)</span>
                    </div>
                    <span className="version-desc">Light cream background · Minimal horizontal divider strokes</span>
                  </div>
                )}

              {/* Top Block: Portrait + About Info */}
              <div className="about-top-grid">
                <div className="about-portrait-wrap" ref={portraitWrapRef}>
                  <img
                    src="/about-portrait-clean@2x.png"
                    alt="Nithin Kumar - UI/UX Designer"
                    className="about-portrait-img"
                  />
                  {/* Animated SVG Handwriting: "Design Build Improve" + Scribble */}
                  <svg
                    className={`about-handwriting-svg ${handwritingActive ? 'is-drawn' : ''}`}
                    viewBox="0 0 622 600"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Handwritten note: Design, Build, Improve"
                    onClick={replayHandwriting}
                    title="Click to replay handwriting animation"
                  >
                    <g transform="translate(24, 388) rotate(-19.5 65 85)">
                      {/* ── Line 1: Design ── */}
                      <g className="hw-group hw-design">
                        <path
                          className="hw-stroke hw-d-cap"
                          d="M 42 27 C 39 30, 35 38, 33 48 C 32 52, 35 53, 38 51 C 49 44, 57 28, 46 24 C 38 22, 30 31, 30 40"
                          pathLength="100"
                        />
                        <path
                          className="hw-stroke hw-d-esign"
                          d="M 48 45 C 50 42, 53 38, 56 39 C 58 40, 56 46, 52 47 C 55 47, 58 45, 61 41 C 63 38, 64 43, 62 46 C 61 47, 59 48, 64 45 C 66 41, 69 40, 69 44 C 69 46, 68 48, 71 44 C 74 41, 76 40, 75 43 C 74 47, 70 48, 69 51 C 67 55, 70 61, 73 58 C 75 55, 76 47, 79 44 C 81 41, 84 40, 84 44 C 84 47, 85 49, 87 45 C 89 41, 92 40, 92 44 C 92 47, 93 48, 97 45"
                          pathLength="100"
                        />
                        <circle className="hw-dot hw-d-dot" cx="69" cy="35" r="1.3" />
                      </g>

                      {/* ── Line 2: Build ── */}
                      <g className="hw-group hw-build">
                        <path
                          className="hw-stroke hw-b-spine"
                          d="M 38 65 C 36 71, 33 80, 31 89"
                          pathLength="100"
                        />
                        <path
                          className="hw-stroke hw-b-lobes"
                          d="M 32 66 C 37 64, 46 64, 46 70 C 46 74, 40 76, 34 76 C 41 76, 47 77, 47 83 C 47 88, 38 89, 32 88"
                          pathLength="100"
                        />
                        <path
                          className="hw-stroke hw-b-uild"
                          d="M 44 83 C 46 80, 49 78, 49 82 C 49 86, 52 87, 55 83 C 57 79, 59 78, 59 82 C 59 85, 61 86, 64 82 C 65 79, 70 69, 71 64 C 72 63, 71 68, 69 77 C 68 82, 71 85, 74 82 C 77 79, 76 84, 78 85 C 80 86, 81 83, 82 80 C 83 73, 86 65, 87 63 C 87 64, 86 73, 85 81 C 85 84, 87 86, 92 82"
                          pathLength="100"
                        />
                        <circle className="hw-dot hw-b-dot" cx="60" cy="74" r="1.3" />
                      </g>

                      {/* ── Line 3: Improve ── */}
                      <g className="hw-group hw-improve">
                        <path
                          className="hw-stroke hw-i-cap"
                          d="M 22 101 C 26 99, 36 99, 35 102 C 34 104, 30 104, 30 108 C 29 113, 27 122, 23 126 C 22 128, 25 127, 29 123"
                          pathLength="100"
                        />
                        <path
                          className="hw-stroke hw-i-mprove"
                          d="M 33 118 C 34 114, 36 113, 36 117 C 36 120, 37 122, 39 118 C 41 114, 43 113, 43 117 C 43 121, 45 122, 47 118 C 49 113, 51 112, 51 117 C 51 121, 52 123, 55 119 C 57 115, 59 113, 58 118 C 57 123, 53 135, 51 141 C 50 142, 53 138, 55 129 C 56 123, 59 116, 63 116 C 66 116, 66 121, 63 123 C 60 125, 58 122, 63 119 C 65 116, 68 114, 70 117 C 71 118, 71 121, 74 117 C 77 113, 80 112, 80 117 C 80 121, 76 123, 73 120 C 76 117, 79 114, 83 114 C 86 114, 87 118, 88 120 C 89 121, 91 118, 93 115 C 96 111, 100 110, 101 113 C 101 116, 97 119, 95 119 C 97 119, 101 116, 107 112"
                          pathLength="100"
                        />
                      </g>

                      {/* ── Line 4: Scribble Underline ── */}
                      <g className="hw-group hw-scribble-group">
                        <path
                          className="hw-stroke hw-scribble-path"
                          d="M 16 142 C 30 139, 52 138, 72 136 C 85 135, 96 133, 104 133 C 92 137, 68 141, 48 144 C 60 143, 78 141, 92 139"
                          pathLength="100"
                        />
                      </g>
                    </g>
                  </svg>
                </div>

                <div className="about-content-col">
                  <div className="about-eyebrow-row">
                    <span className="about-eyebrow-text">03. &nbsp;ABOUT &amp; CURRENT FOCUS</span>
                    <span className="about-eyebrow-line" />
                  </div>

                  <h2 className="about-headline">
                    Curious by nature.<br />
                    Intentional by design.
                  </h2>

                  <p className="about-bio-desc">
                    I’m a UI/UX designer who enjoys turning complex problems into simple, intuitive experiences. I care about the little details that make a big difference.
                  </p>

                  <div className="about-social-links">
                    <a href="https://linkedin.com/in/nithin-kumar" target="_blank" rel="noreferrer" className="about-social-pill">
                      <svg className="social-icon" viewBox="0 0 448 512" fill="currentColor">
                        <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
                      </svg>
                      <span>LinkedIn</span>
                      <ArrowUpRight size={13} className="social-arrow" />
                    </a>

                    <a href="https://behance.net" target="_blank" rel="noreferrer" className="about-social-pill">
                      <svg className="social-icon" viewBox="0 0 576 512" fill="currentColor">
                        <path d="M232 237.2c31.8-15.2 48.4-38.2 48.4-74 0-70.6-52.6-92.1-113.8-92.1H0v369.8h177.7c67.1 0 126.3-26.6 126.3-108.5 0-47.6-26.9-78.2-72-95.2zm-136-105h59.4c31.8 0 54.9 10 54.9 45.4 0 32.7-21.4 49.3-54.9 49.3H96v-94.7zm65.9 239.5H96v-99.3h65.9c35.6 0 60.7 15.6 60.7 50.1 0 37.8-24.9 49.2-60.7 49.2zm301.7-184.2c-73.4 0-128.7 54.6-128.7 129.5 0 74.4 53.6 127 131.8 127 58.1 0 102.5-30.8 119.5-83.6h-59.2c-8 17.8-27.2 31.8-59.8 31.8-40.4 0-66.7-24.8-69.5-62.8h191.1c1.3-8.8 2-17.6 2-26.3 0-65.7-41.2-115.6-127.2-115.6zm-66.2 96.6c4.6-32.9 27.2-50.1 64.9-50.1 36.6 0 58.1 17.8 61.9 50.1h-126.8zM417.8 91.5h119.4v38.9H417.8V91.5z" />
                      </svg>
                      <span>Behance</span>
                      <ArrowUpRight size={13} className="social-arrow" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom Block: Experience */}
              <div className="about-exp-grid">
                <div className="about-exp-left">
                  <div className="about-eyebrow-row">
                    <span className="about-eyebrow-text">EXPERIENCE / CURRENT FOCUS</span>
                    <span className="about-eyebrow-line" />
                  </div>

                  <h2 className="about-exp-headline">
                    Recent roles and<br />
                    where I’m headed.
                  </h2>

                  <p className="about-exp-desc">
                    I’m currently focused on growing as a product designer, working on real problems, and learning from great people.
                  </p>
                </div>

                <div className="about-exp-right">
                  <div className="exp-row">
                    <span className="exp-num">01</span>
                    <div className="exp-main-col">
                      <h3 className="exp-company-name">Lollypop Design Studio</h3>
                      <p className="exp-role-date">UI/UX Intern &nbsp;·&nbsp; Feb 2026 – Present</p>
                    </div>
                    <span className="exp-type-badge">INTERNSHIP</span>
                  </div>

                  <div className="exp-row">
                    <span className="exp-num">02</span>
                    <div className="exp-main-col">
                      <h3 className="exp-company-name">Swantech Solutions</h3>
                      <p className="exp-role-date">Visual Designer &nbsp;·&nbsp; Sep 2023 – Present</p>
                    </div>
                    <span className="exp-type-badge">FULL TIME</span>
                  </div>

                  <div className="exp-row">
                    <span className="exp-num">03</span>
                    <div className="exp-main-col">
                      <h3 className="exp-company-name">Log9 Materials</h3>
                      <p className="exp-role-date">Graphic Designer → Creative Lead &nbsp;·&nbsp; Jul 2021 – Jul 2023</p>
                    </div>
                    <span className="exp-type-badge">FULL TIME</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {activeVariants.v1 && (activeVariants.v2 || activeVariants.v3) && (
            <div className="version-separator">
              <div className="version-sep-line" />
            </div>
          )}

          {/* ══════════════════════════════════════════════════════
              OPTION 02: FULL-WIDTH DARK BREAKER (100vw Bleed)
              ══════════════════════════════════════════════════════ */}
          {activeVariants.v2 && (
          <div className="about-version-fullwidth">
            <div className="about-decor-left" aria-hidden="true">
              <svg viewBox="0 0 300 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M -60 40 C 140 160, 200 420, 40 600" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.2" />
                <circle cx="152" cy="285" r="3.5" fill="#88B896" />
              </svg>
            </div>
            <div className="about-decor-right" aria-hidden="true">
              <svg viewBox="0 0 300 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 360 80 C 160 220, 160 440, 360 600" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1.2" />
                <circle cx="196" cy="380" r="3" fill="rgba(136, 184, 150, 0.6)" />
              </svg>
            </div>

            <div className="container">
              {[activeVariants.v1, activeVariants.v2, activeVariants.v3].filter(Boolean).length > 1 && (
                <div className="version-banner version-banner-dark">
                  <div className="version-tag">
                    <span className="version-tag-dot" />
                    <span>Option 02: Full-Width Dark Breaker (100vw Bleed)</span>
                  </div>
                  <span className="version-desc">Deep green #151D18 · 48px grid · Side ambient arcs with green dots</span>
                </div>
              )}

              {/* Top Block: Portrait + About Info */}
              <div className="about-top-grid">
                <div className="about-portrait-wrap">
                  <img
                    src="/portrait-about.jpg"
                    alt="Nithin Kumar - UI/UX Designer"
                    className="about-portrait-img"
                  />
                </div>

                <div className="about-content-col">
                  <div className="about-eyebrow-row">
                    <span className="about-eyebrow-text">03. &nbsp;ABOUT &amp; CURRENT FOCUS</span>
                    <span className="about-eyebrow-line" />
                  </div>

                  <h2 className="about-headline">
                    Curious by nature.<br />
                    Intentional by design.
                  </h2>

                  <p className="about-bio-desc">
                    I’m a UI/UX designer who enjoys turning complex problems into simple, intuitive experiences. I care about the little details that make a big difference.
                  </p>

                  <div className="about-social-links">
                    <a href="https://linkedin.com/in/nithin-kumar" target="_blank" rel="noreferrer" className="about-social-pill">
                      <svg className="social-icon" viewBox="0 0 448 512" fill="currentColor">
                        <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
                      </svg>
                      <span>LinkedIn</span>
                      <ArrowUpRight size={13} className="social-arrow" />
                    </a>

                    <a href="https://behance.net" target="_blank" rel="noreferrer" className="about-social-pill">
                      <svg className="social-icon" viewBox="0 0 576 512" fill="currentColor">
                        <path d="M232 237.2c31.8-15.2 48.4-38.2 48.4-74 0-70.6-52.6-92.1-113.8-92.1H0v369.8h177.7c67.1 0 126.3-26.6 126.3-108.5 0-47.6-26.9-78.2-72-95.2zm-136-105h59.4c31.8 0 54.9 10 54.9 45.4 0 32.7-21.4 49.3-54.9 49.3H96v-94.7zm65.9 239.5H96v-99.3h65.9c35.6 0 60.7 15.6 60.7 50.1 0 37.8-24.9 49.2-60.7 49.2zm301.7-184.2c-73.4 0-128.7 54.6-128.7 129.5 0 74.4 53.6 127 131.8 127 58.1 0 102.5-30.8 119.5-83.6h-59.2c-8 17.8-27.2 31.8-59.8 31.8-40.4 0-66.7-24.8-69.5-62.8h191.1c1.3-8.8 2-17.6 2-26.3 0-65.7-41.2-115.6-127.2-115.6zm-66.2 96.6c4.6-32.9 27.2-50.1 64.9-50.1 36.6 0 58.1 17.8 61.9 50.1h-126.8zM417.8 91.5h119.4v38.9H417.8V91.5z" />
                      </svg>
                      <span>Behance</span>
                      <ArrowUpRight size={13} className="social-arrow" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom Block: Experience */}
              <div className="about-exp-grid">
                <div className="about-exp-left">
                  <div className="about-eyebrow-row">
                    <span className="about-eyebrow-text">EXPERIENCE / CURRENT FOCUS</span>
                    <span className="about-eyebrow-line" />
                  </div>

                  <h2 className="about-exp-headline">
                    Recent roles and<br />
                    where I’m headed.
                  </h2>

                  <p className="about-exp-desc">
                    I’m currently focused on growing as a product designer, working on real problems, and learning from great people.
                  </p>
                </div>

                <div className="about-exp-right">
                  <div className="exp-row">
                    <span className="exp-num">01</span>
                    <div className="exp-main-col">
                      <h3 className="exp-company-name">Lollypop Design Studio</h3>
                      <p className="exp-role-date">UI/UX Intern &nbsp;·&nbsp; Feb 2026 – Present</p>
                    </div>
                    <span className="exp-type-badge">INTERNSHIP</span>
                  </div>

                  <div className="exp-row">
                    <span className="exp-num">02</span>
                    <div className="exp-main-col">
                      <h3 className="exp-company-name">Swantech Solutions</h3>
                      <p className="exp-role-date">Visual Designer &nbsp;·&nbsp; Sep 2023 – Present</p>
                    </div>
                    <span className="exp-type-badge">FULL TIME</span>
                  </div>

                  <div className="exp-row">
                    <span className="exp-num">03</span>
                    <div className="exp-main-col">
                      <h3 className="exp-company-name">Log9 Materials</h3>
                      <p className="exp-role-date">Graphic Designer → Creative Lead &nbsp;·&nbsp; Jul 2021 – Jul 2023</p>
                    </div>
                    <span className="exp-type-badge">FULL TIME</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {activeVariants.v2 && activeVariants.v3 && (
            <div className="version-separator">
              <div className="version-sep-line" />
            </div>
          )}

          {/* ══════════════════════════════════════════════════════
              OPTION 03: CONTAINED DARK CARD (Same Width)
              ══════════════════════════════════════════════════════ */}
          {activeVariants.v3 && (
          <div className="about-version-contained">
            <div className="container">
              {[activeVariants.v1, activeVariants.v2, activeVariants.v3].filter(Boolean).length > 1 && (
                <div className="version-banner">
                  <div className="version-tag">
                    <span className="version-tag-dot" />
                    <span>Option 03: Contained Feature Card (Same Width)</span>
                  </div>
                  <span className="version-desc">Self-contained card · Organic velvet gradients · No grid / arcs</span>
                </div>
              )}

              <div className="about-card">
                {/* Top Block: Portrait + About Info */}
                <div className="about-top-grid">
                  <div className="about-portrait-wrap">
                    <img
                      src="/portrait-about.jpg"
                      alt="Nithin Kumar - UI/UX Designer"
                      className="about-portrait-img"
                    />
                  </div>

                  <div className="about-content-col">
                    <div className="about-eyebrow-row">
                      <span className="about-eyebrow-text">03. &nbsp;ABOUT &amp; CURRENT FOCUS</span>
                      <span className="about-eyebrow-line" />
                    </div>

                    <h2 className="about-headline">
                      Curious by nature.<br />
                      Intentional by design.
                    </h2>

                    <p className="about-bio-desc">
                      I’m a UI/UX designer who enjoys turning complex problems into simple, intuitive experiences. I care about the little details that make a big difference.
                    </p>

                    <div className="about-social-links">
                      <a href="https://linkedin.com/in/nithin-kumar" target="_blank" rel="noreferrer" className="about-social-pill">
                        <svg className="social-icon" viewBox="0 0 448 512" fill="currentColor">
                          <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
                        </svg>
                        <span>LinkedIn</span>
                        <ArrowUpRight size={13} className="social-arrow" />
                      </a>

                      <a href="https://behance.net" target="_blank" rel="noreferrer" className="about-social-pill">
                        <svg className="social-icon" viewBox="0 0 576 512" fill="currentColor">
                          <path d="M232 237.2c31.8-15.2 48.4-38.2 48.4-74 0-70.6-52.6-92.1-113.8-92.1H0v369.8h177.7c67.1 0 126.3-26.6 126.3-108.5 0-47.6-26.9-78.2-72-95.2zm-136-105h59.4c31.8 0 54.9 10 54.9 45.4 0 32.7-21.4 49.3-54.9 49.3H96v-94.7zm65.9 239.5H96v-99.3h65.9c35.6 0 60.7 15.6 60.7 50.1 0 37.8-24.9 49.2-60.7 49.2zm301.7-184.2c-73.4 0-128.7 54.6-128.7 129.5 0 74.4 53.6 127 131.8 127 58.1 0 102.5-30.8 119.5-83.6h-59.2c-8 17.8-27.2 31.8-59.8 31.8-40.4 0-66.7-24.8-69.5-62.8h191.1c1.3-8.8 2-17.6 2-26.3 0-65.7-41.2-115.6-127.2-115.6zm-66.2 96.6c4.6-32.9 27.2-50.1 64.9-50.1 36.6 0 58.1 17.8 61.9 50.1h-126.8zM417.8 91.5h119.4v38.9H417.8V91.5z" />
                        </svg>
                        <span>Behance</span>
                        <ArrowUpRight size={13} className="social-arrow" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Bottom Block: Experience */}
                <div className="about-exp-grid">
                  <div className="about-exp-left">
                    <div className="about-eyebrow-row">
                      <span className="about-eyebrow-text">EXPERIENCE / CURRENT FOCUS</span>
                      <span className="about-eyebrow-line" />
                    </div>

                    <h2 className="about-exp-headline">
                      Recent roles and<br />
                      where I’m headed.
                    </h2>

                    <p className="about-exp-desc">
                      I’m currently focused on growing as a product designer, working on real problems, and learning from great people.
                    </p>
                  </div>

                  <div className="about-exp-right">
                    <div className="exp-row">
                      <span className="exp-num">01</span>
                      <div className="exp-main-col">
                        <h3 className="exp-company-name">Lollypop Design Studio</h3>
                        <p className="exp-role-date">UI/UX Intern &nbsp;·&nbsp; Feb 2026 – Present</p>
                      </div>
                      <span className="exp-type-badge">INTERNSHIP</span>
                    </div>

                    <div className="exp-row">
                      <span className="exp-num">02</span>
                      <div className="exp-main-col">
                        <h3 className="exp-company-name">Swantech Solutions</h3>
                        <p className="exp-role-date">Visual Designer &nbsp;·&nbsp; Sep 2023 – Present</p>
                      </div>
                      <span className="exp-type-badge">FULL TIME</span>
                    </div>

                    <div className="exp-row">
                      <span className="exp-num">03</span>
                      <div className="exp-main-col">
                        <h3 className="exp-company-name">Log9 Materials</h3>
                        <p className="exp-role-date">Graphic Designer → Creative Lead &nbsp;·&nbsp; Jul 2021 – Jul 2023</p>
                      </div>
                      <span className="exp-type-badge">FULL TIME</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

        </section>

        {/* ── ADDITIONAL WORK ─────────────────────────────── */}
        <section id="additional-work" className="additional-section">
          <div className="container">

            {/* Header: Eyebrow + 2-Column Headline & Note */}
            <div className="additional-header-wrap">
              <div className="additional-eyebrow-row">
                <span className="additional-eyebrow-text">04. &nbsp;ADDITIONAL WORK</span>
                <span className="additional-eyebrow-line" />
              </div>

              <div className="additional-header-cols">
                <h2 className="additional-headline">
                  Side projects.<br />
                  Real interests.
                </h2>
                <p className="additional-header-desc">
                  A few other projects I’ve worked on — from brand identity and visual exploration to freelance work that keeps me curious and creative.
                </p>
              </div>
            </div>

            {/* 3-Card Grid */}
            <div className="additional-cards-grid">

              {/* Card 1: Log9 */}
              <a href="#log9" className="additional-card">
                <div className="additional-card-visual">
                  <img
                    src="/additional-log9@2x.png"
                    alt="Log9 branding and visual identity"
                    className="additional-card-img"
                  />
                </div>
                <div className="additional-card-body">
                  <div>
                    <span className="additional-card-category">BRANDING &amp; VISUAL IDENTITY</span>
                    <h3 className="additional-card-title">Log9</h3>
                    <p className="additional-card-desc">
                      Built a cohesive brand identity for a next-gen EV battery company, including logo, typography, color system and brand collateral.
                    </p>
                  </div>
                  <div className="additional-card-cta">
                    <span>View project</span>
                    <ArrowRight size={14} className="additional-cta-arrow" />
                  </div>
                </div>
              </a>

              {/* Card 2: Altavista */}
              <a href="#altavista" className="additional-card">
                <div className="additional-card-visual">
                  <img
                    src="/additional-altavista@2x.png"
                    alt="Altavista travel discovery concept"
                    className="additional-card-img"
                  />
                </div>
                <div className="additional-card-body">
                  <div>
                    <span className="additional-card-category">UI/UX DESIGN (CONCEPT)</span>
                    <h3 className="additional-card-title">Altavista</h3>
                    <p className="additional-card-desc">
                      A travel discovery app concept designed for curious explorers and modern travellers.
                    </p>
                  </div>
                  <div className="additional-card-cta">
                    <span>View project</span>
                    <ArrowRight size={14} className="additional-cta-arrow" />
                  </div>
                </div>
              </a>

              {/* Card 3: Tiny Veda */}
              <a href="#tiny-veda" className="additional-card">
                <div className="additional-card-visual">
                  <img
                    src="/additional-tinyveda@2x.png"
                    alt="Tiny Veda baby food brand and packaging"
                    className="additional-card-img"
                  />
                </div>
                <div className="additional-card-body">
                  <div>
                    <span className="additional-card-category">BRAND CONSULTING &amp; PACKAGING</span>
                    <h3 className="additional-card-title">Tiny Veda</h3>
                    <p className="additional-card-desc">
                      Explored a premium baby food brand concept rooted in ancient wisdom and modern nutrition.
                    </p>
                  </div>
                  <div className="additional-card-cta">
                    <span>View project</span>
                    <ArrowRight size={14} className="additional-cta-arrow" />
                  </div>
                </div>
              </a>

            </div>

          </div>
        </section>

        {/* ── CONTACT & FOOTER SECTION (Floating Card) ─────── */}
        <section id="contact" className="contact-section">
          <div className="container">

            <div className="contact-card">

              {/* Corner Geometric Arcs & Orbiting Green Dot */}
              {/* Corner Geometric Arcs & Two Orbiting Green Dots */}
              <div className="contact-decor-tr" aria-hidden="true">
                <svg viewBox="0 0 340 340" fill="none" className="contact-arc-tr">
                  <circle
                    cx="340"
                    cy="0"
                    r="255"
                    stroke="rgba(255, 255, 255, 0.12)"
                    strokeWidth="1.2"
                  />
                  {/* Two flat green dots orbiting along the circle path */}
                  <g>
                    <circle cx="85" cy="0" r="4" fill="#88B896" />
                    <circle cx="595" cy="0" r="4" fill="#88B896" />
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 340 0"
                      to="360 340 0"
                      dur="12s"
                      repeatCount="indefinite"
                    />
                  </g>
                </svg>
              </div>

              <div className="contact-decor-bl" aria-hidden="true">
                <svg viewBox="0 0 340 340" fill="none" className="contact-arc-bl">
                  <circle
                    cx="0"
                    cy="340"
                    r="255"
                    stroke="rgba(255, 255, 255, 0.12)"
                    strokeWidth="1.2"
                  />
                  {/* Two flat green dots orbiting along the bottom-left circle path */}
                  <g>
                    <circle cx="0" cy="85" r="4" fill="#88B896" />
                    <circle cx="0" cy="595" r="4" fill="#88B896" />
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 0 340"
                      to="360 0 340"
                      dur="12s"
                      repeatCount="indefinite"
                    />
                  </g>
                </svg>
              </div>

              {/* Main Card Content */}
              <div className="contact-card-content">
                <div className="contact-eyebrow-row">
                  <span className="contact-eyebrow-text">05. &nbsp;CONTACT</span>
                  <span className="contact-eyebrow-line" />
                </div>

                <h2 className="contact-headline">
                  Let’s build<br />
                  something great.
                </h2>

                <p className="contact-desc">
                  I’m always open to conversations about product design, collaborations, or just a good design chat.
                </p>

                {/* Interactive Email Pill */}
                <div className="contact-email-pill">
                  <a
                    href="mailto:nithin.kumar@gmail.com"
                    className="contact-email-link"
                    aria-label="Send email to nithin.kumar@gmail.com"
                  >
                    <Mail size={16} className="contact-email-icon" />
                    <span>nithin.kumar@gmail.com</span>
                  </a>

                  <span className="contact-email-sep" />

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="contact-copy-btn"
                    aria-label="Copy email address"
                  >
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                    {copied ? <Check size={14} className="copy-icon-active" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Frosted-Glass Bottom Bar Sitting Inside Card */}
              <div className="contact-bottom-strip">
                <div className="contact-footer-container">

                  {/* Brand / Role */}
                  <div className="footer-col footer-col-brand">
                    <h3 className="footer-brand-name">Nithin Kumar.</h3>
                    <span className="footer-brand-role">UI/UX DESIGNER</span>
                  </div>

                  {/* Quick Links */}
                  <div className="footer-col">
                    <span className="footer-col-title">QUICK LINKS</span>
                    <div className="footer-col-links">
                      <a href="#work">Work</a>
                      <a href="#about">About</a>
                      <a href="/Nithin-Kumar-Resume.pdf" target="_blank" rel="noreferrer">
                        Resume ↓
                      </a>
                    </div>
                  </div>

                  {/* Socials */}
                  <div className="footer-col">
                    <span className="footer-col-title">SOCIALS</span>
                    <div className="footer-col-links">
                      <a href="https://linkedin.com/in/nithin-kumar" target="_blank" rel="noreferrer">
                        LinkedIn
                      </a>
                      <a href="https://behance.net" target="_blank" rel="noreferrer">
                        Behance
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="footer-col footer-col-location">
                    <span className="footer-col-title">LOCATION</span>
                    <span className="footer-location-val">Bengaluru, India</span>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* ── INTERACTIVE PREVIEW TOOLBOX ──────────────────────── */}
      <aside className="preview-toolbox" aria-label="Variation Preview Controls">
        {!toolboxExpanded ? (
          <button
            type="button"
            className="toolbox-pill-trigger"
            onClick={() => setToolboxExpanded(true)}
            title="Open variations preview toolbox"
          >
            <span className="toolbox-pulse-dot" />
            <Sliders size={15} className="toolbox-icon" />
            <span className="toolbox-trigger-label">Preview Options</span>
            <span className="toolbox-active-count">
              {[activeVariants.v1, activeVariants.v2, activeVariants.v3].filter(Boolean).length}/3
            </span>
          </button>
        ) : (
          <div className="toolbox-card">
            {/* Header */}
            <div className="toolbox-header">
              <div className="toolbox-title-group">
                <div className="toolbox-header-dot" />
                <div>
                  <h4 className="toolbox-title">About Variations</h4>
                  <p className="toolbox-subtitle">Compare live in full-page flow</p>
                </div>
              </div>
              <button
                type="button"
                className="toolbox-close-btn"
                onClick={() => setToolboxExpanded(false)}
                title="Minimize toolbox"
              >
                <X size={15} />
              </button>
            </div>

            {/* Quick Presets / Solo */}
            <div className="toolbox-presets-row">
              <span className="toolbox-section-label">QUICK PRESET</span>
              <div className="toolbox-presets-grid">
                <button
                  type="button"
                  className={`toolbox-preset-btn ${
                    activeVariants.v1 && activeVariants.v2 && activeVariants.v3 ? 'active' : ''
                  }`}
                  onClick={() => soloVariant('all')}
                >
                  All 3 Stacked
                </button>
                <button
                  type="button"
                  className={`toolbox-preset-btn ${
                    activeVariants.v1 && !activeVariants.v2 && !activeVariants.v3 ? 'active' : ''
                  }`}
                  onClick={() => soloVariant('v1')}
                >
                  Opt 01 Only
                </button>
                <button
                  type="button"
                  className={`toolbox-preset-btn ${
                    !activeVariants.v1 && activeVariants.v2 && !activeVariants.v3 ? 'active' : ''
                  }`}
                  onClick={() => soloVariant('v2')}
                >
                  Opt 02 Only
                </button>
                <button
                  type="button"
                  className={`toolbox-preset-btn ${
                    !activeVariants.v1 && !activeVariants.v2 && activeVariants.v3 ? 'active' : ''
                  }`}
                  onClick={() => soloVariant('v3')}
                >
                  Opt 03 Only
                </button>
              </div>
            </div>

            {/* Toggle checkboxes */}
            <div className="toolbox-toggles-section">
              <span className="toolbox-section-label">CUSTOM TOGGLE</span>

              {/* Item 1 */}
              <label className={`toolbox-toggle-item ${activeVariants.v1 ? 'is-active' : ''}`}>
                <input
                  type="checkbox"
                  checked={activeVariants.v1}
                  onChange={() => toggleVariant('v1')}
                  className="toolbox-checkbox"
                />
                <div className="toolbox-item-meta">
                  <span className="toolbox-item-num">01</span>
                  <div>
                    <span className="toolbox-item-name">Light Canvas</span>
                    <span className="toolbox-item-desc">Minimal · Clean divider lines</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="toolbox-solo-mini"
                  onClick={(e) => {
                    e.preventDefault();
                    soloVariant('v1');
                  }}
                  title="Solo Option 1"
                >
                  Solo
                </button>
              </label>

              {/* Item 2 */}
              <label className={`toolbox-toggle-item ${activeVariants.v2 ? 'is-active' : ''}`}>
                <input
                  type="checkbox"
                  checked={activeVariants.v2}
                  onChange={() => toggleVariant('v2')}
                  className="toolbox-checkbox"
                />
                <div className="toolbox-item-meta">
                  <span className="toolbox-item-num">02</span>
                  <div>
                    <span className="toolbox-item-name">Dark Full-Bleed</span>
                    <span className="toolbox-item-desc">100vw bleed · 48px grid · Side arcs</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="toolbox-solo-mini"
                  onClick={(e) => {
                    e.preventDefault();
                    soloVariant('v2');
                  }}
                  title="Solo Option 2"
                >
                  Solo
                </button>
              </label>

              {/* Item 3 */}
              <label className={`toolbox-toggle-item ${activeVariants.v3 ? 'is-active' : ''}`}>
                <input
                  type="checkbox"
                  checked={activeVariants.v3}
                  onChange={() => toggleVariant('v3')}
                  className="toolbox-checkbox"
                />
                <div className="toolbox-item-meta">
                  <span className="toolbox-item-num">03</span>
                  <div>
                    <span className="toolbox-item-name">Contained Dark Card</span>
                    <span className="toolbox-item-desc">Container width · Velvet glow</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="toolbox-solo-mini"
                  onClick={(e) => {
                    e.preventDefault();
                    soloVariant('v3');
                  }}
                  title="Solo Option 3"
                >
                  Solo
                </button>
              </label>
            </div>

            {/* Footer Actions: Jump & Replay */}
            <div className="toolbox-footer-action">
              <a
                href="#about"
                className="toolbox-jump-btn"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById('about');
                  if (target) {
                    if (lenisRef.current) {
                      lenisRef.current.scrollTo(target, { offset: -30, duration: 1.2 });
                    } else {
                      target.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
              >
                <span>Jump to About Section</span>
                <ArrowRight size={13} />
              </a>

              {activeVariants.v1 && (
                <button
                  type="button"
                  className="toolbox-replay-btn"
                  onClick={replayHandwriting}
                  title="Replay handwriting & scribble animation"
                >
                  <RotateCcw size={12} />
                  <span>Replay Scribble</span>
                </button>
              )}
            </div>
          </div>
        )}
      </aside>

    </div>
  );
}

