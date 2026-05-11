import React from "react";
import "./Sidebar.css";

const NAV = [
  { id: "overview",       icon: "◎",  label: "Overview" },
  { id: "content-types",  icon: "◈",  label: "Content Types" },
  { id: "how-it-works",   icon: "⟳",  label: "How It Works" },
  { id: "ai-model",       icon: "◆",  label: "AI Model" },
  { id: "features",       icon: "◉",  label: "Features" },
  { id: "tech-stack",     icon: "⬡",  label: "Tech Stack" },
];

export default function Sidebar({ activeSection, onNav }) {
  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-icon">✦</div>
        <div>
          <div className="brand-name">AI Content Studio</div>
          <div className="brand-tagline">Groq Powered</div>
        </div>
      </div>

      <div className="sidebar-divider" />

      {/* Navigation */}
      <div className="sidebar-section-label">Navigation</div>
      <nav className="sidebar-nav">
        {NAV.map(({ id, icon, label }) => (
          <button
            key={id}
            className={`nav-item ${activeSection === id ? "active" : ""}`}
            onClick={() => onNav(id)}
          >
            <span className="nav-icon">{icon}</span>
            <span className="nav-label">{label}</span>
            {activeSection === id && <span className="nav-dot" />}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="footer-pill">
          <span className="status-dot" />
          AI Ready
        </div>
        <p className="footer-note">Powered by Groq + Llama 4</p>
      </div>
    </aside>
  );
}
