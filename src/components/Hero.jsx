import { motion } from "framer-motion";
import { ShieldAlert, MapPinned, Siren, Wifi } from "lucide-react";
import "../App.css";

const Hero = ({ setShowSOS, onSOSClick }) => {
  const features = [
    { icon: <ShieldAlert size={16} />, label: "24/7 SOS", color: "var(--pink)" },
    { icon: <MapPinned size={16} />, label: "Live GPS", color: "var(--purple)" },
    { icon: <Siren size={16} />, label: "AI Detection", color: "#06b6d4" },
  ];

  return (
    <section id="home" style={{
      position: "relative",
      minHeight: "calc(100vh - 70px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "4rem 2rem",
      zIndex: 1,
    }}>
      <div style={{
        maxWidth: 1200,
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "5rem",
        alignItems: "center",
      }}
        className="hero-grid">

        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}>

          {/* Status pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 16px",
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.25)",
              borderRadius: 100,
              marginBottom: "1.5rem",
              fontSize: "0.8rem",
              color: "#86efac",
              fontWeight: 600,
            }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 8px #22c55e",
              animation: "pulseRing 2s ease-in-out infinite",
            }} />
            System Active — Protected Mode
            <Wifi size={13} />
          </motion.div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.8rem, 6vw, 4.2rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: "1.5rem",
          }}>
            Empowering
            <br />
            <span className="gradient-text-animated">Women's Safety</span>
            <br />
            <span style={{ color: "var(--text-secondary)", fontWeight: 700, fontSize: "80%" }}>
              Everywhere, Always
            </span>
          </h1>

          <p style={{
            color: "var(--text-secondary)",
            fontSize: "1.1rem",
            lineHeight: 1.75,
            maxWidth: 480,
            marginBottom: "2.5rem",
          }}>
            AI-powered emergency response with real-time GPS tracking, voice-activated SOS, and instant alerts to your trusted circle.
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: "3rem" }}>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (setShowSOS) setShowSOS(true);
                if (onSOSClick) onSOSClick();
              }}
              className="btn-primary"
              style={{ padding: "14px 32px", fontSize: "1rem", boxShadow: "var(--shadow-pink)" }}>
              🚨 Activate SOS
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="btn-ghost"
              style={{ padding: "14px 28px", fontSize: "1rem" }}
              onClick={() => document.getElementById("tracking")?.scrollIntoView({ behavior: "smooth" })}>
              View Live Map
            </motion.button>
          </div>

          {/* Feature badges */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {features.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.15 }}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 16px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 100,
                  color: f.color,
                  fontSize: "0.85rem",
                  fontWeight: 500,
                }}>
                {f.icon}
                <span style={{ color: "white" }}>{f.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right — SOS Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Pulse rings */}
            {[1, 2, 3].map((n) => (
              <div key={n} className="sos-ring" style={{
                width: 280 + n * 60, height: 280 + n * 60,
                position: "absolute",
                animationDelay: `${(n - 1) * 0.6}s`,
                borderColor: `rgba(236,72,153,${0.3 - n * 0.08})`,
              }} />
            ))}

            {/* Outer glow */}
            <div style={{
              position: "absolute",
              width: 320, height: 320,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(236,72,153,0.25) 0%, transparent 70%)",
              filter: "blur(20px)",
            }} />

            {/* SOS Button */}
            <motion.button
              onClick={() => {
                if (setShowSOS) setShowSOS(true);
                if (onSOSClick) onSOSClick();
              }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.93 }}
              style={{
                position: "relative",
                width: 220, height: 220,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #ec4899 0%, #ef4444 60%, #dc2626 100%)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 60px rgba(236,72,153,0.5), 0 0 120px rgba(239,68,68,0.2), inset 0 0 40px rgba(255,255,255,0.08)",
                zIndex: 1,
              }}>
              <span style={{
                fontSize: "3rem",
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                color: "white",
                letterSpacing: "0.05em",
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}>SOS</span>
              <span style={{
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.75)",
                fontWeight: 500,
                letterSpacing: "0.1em",
                marginTop: 4,
              }}>TAP TO ACTIVATE</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
      `}</style>
    </section>
  );
};

export default Hero;