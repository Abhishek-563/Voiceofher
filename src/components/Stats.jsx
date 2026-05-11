import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, BellRing, Users, MapPinned } from "lucide-react";

const statsData = [
  { icon: ShieldCheck, title: "15K+", subtitle: "Women Protected", color: "var(--pink)", glow: "rgba(236,72,153,0.2)" },
  { icon: BellRing, title: "8K+", subtitle: "SOS Alerts Sent", color: "var(--purple)", glow: "rgba(139,92,246,0.2)" },
  { icon: Users, title: "500+", subtitle: "NGOs Connected", color: "#06b6d4", glow: "rgba(6,182,212,0.2)" },
  { icon: MapPinned, title: "24/7", subtitle: "Live Tracking", color: "#f59e0b", glow: "rgba(245,158,11,0.2)" },
];

const StatCard = ({ icon: Icon, title, subtitle, color, glow, index }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      whileHover={{ y: -8, scale: 1.02 }}
      style={{
        position: "relative",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "2rem",
        textAlign: "center",
        overflow: "hidden",
        cursor: "default",
        transition: "border-color 0.3s",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = color + "55"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>

      {/* Glow bg */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(circle at 50% 0%, ${glow} 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Icon circle */}
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
          border: `1px solid ${color}33`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.25rem",
          color,
        }}>
          <Icon size={28} />
        </div>

        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: "2.5rem", fontWeight: 900,
          color: "white",
          lineHeight: 1,
          marginBottom: "0.5rem",
          animation: visible ? "fadeInUp 0.6s ease" : "none",
        }}>
          {title}
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", fontWeight: 500 }}>
          {subtitle}
        </p>
      </div>
    </motion.div>
  );
};

const Stats = () => (
  <section style={{ padding: "6rem 2rem", position: "relative", zIndex: 1 }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: "center", marginBottom: "4rem" }}>
        <h2 className="section-title">
          Real-Time{" "}
          <span className="gradient-text">Protection System</span>
        </h2>
        <p className="section-subtitle" style={{ maxWidth: 560, margin: "1rem auto 0" }}>
          Advanced emergency infrastructure designed for instant help, smart detection, and rapid response.
        </p>
      </motion.div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1.5rem",
      }}>
        {statsData.map((s, i) => <StatCard key={i} {...s} index={i} />)}
      </div>
    </div>
  </section>
);

export default Stats;
