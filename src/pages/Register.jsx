import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldAlert, Eye, EyeOff, Loader2, Mail, Lock, User, Phone } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import GlowBackground from "../components/GlowBackground";
import "../App.css";

const strengthLabel = (pwd) => {
  if (!pwd) return null;
  if (pwd.length < 6) return { label: "Weak", color: "#ef4444", width: "25%" };
  if (pwd.length < 10) return { label: "Fair", color: "#f59e0b", width: "55%" };
  if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return { label: "Strong", color: "#22c55e", width: "100%" };
  return { label: "Good", color: "#06b6d4", width: "75%" };
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const strength = strengthLabel(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate("/");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please try again."
      );
    } finally { setLoading(false); }
  };

  const fields = [
    { key: "name", label: "Full Name", type: "text", placeholder: "Jane Doe", icon: User },
    { key: "email", label: "Email Address", type: "email", placeholder: "you@example.com", icon: Mail },
    { key: "phone", label: "Phone Number (optional)", type: "tel", placeholder: "+91 98765 43210", icon: Phone },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", position: "relative" }}>
      <GlowBackground />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "var(--gradient-main)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1rem", boxShadow: "0 0 30px rgba(236,72,153,0.4)",
          }}>
            <ShieldAlert size={28} color="white" />
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.6rem", marginBottom: 6 }}>
            Create your account
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Join Voice of Her — stay protected always
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
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.15rem" }}>
            {fields.map(({ key, label, type, placeholder, icon: Icon }) => (
              <div key={key}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: 7, color: "var(--text-secondary)" }}>
                  {label}
                </label>
                <div style={{ position: "relative" }}>
                  <Icon size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input type={type} className="input-field" required={key !== "phone"}
                    style={{ paddingLeft: 42 }} placeholder={placeholder}
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })} />
                </div>
              </div>
            ))}

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: 7, color: "var(--text-secondary)" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input type={showPwd ? "text" : "password"} className="input-field" required
                  style={{ paddingLeft: 42, paddingRight: 44 }}
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                  {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {/* Strength bar */}
              {strength && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ height: 4, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
                    <motion.div
                      animate={{ width: strength.width }}
                      style={{ height: "100%", background: strength.color, borderRadius: 4 }}
                      transition={{ duration: 0.3 }} />
                  </div>
                  <p style={{ fontSize: "0.75rem", color: strength.color, marginTop: 4, fontWeight: 500 }}>
                    {strength.label} password
                  </p>
                </div>
              )}
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
              {loading ? "Creating account…" : "Create Account"}
            </motion.button>
          </form>

          <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.88rem", marginTop: "1.5rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--pink)", fontWeight: 600, textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
