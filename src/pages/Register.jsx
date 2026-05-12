import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/register", formData);

      login(res.data);

      alert("Registration Successful");

      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 border border-white/10 p-10 rounded-3xl w-[400px]"
      >
        <h1 className="text-4xl font-black text-center mb-8">
          Register
        </h1>

        <div className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none"
          />

          <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 font-bold">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
