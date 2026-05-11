import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("voh_user");
  if (stored) {
    try {
      const { token } = JSON.parse(stored);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {}
  }
  return config;
});

// ── Auth ──
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (name, email, password, phone) =>
    api.post("/auth/register", { name, email, password, phone }),
  getProfile: () => api.get("/auth/profile"),
};

// ── Contacts ──
export const contactsAPI = {
  getAll: () => api.get("/contacts"),
  add: (data) => api.post("/contacts", data),
  remove: (id) => api.delete(`/contacts/${id}`),
};

// ── SOS ──
export const sosAPI = {
  send: (location, triggeredBy = "BUTTON") =>
    api.post("/sos/send", { location, triggeredBy }),
  getHistory: () => api.get("/sos/history"),
  resolve: (id) => api.patch(`/sos/${id}/resolve`),
};
