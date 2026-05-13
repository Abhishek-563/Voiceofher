import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Menu, X, LogOut, User, Bell, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../App.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Features", href: "#features" },
    { label: "Live Tracking", href: "#tracking" },
    { label: "Contacts", href: "#contacts" },
  ];

  return (
    <>
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 2rem",
        height: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled
          ? "rgba(5,8,22,0.9)"
          : "rgba(5,8,22,0.4)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition: "all 0.3s ease",
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "var(--gradient-main)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(236,72,153,0.4)",
          }}>
            <ShieldAlert size={20} color="white" />
          </div>
          <span style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.15rem",
            background: "var(--gradient-main)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Voice of Her
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}
          className="hidden md:flex">
          {navLinks.map((l) => (
            <a key={l.label} href={l.href} className="nav-link">{l.label}</a>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user && (
            <>
              <Link to="/admin" style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 10, padding: "8px 12px",
                color: "var(--text-secondary)", textDecoration: "none",
                display: "flex", alignItems: "center", gap: 6,
                fontSize: "0.85rem", fontWeight: 500,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--pink)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <Shield size={15} /> <span className="hidden md:inline">Admin</span>
              </Link>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "6px 14px",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 100,
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "var(--gradient-main)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.75rem", fontWeight: 700,
                }}>
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span style={{ color: "white", fontWeight: 500 }}>{user?.name?.split(" ")[0]}</span>
              </div>
              <button onClick={handleLogout}
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 10, padding: "8px 12px",
                  color: "#fca5a5", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                  fontSize: "0.85rem", fontWeight: 500,
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.2)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
              >
                <LogOut size={15} /> <span className="hidden md:inline">Logout</span>
              </button>
            </>
          )}

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: 10, padding: 8, cursor: "pointer",
              color: "white", display: "flex",
            }}
            className="md:hidden">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            style={{
              position: "fixed", top: 70, right: 0, bottom: 0,
              width: 260, zIndex: 99,
              background: "rgba(5,8,22,0.97)",
              backdropFilter: "blur(20px)",
              borderLeft: "1px solid var(--border)",
              padding: "2rem 1.5rem",
              display: "flex", flexDirection: "column", gap: 20,
            }}>
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className="nav-link"
                style={{ fontSize: "1.05rem" }}
                onClick={() => setMobileOpen(false)}>
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div style={{ height: 70 }} />
    </>
  );
};

export default Navbar;