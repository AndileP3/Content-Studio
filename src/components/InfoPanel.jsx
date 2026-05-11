import React, { useState, useEffect } from "react";
import "./InfoPanel.css";

const TIPS = [
  { icon: "✦", tip: "Be specific in your prompts — mention tone, audience, and length for best results." },
  { icon: "🖼️", tip: "Attach images in Vision mode to get detailed AI analysis of any visual content." },
  { icon: "🎙️", tip: "Use the mic button to dictate your prompt hands-free with voice recognition." },
  { icon: "📋", tip: "Hit the copy button on any response to instantly grab content for your project." },
  { icon: "💡", tip: "Switch modes using the tabs in chat — each mode has a tuned AI system prompt." },
  { icon: "⚡", tip: "Groq's LPU inference delivers responses in under a second — no waiting around." },
];

const PROMPTS = [
  { icon: "📝", text: "Blog: 'Write about AI trends for 2025'" },
  { icon: "🛍️", text: "Product: 'Smart water bottle with hydration tracking'" },
  { icon: "📱", text: "Social: 'Launch post for a new mobile app'" },
  { icon: "✉️", text: "Email: 'Re-engagement email for inactive users'" },
  { icon: "💻", text: "Code: 'React hook for dark/light mode toggle'" },
  { icon: "🖼️", text: "Vision: Upload a screenshot for UI feedback" },
];

const QUALITY_BARS = [
  { label: "Blog Quality",    pct: 96, color: "#7c6cfc" },
  { label: "Code Accuracy",   pct: 92, color: "#a78bfa" },
  { label: "Tone Matching",   pct: 88, color: "#f5c542" },
  { label: "Response Speed",  pct: 99, color: "#4ade80" },
];

export default function InfoPanel() {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTipIndex((i) => (i + 1) % TIPS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <aside className="info-panel">

      {/* ── Pro Tip ── */}
      <div>
        <div className="ip-label">Pro Tip</div>
        <div className="tip-card">
          <div className="tip-icon">{TIPS[tipIndex].icon}</div>
          <p className="tip-text">{TIPS[tipIndex].tip}</p>
          <div className="tip-dots">
            {TIPS.map((_, i) => (
              <button
                key={i}
                className={`tip-dot ${i === tipIndex ? "active" : ""}`}
                onClick={() => setTipIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Prompt Examples ── */}
      <div>
        <div className="ip-label">Try These Prompts</div>
        <div className="prompt-list">
          {PROMPTS.map((p) => (
            <div className="prompt-chip" key={p.text}>
              <span className="prompt-icon">{p.icon}</span>
              <span className="prompt-text">{p.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Output Quality ── */}
      <div>
        <div className="ip-label">Output Quality</div>
        <div className="quality-bars">
          {QUALITY_BARS.map((b) => (
            <div className="bar-row" key={b.label}>
              <div className="bar-label-row">
                <span>{b.label}</span>
                <span className="bar-pct">{b.pct}%</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${b.pct}%`, background: b.color, boxShadow: `0 0 8px ${b.color}` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
}
