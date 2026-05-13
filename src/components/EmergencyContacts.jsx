import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Trash2, Phone, Users, Loader2, X } from "lucide-react";
import { contactsAPI } from "../services/api";
import "../App.css";

const relationships = ["Family", "Friend", "Partner", "Colleague", "Neighbor", "Other"];

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    relation: "Family",
  });
  const [error, setError] = useState("");

  const fetchContacts = async () => {
    try {
      const res = await contactsAPI.getAll();
      setContacts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchContacts().finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setAdding(true);

      await contactsAPI.create(formData);

      setFormData({
        name: "",
        phone: "",
        email: "",
        relation: "Family",
      });

      setShowForm(false);
      fetchContacts();
    } catch (error) {
      console.log(error);
      setError(
        error.response?.data?.message ||
          "Failed to add contact. Please try again."
      );
    } finally {
      setAdding(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id) => {
    try {
      await contactsAPI.remove(id);
      fetchContacts();
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const getInitials = (name) => name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  const relationshipColors = {
    Family: "#ec4899", Friend: "#8b5cf6", Partner: "#ef4444",
    Colleague: "#06b6d4", Neighbor: "#f59e0b", Other: "#64748b"
  };

  return (
    <section id="contacts" style={{ padding: "6rem 2rem", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            flexWrap: "wrap", gap: 16, marginBottom: "3rem" }}>
          <div>
            <h2 className="section-title">
              Emergency <span className="gradient-text">Trusted Contacts</span>
            </h2>
            <p className="section-subtitle">People who receive your SOS alerts instantly.</p>
          </div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
            style={{ padding: "12px 24px", display: "flex", alignItems: "center", gap: 8, fontSize: "0.9rem" }}>
            <UserPlus size={17} /> Add Contact
          </motion.button>
        </motion.div>

        {/* Add contact form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              style={{ overflow: "hidden", marginBottom: "2rem" }}>
              <div style={{
                background: "var(--bg-card)", border: "1px solid var(--border-pink)",
                borderRadius: "var(--radius-lg)", padding: "2rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                  <h3 style={{ fontWeight: 700, fontSize: "1.05rem" }}>Add Emergency Contact</h3>
                  <button onClick={() => setShowForm(false)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                    <X size={18} />
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem" }}
                  className="form-grid">
                  <input className="input-field" placeholder="Full Name"
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  <input className="input-field" placeholder="Phone Number"
                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full bg-[#151827] text-white border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-pink-500"
                  />
                  <select
                    name="relation"
                    value={formData.relation}
                    onChange={handleChange}
                    className="w-full bg-[#151827] text-white border border-pink-500/50 rounded-xl px-5 py-4 outline-none"
                  >
                    <option className="bg-[#151827] text-white" value="Family">
                      Family
                    </option>
                    <option className="bg-[#151827] text-white" value="Friend">
                      Friend
                    </option>
                    <option className="bg-[#151827] text-white" value="Neighbor">
                      Neighbor
                    </option>
                    <option className="bg-[#151827] text-white" value="Police">
                      Police
                    </option>
                    <option className="bg-[#151827] text-white" value="Doctor">
                      Doctor
                    </option>
                  </select>
                </div>
                {error && <p style={{ color: "#fca5a5", fontSize: "0.85rem", marginTop: "0.75rem" }}>{error}</p>}
                <div style={{ display: "flex", gap: 10, marginTop: "1.25rem" }}>
                  <button onClick={handleSubmit} disabled={adding}
                    className="btn-primary"
                    style={{ padding: "11px 28px", display: "flex", alignItems: "center", gap: 8,
                      opacity: adding ? 0.7 : 1, fontSize: "0.9rem" }}>
                    {adding ? <Loader2 size={16} style={{ animation: "spin-slow 0.6s linear infinite" }} /> : <UserPlus size={16} />}
                    {adding ? "Adding…" : "Save Contact"}
                  </button>
                  <button onClick={() => setShowForm(false)} className="btn-ghost"
                    style={{ padding: "11px 20px", fontSize: "0.9rem" }}>Cancel</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact list */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton" style={{ height: 120, borderRadius: "var(--radius-lg)" }} />
            ))}
          </div>
        ) : contacts.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              textAlign: "center", padding: "4rem 2rem",
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)",
            }}>
            <Users size={52} color="var(--text-muted)" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ fontWeight: 700, fontSize: "1.15rem", marginBottom: 8 }}>No Contacts Yet</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Add trusted people who will be alerted in emergencies.
            </p>
          </motion.div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
            <AnimatePresence>
              {contacts.map((c, i) => (
                <motion.div key={c._id || i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -4 }}
                  style={{
                    background: "var(--bg-card)", border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)", padding: "1.5rem",
                    display: "flex", alignItems: "center", gap: 16,
                    transition: "border-color 0.3s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-pink)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>

                  {/* Avatar */}
                  <div style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${relationshipColors[c.relation] || "#ec4899"}, var(--purple))`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: "1.1rem", flexShrink: 0,
                    boxShadow: `0 0 16px ${(relationshipColors[c.relation] || "#ec4899")}40`,
                  }}>
                    {getInitials(c.name)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <h4 style={{ fontWeight: 700, fontSize: "1rem" }}
                        className="truncate">{c.name}</h4>
                      <span style={{
                        fontSize: "0.68rem", padding: "2px 8px", borderRadius: 100, fontWeight: 600,
                        background: (relationshipColors[c.relation] || "#ec4899") + "18",
                        color: relationshipColors[c.relation] || "#ec4899",
                        border: `1px solid ${(relationshipColors[c.relation] || "#ec4899")}30`,
                        whiteSpace: "nowrap",
                      }}>{c.relation}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                      <Phone size={13} /> {c.phone}
                    </div>
                  </div>

                  <button onClick={() => setDeleteConfirm(c._id)}
                    style={{
                      background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
                      borderRadius: 10, padding: "8px", cursor: "pointer", color: "#fca5a5",
                      flexShrink: 0, transition: "all 0.2s", display: "flex",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.18)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}>
                    <Trash2 size={15} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Delete confirm modal */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{
                position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(8px)", zIndex: 200,
                display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
              }}
              onClick={() => setDeleteConfirm(null)}>
              <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
                onClick={e => e.stopPropagation()}
                style={{
                  background: "#0f172a", border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: "var(--radius-lg)", padding: "2rem", maxWidth: 380, width: "100%",
                  textAlign: "center",
                }}>
                <Trash2 size={40} color="#ef4444" style={{ margin: "0 auto 1rem" }} />
                <h3 style={{ fontWeight: 700, fontSize: "1.15rem", marginBottom: 8 }}>Remove Contact?</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                  This contact won't receive future SOS alerts.
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setDeleteConfirm(null)} className="btn-ghost"
                    style={{ flex: 1, padding: "11px" }}>Cancel</button>
                  <button onClick={() => handleDelete(deleteConfirm)}
                    style={{
                      flex: 1, padding: "11px",
                      background: "linear-gradient(135deg,#ef4444,#ec4899)",
                      border: "none", borderRadius: "var(--radius-sm)", color: "white",
                      fontWeight: 700, cursor: "pointer", fontSize: "0.9rem",
                    }}>Delete</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @media(max-width:640px){ .form-grid{ grid-template-columns:1fr !important; } }
        .truncate{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      `}</style>
    </section>
  );
};

export default EmergencyContacts;
