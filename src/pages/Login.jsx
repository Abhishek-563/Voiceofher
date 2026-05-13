import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await login(formData.email, formData.password);

      navigate("/");
    } catch (error) {
      console.log(error);
      setError(
        error.response?.data?.message || "Login failed. Check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mb-4">
            <ShieldCheck size={34} />
          </div>

          <h1 className="text-4xl font-black">Login</h1>
          <p className="text-gray-400 mt-2">
            Continue to Voice of Her safety system
          </p>
        </div>

        {error && (
          <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              required
              className="w-full bg-[#111426] border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-pink-500 text-white"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full bg-[#111426] border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-pink-500 text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-lg hover:scale-[1.02] transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-7">
          Don’t have an account?{" "}
          <Link to="/register" className="text-pink-400 font-bold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
