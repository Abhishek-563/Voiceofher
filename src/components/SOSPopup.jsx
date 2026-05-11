import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, CheckCircle2, Loader2, MapPin, Phone } from "lucide-react";
import { sosAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const STAGES = [
  { label: "Acquiring GPS location…", icon: MapPin, color: "var(--pink)" },
  { label: "Alerting your contacts…", icon: Phone, color: "var(--purple)" },
  { label: "Alerts sent successfully!", icon: CheckCircle2, color: "#22c55e" },
];

const SOSPopup = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const [stage, setStage] = useState(0); // 0=ready, 1=sending, 2=done, -1=error
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!isOpen) { setStage(0); setCountdown(5); return; }

    // 5-second countdown before auto-send
    let timer;
    if (countdown > 0 && stage === 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (countdown === 0 && stage === 0) {
      sendSOS();
    }
    return () => clearTimeout(timer);
  }, [isOpen, countdown, stage]);

  const sendSOS = async () => {
    setStage(1);
    try {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            await sosAPI.send(
              { lat: pos.coords.latitude, lng: pos.coords.longitude },
              "BUTTON"
            );
            setStage(2);
            setTimeout(() => setIsOpen(false), 3500);
          } catch {
            setStage(-1);
          }
        },
        () => {
          // Send without location
          sosAPI.send({ lat: 0, lng: 0 }, "BUTTON")
            .then(() => { setStage(2); setTimeout(() => setIsOpen(false), 3500); })
            .catch(() => setStage(-1));
        }
      );
    } catch { setStage(-1); }
  };

  const cancel = () => { setIsOpen(false); };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{
            position: "fixed", inset: 0, zIndex: 500,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(16px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
          }}>
          <motion.div
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.75, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 280 }}
            style={{
              background: "#0c1128",
              border: stage === 2
                ? "1px solid rgba(34,197,94,0.4)"
                : "1px solid rgba(239,68,68,0.35)",
              borderRadius: "var(--radius-xl)", padding: "3rem 2.5rem",
              maxWidth: 440, width: "100%", position: "relative",
              textAlign: "center", overflow: "hidden",
            }}>

            {/* Background glow */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: stage === 2
                ? "radial-gradient(circle at 50% 0%, rgba(34,197,94,0.08) 0%, transparent 70%)"
                : "radial-gradient(circle at 50% 0%, rgba(239,68,68,0.1) 0%, transparent 70%)",
            }} />

            {/* Close — only when ready or error */}
            {(stage === 0 || stage === -1) && (
              <button onClick={cancel}
                style={{
                  position: "absolute", top: 16, right: 16,
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--text-muted)",
                }}>
                <X size={20} />
              </button>
            )}

            <div style={{ position: "relative", zIndex: 1 }}>
              {/* Icon */}
              <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "center" }}>
                {stage === 0 && (
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}>
                    <AlertTriangle size={64} color="#ef4444"
                      style={{ filter: "drop-shadow(0 0 20px rgba(239,68,68,0.6))" }} />
                  </motion.div>
                )}
                {stage === 1 && (
                  <Loader2 size={64} color="var(--pink)"
                    style={{ animation: "spin-slow 0.8s linear infinite" }} />
                )}
                {stage === 2 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12 }}>
                    <CheckCircle2 size={64} color="#22c55e"
                      style={{ filter: "drop-shadow(0 0 20px rgba(34,197,94,0.5))" }} />
                  </motion.div>
                )}
                {stage === -1 && (
                  <AlertTriangle size={64} color="#f59e0b" />
                )}
              </div>

              {/* Title */}
              <h2 style={{
                fontFamily: "var(--font-display)", fontWeight: 900,
                fontSize: "1.8rem", letterSpacing: "-0.02em", marginBottom: "0.75rem",
                color: stage === 2 ? "#86efac" : stage === -1 ? "#fbbf24" : "white",
              }}>
                {stage === 0 ? "🚨 SOS ACTIVATED" : stage === 1 ? "Sending Alerts…" : stage === 2 ? "Alerts Sent!" : "Error"}
              </h2>

              {/* Stage progress */}
              {stage === 1 && (
                <div style={{ margin: "1.5rem 0", display: "flex", flexDirection: "column", gap: 10 }}>
                  {STAGES.slice(0, 2).map((s, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.5 }}
                      style={{ display: "flex", alignItems: "center", gap: 10,
                        background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 14px" }}>
                      <s.icon size={16} color={s.color} />
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>{s.label}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Countdown */}
              {stage === 0 && (
                <>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                    Emergency alerts will be sent to your trusted contacts
                    {user?.emergencyContacts?.length ? ` (${user.emergencyContacts.length} contacts)` : ""} with your live location.
                  </p>

                  <div style={{
                    fontSize: "4rem", fontFamily: "var(--font-display)", fontWeight: 900,
                    color: countdown <= 2 ? "#ef4444" : "var(--pink)",
                    marginBottom: "1rem", lineHeight: 1,
                    textShadow: countdown <= 2 ? "0 0 30px rgba(239,68,68,0.6)" : "0 0 30px rgba(236,72,153,0.5)",
                  }}>
                    {countdown}
                  </div>

                  <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: "1.5rem" }}>
                    Sending automatically in {countdown} second{countdown !== 1 ? "s" : ""}
                  </p>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={cancel} className="btn-ghost"
                      style={{ flex: 1, padding: "12px", fontSize: "0.9rem" }}>
                      Cancel
                    </button>
                    <button onClick={() => { setCountdown(0); }}
                      style={{
                        flex: 2, padding: "12px",
                        background: "var(--gradient-danger)", border: "none",
                        borderRadius: "var(--radius-sm)", color: "white",
                        fontWeight: 700, cursor: "pointer", fontSize: "0.95rem",
                        boxShadow: "0 0 20px rgba(239,68,68,0.4)",
                      }}>
                      Send Now
                    </button>
                  </div>
                </>
              )}

              {stage === 2 && (
                <p style={{ color: "#86efac", fontSize: "0.92rem" }}>
                  Your contacts have been notified with your GPS location.
                </p>
              )}

              {stage === -1 && (
                <>
                  <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                    Failed to send alerts. Please call emergency services directly.
                  </p>
                  <a href="tel:112" style={{
                    display: "block", padding: "14px",
                    background: "var(--gradient-danger)", borderRadius: "var(--radius-sm)",
                    color: "white", fontWeight: 700, textDecoration: "none", fontSize: "1rem",
                  }}>
                    📞 Call 112 — Emergency
                  </a>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SOSPopup;
