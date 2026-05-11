import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import InfoPanel from "./InfoPanel";
import "./Layout.css";

export default function Layout() {
  const [activeSection, setActiveSection] = useState("overview");

  const sectionRefs = {
    overview:      useRef(null),
    "content-types": useRef(null),
    "how-it-works":  useRef(null),
    "ai-model":      useRef(null),
    features:        useRef(null),
    "tech-stack":    useRef(null),
  };

useEffect(() => {
  const refs = Object.values(sectionRefs);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setActiveSection(e.target.id);
        }
      });
    },
    { threshold: 0.35 }
  );

  refs.forEach((r) => {
    if (r.current) observer.observe(r.current);
  });

  return () => {
    refs.forEach((r) => {
      if (r.current) observer.unobserve(r.current);
    });

    observer.disconnect();
  };
}, [sectionRefs]);

  const scrollTo = (id) => {
    sectionRefs[id]?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="layout-root">
      {/* Ambient orbs */}
      <div className="animated-bg">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
      </div>

      <Sidebar activeSection={activeSection} onNav={scrollTo} />

      <main className="layout-main">

        {/* ── OVERVIEW ── */}
        <section id="overview" ref={sectionRefs["overview"]} className="info-section">
          <div className="section-badge"><span className="badge-dot" />Overview</div>
          <h2>Your AI-Powered<br /><span className="gradient-text">Content Studio</span></h2>
          <p>
            AI Content Studio is a full-featured content generation platform that transforms
            simple prompts into polished, ready-to-use content — from blog posts to product
            copy, social captions, emails, and code. Powered by Groq's ultra-fast inference,
            every generation feels instant.
          </p>
          <div className="stat-row">
            <div className="stat-card">
              <span className="stat-icon">📝</span>
              <span className="stat-num">6+</span>
              <span className="stat-label">Content Types</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">⚡</span>
              <span className="stat-num">&lt;1s</span>
              <span className="stat-label">Response Time</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🎙️</span>
              <span className="stat-num">∞</span>
              <span className="stat-label">Generations</span>
            </div>
          </div>
        </section>

        {/* ── CONTENT TYPES ── */}
        <section id="content-types" ref={sectionRefs["content-types"]} className="info-section">
          <div className="section-badge"><span className="badge-dot" />What You Can Create</div>
          <h2>Six Powerful<br /><span className="gradient-text">Content Formats</span></h2>
          <p>
            Every content type uses a tuned system prompt optimised for that specific format,
            so the AI already knows the structure, tone, and length before you even type.
          </p>
          <div className="content-types-grid">
            {[
              { icon: "📝", title: "Blog Posts", desc: "Long-form SEO-optimised articles with headings, intro, and CTA.", badge: "LONG" },
              { icon: "🛍️", title: "Product Descriptions", desc: "Conversion-focused copy that highlights benefits and drives sales.", badge: "MEDIUM" },
              { icon: "📱", title: "Social Captions", desc: "Platform-specific captions with hashtags and punchy hooks.", badge: "SHORT" },
              { icon: "✉️", title: "Emails", desc: "Professional emails from cold outreach to customer newsletters.", badge: "MEDIUM" },
              { icon: "💻", title: "Code Snippets", desc: "Clean, commented, production-ready code in any language.", badge: "CODE" },
              { icon: "🖼️", title: "Image Analysis", desc: "Upload any image and get detailed AI-powered descriptions.", badge: "VISION" },
            ].map((c) => (
              <div className="ct-card" key={c.title}>
                <span className="ct-icon">{c.icon}</span>
                <div className="ct-info">
                  <h4>{c.title}</h4>
                  <p>{c.desc}</p>
                </div>
                <span className="ct-badge">{c.badge}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" ref={sectionRefs["how-it-works"]} className="info-section">
          <div className="section-badge"><span className="badge-dot" />How It Works</div>
          <h2>From Prompt to<br /><span className="gradient-text">Published in Seconds</span></h2>
          <div className="steps-grid">
            {[
              { n: "01", t: "Choose Your Format", d: "Select from blog, product copy, email, social, code, or image analysis via the sidebar." },
              { n: "02", t: "Describe What You Need", d: "Type your prompt — or use 🎙️ voice input to speak it. Attach images if needed." },
              { n: "03", t: "AI Generates Instantly", d: "Groq's inference engine processes your request and streams a polished result." },
              { n: "04", t: "Copy & Deploy", d: "Hit the copy button and paste your content wherever it needs to go." },
            ].map((s) => (
              <div className="step-card" key={s.n}>
                <span className="step-num">{s.n}</span>
                <div className="step-body">
                  <h4>{s.t}</h4>
                  <p>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── AI MODEL ── */}
        <section id="ai-model" ref={sectionRefs["ai-model"]} className="info-section">
          <div className="section-badge"><span className="badge-dot" />AI Model</div>
          <h2>Built on<br /><span className="gradient-text">Groq + Llama</span></h2>
          <div className="glass-card">
            <div className="model-logo">🦙</div>
            <div className="model-info">
              <h3>Llama 4 Scout — Vision Model</h3>
              <p>
                AI Content Studio is powered by Meta's Llama 4 Scout via Groq's LPU™ inference
                engine — the fastest AI inference available today. The model handles both text
                generation and image understanding, making it the only model you need.
              </p>
              <div className="model-tags">
                <span className="tag">Llama 4 Scout</span>
                <span className="tag">Vision + Text</span>
                <span className="tag">Groq LPU™</span>
                <span className="tag">Sub-second</span>
                <span className="tag">Open Weights</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" ref={sectionRefs["features"]} className="info-section">
          <div className="section-badge"><span className="badge-dot" />Features</div>
          <h2>Everything Packed<br /><span className="gradient-text">Into One Tool</span></h2>
          <div className="features-grid">
            {[
              { icon: "🎙️", t: "Voice Input",        d: "Speak your prompt using the built-in Web Speech API — no typing needed." },
              { icon: "🖼️", t: "Image Uploads",       d: "Attach images directly in chat for the AI to read and analyse." },
              { icon: "⚡", t: "Instant Generation",   d: "Groq's LPU delivers results in under a second — no waiting." },
              { icon: "📋", t: "One-Click Copy",       d: "Copy any AI response to clipboard with a single button tap." },
              { icon: "🎨", t: "Format-Aware AI",      d: "Each content type has its own expert prompt for optimal output." },
              { icon: "📱", t: "Fully Responsive",     d: "Works beautifully on desktop, tablet, and mobile devices." },
              { icon: "🔑", t: ".env API Key",         d: "Your Groq API key is stored securely in a .env file — not in the UI." },
              { icon: "💾", t: "Session History",      d: "Your generations are tracked in the sidebar throughout the session." },
            ].map((f) => (
              <div className="feature-tile" key={f.t}>
                <span className="feature-icon">{f.icon}</span>
                <h4>{f.t}</h4>
                <p>{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TECH STACK ── */}
        <section id="tech-stack" ref={sectionRefs["tech-stack"]} className="info-section">
          <div className="section-badge"><span className="badge-dot" />Tech Stack</div>
          <h2>Modern Tools,<br /><span className="gradient-text">Serious Performance</span></h2>
          <div className="stack-list">
            {[
              { icon: "⚛️", name: "React 18",             role: "UI Framework" },
              { icon: "🦙", name: "Llama 4 Scout",        role: "Language + Vision Model" },
              { icon: "⚡", name: "Groq API",             role: "Ultra-fast LPU Inference" },
              { icon: "🎤", name: "Web Speech API",        role: "Browser Voice Recognition" },
              { icon: "📝", name: "React Markdown",        role: "Rich Response Rendering" },
              { icon: "🎨", name: "CSS3 + Custom Props",   role: "Design System & Animations" },
              { icon: "🔐", name: ".env Config",           role: "Secure API Key Storage" },
            ].map((s) => (
              <div className="stack-row" key={s.name}>
                <span className="stack-icon">{s.icon}</span>
                <div>
                  <strong>{s.name}</strong>
                  <span className="stack-role">{s.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <ChatArea />
      <InfoPanel />
    </div>
  );
}
