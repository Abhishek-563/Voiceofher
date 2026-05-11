import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, AlertTriangle } from "lucide-react";
import { sosAPI } from "../services/api";
import "../App.css";

const DANGER_WORDS = ["help", "save me", "emergency", "danger", "please help", "bachao"];

const VoiceDetection = ({ setIsSOSOpen }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [dangerDetected, setDangerDetected] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | listening | danger
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (event) => {
      const text = event.results[event.results.length - 1][0].transcript.toLowerCase();
      setTranscript(text);
      const detected = DANGER_WORDS.some((w) => text.includes(w));
      if (detected && !dangerDetected) {
        setDangerDetected(true);
        setStatus("danger");
        setIsSOSOpen(true);
        triggerSOS("VOICE");
        setTimeout(() => { setDangerDetected(false); setStatus("listening"); }, 6000);
      }
    };

    rec.onerror = () => setIsListening(false);
    recognitionRef.current = rec;
  }, [setIsSOSOpen, dangerDetected]);

  const triggerSOS = async (by) => {
    try {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        await sosAPI.send({ lat: pos.coords.latitude, lng: pos.coords.longitude }, by);
      });
    } catch (e) { console.error(e); }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) { alert("Speech recognition not supported in this browser."); return; }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setStatus("idle");
      setTranscript("");
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setStatus("listening");
    }
  };

  const barHeights = [0.4, 0.7, 1, 0.85, 0.6, 0.9, 0.5, 0.75, 1, 0.6, 0.8, 0.45];

  return (
    <section style={{ padding: "6rem 2rem", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }} style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 className="section-title">
            AI Voice <span className="gradient-text">Emergency Detection</span>
          </h2>
          <p className="section-subtitle">
            Say <strong style={{ color: "var(--pink)" }}>"Help"</strong>, <strong style={{ color: "var(--pink)" }}>"Emergency"</strong> or <strong style={{ color: "var(--pink)" }}>"Save Me"</strong> — SOS activates instantly.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            position: "relative", background: "var(--bg-card)",
            border: `1px solid ${dangerDetected ? "rgba(239,68,68,0.4)" : "var(--border)"}`,
            borderRadius: "var(--radius-xl)", padding: "3rem 2rem",
            textAlign: "center", overflow: "hidden",
            transition: "border-color 0.4s",
          }}>

          {/* Danger overlay glow */}
          <AnimatePresence>
            {dangerDetected && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{
                  position: "absolute", inset: 0,
                  background: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)",
                  pointerEvents: "none",
                }} />
            )}
          </AnimatePresence>

          {/* Waveform */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, height: 60, marginBottom: "2.5rem" }}>
            {barHeights.map((h, i) => (
              <div key={i} className="wave-bar"
                style={{
                  height: isListening ? `${h * 50}px` : "6px",
                  animationDelay: `${i * 0.07}s`,
                  animationPlayState: isListening ? "running" : "paused",
                  opacity: isListening ? 0.9 : 0.3,
                  background: dangerDetected
                    ? "linear-gradient(to top, #ef4444, #fca5a5)"
                    : "linear-gradient(to top, var(--pink), var(--purple))",
                  transition: "height 0.4s, opacity 0.4s",
                }} />
            ))}
          </div>

          {/* Mic button */}
          <motion.button onClick={toggleListening}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.93 }}
            animate={isListening ? {
              boxShadow: ["0 0 20px rgba(236,72,153,0.3)", "0 0 60px rgba(236,72,153,0.7)", "0 0 20px rgba(236,72,153,0.3)"]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: 120, height: 120, borderRadius: "50%", border: "none",
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 2rem",
              background: dangerDetected
                ? "linear-gradient(135deg, #ef4444, #ec4899)"
                : isListening
                  ? "var(--gradient-main)"
                  : "rgba(255,255,255,0.06)",
              boxShadow: isListening ? "0 0 40px rgba(236,72,153,0.4)" : "none",
              transition: "background 0.4s, box-shadow 0.4s",
            }}>
            {dangerDetected
              ? <AlertTriangle size={48} color="white" />
              : isListening
                ? <Mic size={48} color="white" />
                : <MicOff size={48} color="var(--text-muted)" />}
          </motion.button>

          {/* Status */}
          <h3 style={{
            fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.4rem",
            color: dangerDetected ? "#fca5a5" : isListening ? "white" : "var(--text-secondary)",
            marginBottom: "0.5rem",
          }}>
            {dangerDetected ? "⚠️ DANGER DETECTED" : isListening ? "🎙️ Listening..." : "Voice Detection Off"}
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "2rem" }}>
            {isListening ? "Monitoring for emergency keywords in real-time" : "Click the mic to start monitoring"}
          </p>

          {/* Transcript box */}
          <div style={{
            background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)", padding: "1.25rem 1.5rem",
            textAlign: "left", minHeight: 72,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
              color: "var(--pink)", fontSize: "0.8rem", fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: isListening ? "#22c55e" : "var(--text-muted)", display: "inline-block" }} />
              LIVE TRANSCRIPT
            </div>
            <p style={{ color: transcript ? "var(--text-primary)" : "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6 }}>
              {transcript || "Waiting for voice input…"}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VoiceDetection;
