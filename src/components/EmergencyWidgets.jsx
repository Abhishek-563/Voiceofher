import { motion } from "framer-motion";
import { PhoneCall, Siren, ShieldAlert, MapPinned, Zap, Radio } from "lucide-react";

const widgets = [
  {
    icon: PhoneCall,
    title: "Fake Emergency Call",
    desc: "Trigger a realistic incoming call to escape uncomfortable situations instantly.",
    color: "var(--pink)",
    glow: "rgba(236,72,153,0.15)",
    tag: "Active",
  },
  {
    icon: Siren,
    title: "Instant SOS Trigger",
    desc: "One tap sends your GPS location to all emergency contacts simultaneously.",
    color: "var(--purple)",
    glow: "rgba(139,92,246,0.15)",
    tag: "Live",
  },
  {
    icon: ShieldAlert,
    title: "AI Risk Detection",
    desc: "Machine learning continuously monitors for danger patterns and anomalies.",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.15)",
    tag: "AI",
  },
  {
    icon: MapPinned,
    title: "Live GPS Sharing",
    desc: "Share your real-time location with trusted contacts for continuous safety.",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.15)",
    tag: "GPS",
  },
  {
    icon: Zap,
    title: "Quick Escape Plan",
    desc: "Pre-configured routes and safe spots auto-suggested in your area.",
    color: "#10b981",
    glow: "rgba(16,185,129,0.15)",
    tag: "Smart",
  },
  {
    icon: Radio,
    title: "Silent Mode Alert",
    desc: "Send distress signals without making a sound — completely discreet.",
    color: "#ef4444",
    glow: "rgba(239,68,68,0.15)",
    tag: "Stealth",
  },
];

const EmergencyWidgets = () => (
  <section id="features" style={{ padding: "6rem 2rem", position: "relative", zIndex: 1 }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: "center", marginBottom: "4rem" }}>
        <h2 className="section-title">
          Smart Emergency{" "}
          <span className="gradient-text">Features</span>
        </h2>
        <p className="section-subtitle" style={{ maxWidth: 540, margin: "1rem auto 0" }}>
          AI-powered tools engineered for immediate response and maximum protection.
        </p>
      </motion.div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "1.25rem",
      }}>
        {widgets.map((w, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{
              position: "relative",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "1.75rem",
              overflow: "hidden",
              cursor: "default",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = w.color + "44";
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.background = "var(--bg-card)";
            }}>
            {/* glow */}
            <div style={{
              position: "absolute", top: 0, right: 0,
              width: 160, height: 160,
              background: `radial-gradient(circle, ${w.glow} 0%, transparent 70%)`,
              borderRadius: "50%", transform: "translate(40%,-40%)",
              pointerEvents: "none",
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: w.glow,
                  border: `1px solid ${w.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: w.color,
                }}>
                  <w.icon size={22} />
                </div>
                <span style={{
                  background: w.glow,
                  color: w.color,
                  border: `1px solid ${w.color}40`,
                  borderRadius: 100,
                  padding: "3px 10px",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                }}>
                  {w.tag}
                </span>
              </div>

              <h3 style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.1rem",
                marginBottom: "0.5rem",
              }}>{w.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: 1.65 }}>{w.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default EmergencyWidgets;
