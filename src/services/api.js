import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");

    if (!token) {
      const vohUser = localStorage.getItem("voh_user");

      if (vohUser) {
        try {
          const parsedUser = JSON.parse(vohUser);
          token = parsedUser?.token || parsedUser?.accessToken;
        } catch (error) {
          console.log("Invalid voh_user in localStorage");
        }
      }
    }

    if (!token) {
      const userInfo = localStorage.getItem("userInfo");

      if (userInfo) {
        try {
          const parsedUserInfo = JSON.parse(userInfo);
          token = parsedUserInfo?.token || parsedUserInfo?.accessToken;
        } catch (error) {
          console.log("Invalid userInfo in localStorage");
        }
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
  profile: () => API.get("/auth/profile"),
};

export const sosAPI = {
  sendSOS: (data) => API.post("/sos/send", data),
  getHistory: () => API.get("/sos/history"),
  updateStatus: (id, status) =>
    API.patch(`/sos/${id}/status`, { status }),
  updateEvidence: (id, evidenceUrl) =>
    API.patch(`/sos/${id}/evidence`, { evidenceUrl }),
};

export const contactAPI = {
  getContacts: () => API.get("/contacts"),
  addContact: (data) => API.post("/contacts", data),
  deleteContact: (id) => API.delete(`/contacts/${id}`),

  getAll: () => API.get("/contacts"),
  create: (data) => API.post("/contacts", data),
  remove: (id) => API.delete(`/contacts/${id}`),
};

export const contactsAPI = contactAPI;

export default API;
