import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiCheck } from "react-icons/fi";
import { useAuth } from "../store/AuthContext";

export const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    const normalizedName = formData.name.trim();
    const normalizedEmail = formData.email.trim().toLowerCase();

    if (!normalizedName) {
      return { error: "Please enter your full name" };
    }

    if (!normalizedEmail) {
      return { error: "Please enter your email address" };
    }

    if (!emailPattern.test(normalizedEmail)) {
      return { error: "Please enter a valid email address" };
    }

    if (formData.password.length < 6) {
      return { error: "Password must be at least 6 characters" };
    }

    if (formData.password !== formData.confirmPassword) {
      return { error: "Passwords do not match" };
    }

    return {
      values: {
        name: normalizedName,
        email: normalizedEmail,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      },
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm();
    if (validation.error) {
      setError(validation.error);
      return;
    }

    const { name, email, password, confirmPassword } = validation.values;
    setLoading(true);
    const result = await register(name, email, password, confirmPassword);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const passwordStrength =
    formData.password.length >= 6
      ? formData.password.length >= 10
        ? "strong"
        : "medium"
      : "weak";

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Visual Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex flex-col justify-center space-y-12"
        >
          <div>
            <h1 className="text-6xl font-black text-slate-900 leading-tight mb-4">
              Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">E-Mobile</span>
            </h1>
            <p className="text-xl text-slate-600 font-medium">
              Discover premium mobile devices at the best prices
            </p>
          </div>

          {/* Simple Stats */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { value: "1000+", label: "Customers" },
              { value: "50+", label: "Brands" },
              { value: "24/7", label: "Support" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + idx * 0.1 }}
              >
                <p className="text-3xl font-black text-blue-600 mb-1">{stat.value}</p>
                <p className="text-sm text-slate-600 font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Simple Features */}
          <div className="space-y-3">
            {[
              "Exclusive member deals",
              "Secure checkout process",
              "Same-day shipping available"
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.08 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  ✓
                </div>
                <p className="text-slate-700 font-medium">{feature}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-2">
              Join <span className="text-blue-600">E-Mobile</span>
            </h1>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 shadow-xl border border-slate-200">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900">
                Create Account
              </h2>
              <p className="text-slate-600 mt-2 font-medium">
                Sign up to start shopping
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200"
              >
                <p className="text-red-700 text-sm font-semibold">{error}</p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    placeholder="John Doe"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-300 bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-300 placeholder-slate-400 text-slate-900 font-medium"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-300 bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-300 placeholder-slate-400 text-slate-900 font-medium"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder="Enter your password"
                    required
                    className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-slate-300 bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-300 placeholder-slate-400 text-slate-900 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div
                      className="h-1.5 flex-1 rounded-full transition-all duration-300"
                      style={{
                        background:
                          passwordStrength === "strong"
                            ? "#10b981"
                            : passwordStrength === "medium"
                              ? "#f59e0b"
                              : "#ef4444",
                      }}
                    />
                    <span className="text-xs font-semibold text-slate-600">
                      {passwordStrength === "strong"
                        ? "Strong"
                        : passwordStrength === "medium"
                          ? "Medium"
                          : "Weak"}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    required
                    className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-slate-300 bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-300 placeholder-slate-400 text-slate-900 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>
                </div>
                {formData.confirmPassword &&
                  formData.password === formData.confirmPassword && (
                    <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
                      <FiCheck size={16} />
                      <span className="font-semibold">Passwords match</span>
                    </div>
                  )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-300" />
              <span className="text-xs text-slate-500 font-semibold">OR</span>
              <div className="flex-1 h-px bg-slate-300" />
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-slate-600 font-medium">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
