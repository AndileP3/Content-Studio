import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import InfoPanel from "./InfoPanel";
import "./Layout.css";

export default function Layout() {
  const [activeSection, setActiveSection] = useState("overview");

  // ✅ SAFE: hooks only at top level
  const homeRef = useRef(null);
  const contentTypesRef = useRef(null);
  const howItWorksRef = useRef(null);
  const aiModelRef = useRef(null);
  const featuresRef = useRef(null);
  const techStackRef = useRef(null);

  const sectionRefs = {
    overview: homeRef,
    "content-types": contentTypesRef,
    "how-it-works": howItWorksRef,
    "ai-model": aiModelRef,
    features: featuresRef,
    "tech-stack": techStackRef,
  };

  // ✅ Intersection Observer
  useEffect(() => {
    const refs = Object.values(sectionRefs);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.35 }
    );

    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      refs.forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
      observer.disconnect();
    };
  }, []);

  // ✅ Scroll helper
  const scrollTo = (id) => {
    sectionRefs[id]?.current?.scrollIntoView({
      behavior: "smooth",
    });
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
        <section id="overview" ref={sectionRefs.overview} className="info-section">
          <div className="section-badge"><span className="badge-dot" />Overview</div>
          <h2>Your AI-Powered<br /><span className="gradient-text">Content Studio</span></h2>
          <p>
            AI Content Studio is a full-featured content generation platform that transforms
            simple prompts into polished, ready-to-use content — from blog posts to product
            copy, social captions, emails, and code.
          </p>
        </section>

        {/* ── CONTENT TYPES ── */}
        <section id="content-types" ref={sectionRefs["content-types"]} className="info-section">
          <div className="section-badge"><span className="badge-dot" />What You Can Create</div>
          <h2>Six Powerful<br /><span className="gradient-text">Content Formats</span></h2>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" ref={sectionRefs["how-it-works"]} className="info-section">
          <div className="section-badge"><span className="badge-dot" />How It Works</div>
          <h2>From Prompt to<br /><span className="gradient-text">Published in Seconds</span></h2>
        </section>

        {/* ── AI MODEL ── */}
        <section id="ai-model" ref={sectionRefs["ai-model"]} className="info-section">
          <div className="section-badge"><span className="badge-dot" />AI Model</div>
          <h2>Built on<br /><span className="gradient-text">Groq + Llama</span></h2>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" ref={sectionRefs.features} className="info-section">
          <div className="section-badge"><span className="badge-dot" />Features</div>
          <h2>Everything Packed<br /><span className="gradient-text">Into One Tool</span></h2>
        </section>

        {/* ── TECH STACK ── */}
        <section id="tech-stack" ref={sectionRefs["tech-stack"]} className="info-section">
          <div className="section-badge"><span className="badge-dot" />Tech Stack</div>
          <h2>Modern Tools,<br /><span className="gradient-text">Serious Performance</span></h2>
        </section>

      </main>

      <ChatArea />
      <InfoPanel />
    </div>
  );
}