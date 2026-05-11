import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldAlert, Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import GlowBackground from "../components/GlowBackground";
import "../App.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Invalid credentials. Please try again."
      );
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", position: "relative" }}>
      <GlowBackground />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "var(--gradient-main)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1rem",
            boxShadow: "0 0 30px rgba(236,72,153,0.4)",
          }}>
            <ShieldAlert size={28} color="white" />
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.6rem", marginBottom: 6 }}>
            Welcome back
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Sign in to your Voice of Her account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: "2.5rem",
          backdropFilter: "blur(20px)",
        }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: 8, color: "var(--text-secondary)" }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input type="email" className="input-field" required
                  style={{ paddingLeft: 42 }}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: 8, color: "var(--text-secondary)" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input type={showPwd ? "text" : "password"} className="input-field" required
                  style={{ paddingLeft: 42, paddingRight: 44 }}
                  placeholder="Your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                  {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
                  borderRadius: 10, padding: "10px 14px", color: "#fca5a5", fontSize: "0.85rem" }}>
                {error}
              </motion.div>
            )}

            <motion.button type="submit" disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className="btn-primary"
              style={{ padding: "14px", fontSize: "1rem", opacity: loading ? 0.75 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 }}>
              {loading && <Loader2 size={18} style={{ animation: "spin-slow 0.7s linear infinite" }} />}
              {loading ? "Signing in…" : "Sign In"}
            </motion.button>
          </form>

          <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.88rem", marginTop: "1.5rem" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--pink)", fontWeight: 600, textDecoration: "none" }}>
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
