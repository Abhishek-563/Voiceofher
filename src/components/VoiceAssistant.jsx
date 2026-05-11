import { motion } from "framer-motion";
import { Mic, AudioWaveform, Radio, Zap } from "lucide-react";
import "../App.css";

const features = [
  { icon: AudioWaveform, label: "Real-Time Voice Detection", color: "var(--pink)" },
  { icon: Mic, label: "Instant Emergency Activation", color: "var(--purple)" },
  { icon: Radio, label: "Silent Background Monitoring", color: "#06b6d4" },
  { icon: Zap, label: "Zero-latency Response", color: "#f59e0b" },
];

const VoiceAssistant = () => (
  <section style={{ padding: "6rem 2rem", position: "relative", zIndex: 1 }}>
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}
      className="hero-grid">

      {/* Left */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "5px 14px", borderRadius: 100, marginBottom: "1.5rem",
          background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.25)",
          fontSize: "0.78rem", color: "var(--pink)", fontWeight: 600,
        }}>
          <Mic size={12} /> AI-Powered
        </div>

        <h2 className="section-title" style={{ marginBottom: "1rem" }}>
          AI Voice<br />
          <span className="gradient-text">Protection</span>
        </h2>
        <p className="section-subtitle" style={{ marginBottom: "2rem" }}>
          Trigger emergency assistance using voice commands. The AI system continuously listens for danger signals and activates protection instantly — no screen interaction needed.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {features.map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}
              style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: f.color + "18",
                border: `1px solid ${f.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: f.color,
              }}>
                <f.icon size={17} />
              </div>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.92rem" }}>{f.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right — animated mic visualizer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9 }}
        style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Outer rings */}
          {[360, 280, 200].map((size, i) => (
            <motion.div key={i}
              animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
              style={{
                position: "absolute",
                width: size, height: size,
                borderRadius: "50%",
                border: `1px solid ${i === 0 ? "var(--pink)" : "var(--purple)"}40`,
              }} />
          ))}

          {/* Waveform bars around the mic */}
          <div style={{
            position: "absolute",
            display: "flex", alignItems: "center", gap: 5,
            bottom: "calc(50% - 70px)",
          }}>
            {[0.4, 0.7, 1, 0.7, 0.4].map((h, i) => (
              <div key={i} className="wave-bar"
                style={{ animationDelay: `${i * 0.15}s`, height: `${h * 36}px`, opacity: 0.7 }} />
            ))}
          </div>

          {/* Mic button */}
          <motion.div
            animate={{ boxShadow: ["0 0 20px rgba(236,72,153,0.3)", "0 0 60px rgba(236,72,153,0.7)", "0 0 20px rgba(236,72,153,0.3)"] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{
              width: 140, height: 140, borderRadius: "50%",
              background: "var(--gradient-main)",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", zIndex: 1,
              cursor: "pointer",
            }}>
            <Mic size={56} color="white" />
          </motion.div>
        </div>
      </motion.div>
    </div>

    <style>{`@media(max-width:768px){.hero-grid{grid-template-columns:1fr!important;gap:2rem!important}}`}</style>
  </section>
);

export default VoiceAssistant;
