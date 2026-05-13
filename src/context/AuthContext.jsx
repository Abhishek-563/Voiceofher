import { createContext, useContext, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo")) || null
  );

  const login = async (emailOrUserData, password) => {
    if (typeof emailOrUserData === "object") {
      const userData = emailOrUserData;
      localStorage.setItem("userInfo", JSON.stringify(userData));
      setUser(userData);
      return userData;
    }

    const res = await API.post("/auth/login", {
      email: emailOrUserData,
      password,
    });

    localStorage.setItem("userInfo", JSON.stringify(res.data));
    setUser(res.data);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await API.post("/auth/register", {
      name,
      email,
      password,
    });

    localStorage.setItem("userInfo", JSON.stringify(res.data));
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
