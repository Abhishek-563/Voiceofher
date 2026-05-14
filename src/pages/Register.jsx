import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
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

      await register(formData.name, formData.email, formData.password);

      navigate("/");
    } catch (error) {
      console.log(error);
      setError(
        error.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-5 py-10 relative overflow-hidden">
      <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] bg-pink-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-140px] right-[-140px] w-[360px] h-[360px] bg-purple-600/20 rounded-full blur-[130px]" />

      <div className="relative w-full max-w-[560px] bg-[#0f1222]/95 border border-white/10 rounded-[32px] p-8 sm:p-10 md:p-12 shadow-2xl shadow-purple-900/30">
        <div className="text-center mb-10">
          <div className="w-24 h-24 mx-auto rounded-[28px] bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-6 shadow-xl shadow-pink-500/30">
            <ShieldCheck size={48} />
          </div>

          <h1 className="text-5xl font-black tracking-wide">Register</h1>

          <p className="text-gray-400 mt-4 text-lg">
            Create your Voice of Her account
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl px-5 py-4 text-base">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Full Name
            </label>

            <div className="relative">
              <User
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                size={22}
              />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full h-16 bg-[#15192c] border border-white/10 rounded-2xl pl-14 pr-5 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-white text-base placeholder:text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Email Address
            </label>

            <div className="relative">
              <Mail
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                size={22}
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
                className="w-full h-16 bg-[#15192c] border border-white/10 rounded-2xl pl-14 pr-5 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-white text-base placeholder:text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Password
            </label>

            <div className="relative">
              <Lock
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                size={22}
              />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                minLength={6}
                className="w-full h-16 bg-[#15192c] border border-white/10 rounded-2xl pl-14 pr-5 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-white text-base placeholder:text-gray-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-16 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-xl shadow-lg shadow-pink-500/25 hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-8 text-lg">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-pink-400 font-bold hover:text-pink-300 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
