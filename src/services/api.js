import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");

  if (userInfo) {
    const user = JSON.parse(userInfo);

    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }

  return config;
});

export const authAPI = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
  profile: () => API.get("/auth/profile"),
};

export const sosAPI = {
  sendSOS: (data) => API.post("/sos/send", data),
  getHistory: () => API.get("/sos/history"),
};

export const contactAPI = {
  getContacts: () => API.get("/contacts"),
  addContact: (data) => API.post("/contacts", data),
  deleteContact: (id) => API.delete(`/contacts/${id}`),
};

// alias because some components use contactsAPI
export const contactsAPI = contactAPI;

export default API;
