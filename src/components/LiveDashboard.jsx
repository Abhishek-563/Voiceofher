import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { Siren, MapPinned, Clock, CheckCircle2, Activity } from "lucide-react";
import { sosAPI } from "../services/api";

const socket = io("http://localhost:5000", { autoConnect: true });

const LiveDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const fetchSOSHistory = async () => {
      try {
        const userInfo = localStorage.getItem("userInfo");

        if (!userInfo) {
          return;
        }

        const res = await sosAPI.getHistory();
        setAlerts(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSOSHistory();

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("newSOS", (data) => setAlerts(prev => [data, ...prev].slice(0, 20)));
    socket.on("sosResolved", ({ _id }) =>
      setAlerts(prev => prev.map(a => a._id === _id ? { ...a, status: "RESOLVED" } : a))
    );

    return () => { socket.off("newSOS"); socket.off("sosResolved"); socket.off("connect"); socket.off("disconnect"); };
  }, []);

  const handleResolve = async (id) => {
    try { await sosAPI.resolve(id); } catch (e) { console.error(e); }
  };

  return (
    <section style={{ padding: "6rem 2rem", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            flexWrap: "wrap", gap: 16, marginBottom: "3rem" }}>
          <div>
            <h2 className="section-title">
              Real-Time <span className="gradient-text">Emergency Dashboard</span>
            </h2>
            <p className="section-subtitle">Monitor and manage active SOS alerts live.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Activity size={16} color={connected ? "#22c55e" : "var(--text-muted)"} />
            <span style={{ fontSize: "0.82rem", color: connected ? "#86efac" : "var(--text-muted)", fontWeight: 500 }}>
              {connected ? "Live — Connected" : "Reconnecting…"}
            </span>
          </div>
        </motion.div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: "1.25rem" }}>
            {[1, 2].map(i => (
              <div key={i} className="skeleton" style={{ height: 200, borderRadius: "var(--radius-lg)" }} />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              textAlign: "center", padding: "5rem 2rem",
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)",
            }}>
            <CheckCircle2 size={56} color="#22c55e" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: 8 }}>All Clear</h3>
            <p style={{ color: "var(--text-secondary)" }}>No active emergencies detected. System is monitoring.</p>
          </motion.div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: "1.25rem" }}>
            <AnimatePresence>
              {alerts.map((alert) => (
                <motion.div key={alert._id || alert.id}
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  style={{
                    background: "var(--bg-card)",
                    border: `1px solid ${alert.status === "ACTIVE" ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.2)"}`,
                    borderRadius: "var(--radius-lg)", padding: "1.75rem",
                    position: "relative", overflow: "hidden",
                  }}>
                  <div style={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    background: alert.status === "ACTIVE"
                      ? "radial-gradient(circle at 0% 0%, rgba(239,68,68,0.08) 0%, transparent 60%)"
                      : "radial-gradient(circle at 0% 0%, rgba(34,197,94,0.06) 0%, transparent 60%)",
                  }} />
                  <div style={{ position: "relative", zIndex: 1 }}>
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Siren size={20} color={alert.status === "ACTIVE" ? "#ef4444" : "#22c55e"} />
                        <span style={{ fontWeight: 700, fontSize: "1rem" }}>
                          {alert.status === "ACTIVE" ? "Emergency Alert" : "Resolved Alert"}
                        </span>
                      </div>
                      <span className={`status-badge ${alert.status === "ACTIVE" ? "status-active" : "status-resolved"}`}>
                        <span className="pulse-dot" /> {alert.status}
                      </span>
                    </div>

                    {/* User */}
                    {alert.user?.name && (
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
                        👤 <strong style={{ color: "white" }}>{alert.user.name}</strong>
                      </p>
                    )}

                    {/* Location */}
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: "0.5rem" }}>
                      <MapPinned size={15} color="var(--pink)" />
                      <a href={`https://maps.google.com/?q=${alert.location?.lat},${alert.location?.lng}`}
                        target="_blank" rel="noreferrer"
                        style={{ color: "var(--pink)", fontSize: "0.85rem", textDecoration: "none", fontWeight: 500 }}>
                        {alert.location?.lat?.toFixed(4)}, {alert.location?.lng?.toFixed(4)} ↗
                      </a>
                    </div>

                    {/* Time */}
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: "1.25rem" }}>
                      <Clock size={13} color="var(--text-muted)" />
                      <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                        {new Date(alert.createdAt || alert.time).toLocaleString()}
                      </span>
                    </div>

                    {/* Triggered by */}
                    {alert.triggeredBy && (
                      <span style={{
                        display: "inline-block", fontSize: "0.72rem", fontWeight: 600,
                        padding: "3px 10px", borderRadius: 100,
                        background: "rgba(139,92,246,0.12)", color: "var(--purple)",
                        border: "1px solid rgba(139,92,246,0.25)", marginBottom: "1rem",
                      }}>
                        via {alert.triggeredBy}
                      </span>
                    )}

                    {alert.status === "ACTIVE" && (
                      <button onClick={() => handleResolve(alert._id)}
                        style={{
                          width: "100%", padding: "10px", borderRadius: "var(--radius-sm)",
                          background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
                          color: "#86efac", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(34,197,94,0.18)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(34,197,94,0.1)"}>
                        ✓ Mark as Resolved
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};

export default LiveDashboard;
