import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { ArrowLeft, ArrowRight, ArrowUpRight, ArrowDown, Mail, Copy, Check, Lock } from 'lucide-react';
import BlazeupCaseStudy from './BlazeupCaseStudy.jsx';
import ZevoxCaseStudy from './ZevoxCaseStudy.jsx';
import './case-study.css';
import './styles.css';

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [copied, setCopied] = useState(false);
  const lenisRef = useRef(null);
  const isClickScrollingRef = useRef(false);
  const [navInitial, setNavInitial] = useState(true);

  // Case study hash routing
  const getViewFromHash = () => {
    const h = window.location.hash;
    if (h === '#/case-study/blazeup' || h === '#blazeup' || h === '#case-study-blazeup') return 'blazeup';
    if (h === '#/case-study/zevox' || h === '#zevox' || h === '#case-study-zevox') return 'zevox';
    return 'home';
  };

  const [currentView, setCurrentView] = useState(getViewFromHash);

  // Robust scroll-to-top helper that coordinates native window and Lenis smooth scroller
  const resetScrollToTop = () => {
    if (lenisRef.current) {
      try {
        lenisRef.current.scrollTo(0, { immediate: true });
      } catch (e) {}
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  useEffect(() => {
    const handleHash = () => {
      const targetView = getViewFromHash();
      setCurrentView(targetView);
      if (targetView !== 'home') {
        resetScrollToTop();
        setTimeout(resetScrollToTop, 20);
        setTimeout(resetScrollToTop, 100);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Ensure scroll is reset whenever navigating to any case study
  useEffect(() => {
    if (currentView !== 'home') {
      resetScrollToTop();
      const t1 = setTimeout(resetScrollToTop, 20);
      const t2 = setTimeout(resetScrollToTop, 100);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [currentView]);

  const navigateToBlazeup = () => {
    resetScrollToTop();
    window.location.hash = '#/case-study/blazeup';
    setCurrentView('blazeup');
    setTimeout(resetScrollToTop, 20);
  };

  const navigateToZevox = () => {
    resetScrollToTop();
    window.location.hash = '#/case-study/zevox';
    setCurrentView('zevox');
    setTimeout(resetScrollToTop, 20);
  };

  const navigateToHome = (targetId = 'work') => {
    if (targetId === 'blazeup') {
      navigateToBlazeup();
      return;
    }
    if (targetId === 'zevox') {
      navigateToZevox();
      return;
    }

    setCurrentView('home');
    window.location.hash = targetId ? `#${targetId}` : '#';
    setTimeout(() => {
      if (!targetId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.getElementById(targetId);
      if (target) {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(target, { duration: 1.1 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 60);
  };

  // Retire nav-initial after Batch 2 entrance finishes (0.88s delay + 0.8s duration = 1.68s)
  useEffect(() => {
    const timer = setTimeout(() => {
      setNavInitial(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

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
  }, []);

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
      if (y > 30) {
        setNavInitial(false);
      }
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
    if (e && e.preventDefault) e.preventDefault();

    if (currentView !== 'home') {
      navigateToHome(targetId);
      return;
    }

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

  // Obfuscated email generator to prevent automated bot scrapers
  const getEmailAddress = () => {
    const user = 'nithin161298';
    const domain = 'gmail.com';
    return `${user}@${domain}`;
  };

  const handleSendMail = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const email = getEmailAddress();
    const subject = encodeURIComponent("Let's build something great");
    window.location.href = `mailto:${email}?subject=${subject}`;
  };

  const handleCopyEmail = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const email = getEmailAddress();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="portfolio-app">

      {/* ── NAVIGATION ────────────────────────────────── */}
      <header
        className={`navbar ${navInitial ? 'nav-initial' : ''} ${scrolled ? 'scrolled' : ''}`}
        onAnimationEnd={() => setNavInitial(false)}
      >
        <div className="navbar-container">
          {/* Floating Back button (iOS-style icon action, anchored inside container with left padding) */}
          {currentView !== 'home' && (
            <button
              type="button"
              onClick={() => navigateToHome('work')}
              className={`navbar-back-margin-btn ${scrolled ? 'is-visible' : ''}`}
              title="Back to Selected Work"
              aria-label="Back to Selected Work"
            >
              <ArrowLeft size={18} strokeWidth={2.2} className="navbar-back-icon" />
            </button>
          )}

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
                  <img
                    src="/logo.png"
                    srcSet="/logo.png 1x, /logo@2x.png 2x"
                    alt="Nithin Kumar"
                    className="brand-logo-img"
                    width="25"
                    height="26"
                  />
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
                className={`nav-link ${currentView !== 'home' || activeSection === 'work' ? 'active' : ''}`}
              >
                Work
              </a>
              <a
                href="#about"
                onClick={(e) => handleSmoothScroll(e, 'about')}
                className={`nav-link ${currentView === 'home' && activeSection === 'about' ? 'active' : ''}`}
              >
                About me
              </a>
              <a
                href="#contact"
                onClick={(e) => handleSmoothScroll(e, 'contact')}
                className={`nav-link ${currentView === 'home' && activeSection === 'contact' ? 'active' : ''}`}
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
        {currentView === 'blazeup' && (
          <BlazeupCaseStudy
            onBack={() => navigateToHome('work')}
            onNavigate={(target) => navigateToHome(target)}
          />
        )}
        {currentView === 'zevox' && (
          <ZevoxCaseStudy
            onBack={() => navigateToHome('work')}
            onNavigate={(target) => navigateToHome(target)}
          />
        )}
        {currentView === 'home' && (
          <>
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
              I design digital experiences that feel<br />
              simple, useful and human.
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

            {/* Work Cards Grid — Two Vertical Blocks: Left (Blazeup) & Right (Zevox) */}
            <div className="work-grid">

              {/* Left Block: Blazeup */}
              <a
                href="#/case-study/blazeup"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToBlazeup();
                }}
                className="work-block-card"
                id="work-card-blazeup"
              >
                <div className="work-block-visual">
                  <picture>
                    <source srcSet="/blazeup-card-visual@2x.webp" type="image/webp" />
                    <img
                      src="/blazeup-card-visual@2x.png"
                      alt="Blazeup compliance dashboard case study"
                      className="work-block-img"
                      loading="lazy"
                    />
                  </picture>
                </div>
                <div className="work-block-footer">
                  <div className="work-block-meta">
                    <span className="work-block-num">01 / 02</span>
                    <span className="work-block-cat">FINTECH &amp; B2B SAAS</span>
                    <span className="work-block-badge-protected">
                      <Lock size={11} strokeWidth={2.2} />
                      <span>Protected</span>
                    </span>
                  </div>
                  <div className="work-block-main">
                    <div className="work-block-text">
                      <h3 className="work-block-name">Blazeup</h3>
                      <p className="work-block-summary">
                        Turning complex compliance workflows into a simple, intuitive experience for modern businesses.
                      </p>
                    </div>
                    <div className="work-block-cta">
                      <span>View case study</span>
                      <ArrowRight size={14} className="work-cta-arrow" />
                    </div>
                  </div>
                </div>
              </a>

              {/* Right Block: Zevox */}
              <a
                href="#/case-study/zevox"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToZevox();
                }}
                className="work-block-card"
                id="work-card-zevox"
              >
                <div className="work-block-visual">
                  <picture>
                    <source srcSet="/zevox-card-visual@2x.webp" type="image/webp" />
                    <img
                      src="/zevox-card-visual@2x.png"
                      alt="Zevox - A crypto-enabled fintech wallet case study"
                      className="work-block-img"
                    />
                  </picture>
                </div>
                <div className="work-block-footer">
                  <div className="work-block-meta">
                    <span className="work-block-num">02 / 02</span>
                    <span className="work-block-cat">FINTECH &amp; CRYPTO WALLET</span>
                  </div>
                  <div className="work-block-main">
                    <div className="work-block-text">
                      <h3 className="work-block-name">Zevox</h3>
                      <p className="work-block-summary">
                        A crypto-enabled fintech wallet built for seamless, transparent global payments and cross-border transfers.
                      </p>
                    </div>
                    <div className="work-block-cta">
                      <span>View case study</span>
                      <ArrowRight size={14} className="work-cta-arrow" />
                    </div>
                  </div>
                </div>
              </a>

            </div>

          </div>
        </section>

        {/* ── ABOUT & EXPERIENCE SECTION (Finalized Option 01: Light Canvas) ── */}
        <section id="about" className="about-section">
          <div className="container">

            {/* Top Block: Portrait + About Info */}
            <div className="about-top-grid">
              <div className="about-portrait-wrap" ref={portraitWrapRef}>
                <picture>
                  <source srcSet="/about-portrait-clean@2x.webp" type="image/webp" />
                  <img
                    src="/about-portrait-clean@2x.png"
                    alt="Nithin Kumar - UI/UX Designer"
                    className="about-portrait-img"
                    loading="lazy"
                  />
                </picture>
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
                  <span className="about-eyebrow-text">ABOUT ME</span>
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
                  <a
                    href="https://www.linkedin.com/in/nithin-kumar-97a85a139"
                    target="_blank"
                    rel="noreferrer"
                    className="about-social-btn"
                    aria-label="LinkedIn Profile"
                    title="LinkedIn"
                  >
                    <svg className="social-icon" viewBox="0 0 448 512" fill="currentColor">
                      <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
                    </svg>
                  </a>

                  <a
                    href="https://www.behance.net/nithinkumar"
                    target="_blank"
                    rel="noreferrer"
                    className="about-social-btn"
                    aria-label="Behance Profile"
                    title="Behance"
                  >
                    <svg className="social-icon" viewBox="0 0 576 512" fill="currentColor">
                      <path d="M232 237.2c31.8-15.2 48.4-38.2 48.4-74 0-70.6-52.6-92.1-113.8-92.1H0v369.8h177.7c67.1 0 126.3-26.6 126.3-108.5 0-47.6-26.9-78.2-72-95.2zm-136-105h59.4c31.8 0 54.9 10 54.9 45.4 0 32.7-21.4 49.3-54.9 49.3H96v-94.7zm65.9 239.5H96v-99.3h65.9c35.6 0 60.7 15.6 60.7 50.1 0 37.8-24.9 49.2-60.7 49.2zm301.7-184.2c-73.4 0-128.7 54.6-128.7 129.5 0 74.4 53.6 127 131.8 127 58.1 0 102.5-30.8 119.5-83.6h-59.2c-8 17.8-27.2 31.8-59.8 31.8-40.4 0-66.7-24.8-69.5-62.8h191.1c1.3-8.8 2-17.6 2-26.3 0-65.7-41.2-115.6-127.2-115.6zm-66.2 96.6c4.6-32.9 27.2-50.1 64.9-50.1 36.6 0 58.1 17.8 61.9 50.1h-126.8zM417.8 91.5h119.4v38.9H417.8V91.5z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Block: Experience */}
            <div className="about-exp-grid">
              <div className="about-exp-left">
                <div className="about-eyebrow-row">
                  <span className="about-eyebrow-text">EXPERIENCE</span>
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
                    <p className="exp-role-date">UI/UX Intern &nbsp;·&nbsp; Feb 2026 – Sep 2026</p>
                  </div>
                  <span className="exp-type-badge">INTERNSHIP</span>
                </div>

                <div className="exp-row">
                  <span className="exp-num">02</span>
                  <div className="exp-main-col">
                    <h3 className="exp-company-name">Swantech Solutions</h3>
                    <p className="exp-role-date">Freelance Visual Designer &nbsp;·&nbsp; Sep 2023 – Present</p>
                  </div>
                  <span className="exp-type-badge">FREELANCE</span>
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
        </section>

        {/* ── ADDITIONAL WORK ─────────────────────────────── */}
        <section id="additional-work" className="additional-section">
          <div className="container">

            {/* Header: Eyebrow + 2-Column Headline & Note */}
            <div className="additional-header-wrap">
              <div className="additional-eyebrow-row">
                <span className="additional-eyebrow-text">ADDITIONAL WORK</span>
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

              {/* Card 1: Bayard Vacations */}
              <div className="additional-card">
                <div className="additional-card-visual">
                  <picture>
                    <source srcSet="/additional-bayard@2x.webp" type="image/webp" />
                    <img
                      src="/additional-bayard@2x.png"
                      alt="Bayard Vacations mobile travel app mockup"
                      className="additional-card-img"
                      loading="lazy"
                    />
                  </picture>
                </div>
                <div className="additional-card-body">
                  <div>
                    <span className="additional-card-category">UI/UX DESIGN · TOURISM &amp; TRAVEL</span>
                    <h3 className="additional-card-title">Bayard Vacations</h3>
                    <p className="additional-card-desc">
                      A mobile travel and tourism platform designed for personalized trip planning, bespoke itineraries, and destination discovery.
                    </p>
                  </div>
                  <div className="additional-card-cta is-coming-soon">
                    <span className="additional-card-soon-dot" />
                    <span>Coming soon</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Alta Vista */}
              <div className="additional-card">
                <div className="additional-card-visual">
                  <picture>
                    <source srcSet="/additional-altavista@2x.webp" type="image/webp" />
                    <img
                      src="/additional-altavista@2x.png"
                      alt="Alta Vista Homes luxury automation hero design"
                      className="additional-card-img"
                      loading="lazy"
                    />
                  </picture>
                </div>
                <div className="additional-card-body">
                  <div>
                    <span className="additional-card-category">WEBSITE DESIGN · SMART HOME &amp; AUTOMATION</span>
                    <h3 className="additional-card-title">Alta Vista</h3>
                    <p className="additional-card-desc">
                      Designed the marketing website for Alta Vista Homes, highlighting architectural lighting systems, luxury automation, and connected living.
                    </p>
                  </div>
                  <div className="additional-card-cta is-coming-soon">
                    <span className="additional-card-soon-dot" />
                    <span>Coming soon</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Log9 */}
              <div className="additional-card">
                <div className="additional-card-visual">
                  <picture>
                    <source srcSet="/additional-log9@2x.webp" type="image/webp" />
                    <img
                      src="/additional-log9@2x.png"
                      alt="Log9 ZappUp MEGA clean tech energy storage"
                      className="additional-card-img"
                      loading="lazy"
                    />
                  </picture>
                </div>
                <div className="additional-card-body">
                  <div>
                    <span className="additional-card-category">CLEANTECH · BATTERY TECH &amp; BAAS</span>
                    <h3 className="additional-card-title">Log9</h3>
                    <p className="additional-card-desc">
                      Advanced energy storage R&amp;D and digital experience for Log9’s ZappUp MEGA platform, delivering utility-scale Battery-as-a-Service (BaaS).
                    </p>
                  </div>
                  <div className="additional-card-cta is-coming-soon">
                    <span className="additional-card-soon-dot" />
                    <span>Coming soon</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ── CONTACT & FOOTER SECTION (Floating Card with Watermark) ─────── */}
        <section id="contact" className="contact-section">
          <div className="container contact-container">

            <div className="contact-card">

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
                  <span className="contact-eyebrow-text">CONTACT</span>
                  <span className="contact-eyebrow-line" />
                </div>

                <h2 className="contact-headline">
                  Let’s build<br />
                  something great.
                </h2>

                <p className="contact-desc">
                  I’m always open to conversations about product design, collaborations, or just a good design chat.
                </p>

                {/* Interactive Mail Action Pill (Masked for privacy & spam protection) */}
                <div className="contact-email-pill">
                  <button
                    type="button"
                    onClick={handleSendMail}
                    className="contact-email-link"
                    aria-label="Send email"
                  >
                    <Mail size={16} className="contact-email-icon" />
                    <span>Mail</span>
                    <ArrowUpRight size={14} className="contact-mail-arrow" />
                  </button>

                  <span className="contact-email-sep" />

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="contact-copy-btn"
                    aria-label="Copy email address"
                  >
                    {copied ? <Check size={14} className="copy-icon-active" /> : <Copy size={14} />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
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
                      <a href="https://www.linkedin.com/in/nithin-kumar-97a85a139" target="_blank" rel="noreferrer">
                        LinkedIn
                      </a>
                      <a href="https://www.behance.net/nithinkumar" target="_blank" rel="noreferrer">
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

          {/* Giant Background Typographic Watermark (Reference: Nexiron footer style) */}
          <div className="footer-watermark" aria-hidden="true">
            <span className="footer-watermark-text">Nithin Kumar</span>
          </div>
        </section>
          </>
        )}
      </main>

    </div>
  );
}

