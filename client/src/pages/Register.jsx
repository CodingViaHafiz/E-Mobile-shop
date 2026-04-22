import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiCheck } from "react-icons/fi";
import { useAuth } from "../store/AuthContext";
import { COLORS, ANIMATIONS } from "../constants/designTokens";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

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
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
      }}
    >
      {/* Decorative elements */}
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, white 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, white 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        className="w-full max-w-md relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back Button */}
        <motion.button
          variants={itemVariants}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-blue-100 transition-colors duration-300 mb-8 font-medium"
        >
          <FiArrowLeft size={20} />
          Back
        </motion.button>

        {/* Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-10"
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
        >
          {/* Logo / Title */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
              }}
            >
              EM
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Create Account
            </h1>
            <p className="text-neutral-600">Join E-Mobile and start shopping</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl border-2 border-red-200"
              style={{
                background: "#fee2e2",
                borderColor: "#fecaca",
              }}
            >
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-neutral-700 font-semibold mb-2">
                Full Name
              </label>
              <div className="relative">
                <FiUser
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                  size={20}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  placeholder="John Doe"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-blue-600 focus:outline-none transition-all duration-300 bg-neutral-50"
                />
              </div>
            </motion.div>

            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-neutral-700 font-semibold mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-blue-600 focus:outline-none transition-all duration-300 bg-neutral-50"
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-neutral-700 font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-neutral-200 focus:border-blue-600 focus:outline-none transition-all duration-300 bg-neutral-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors duration-300"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div
                    className="h-1 flex-1 rounded-full transition-all duration-300"
                    style={{
                      background:
                        passwordStrength === "strong"
                          ? "#10b981"
                          : passwordStrength === "medium"
                            ? "#f59e0b"
                            : "#ef4444",
                    }}
                  />
                  <span className="text-xs font-medium text-neutral-600">
                    {passwordStrength === "strong"
                      ? "Strong"
                      : passwordStrength === "medium"
                        ? "Medium"
                        : "Weak"}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-neutral-700 font-semibold mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                  size={20}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-neutral-200 focus:border-blue-600 focus:outline-none transition-all duration-300 bg-neutral-50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors duration-300"
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
                    Passwords match
                  </div>
                )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl font-bold text-lg text-white transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"
                  />
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div variants={itemVariants} className="my-6 flex items-center">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="px-4 text-neutral-500 text-sm">Already registered?</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </motion.div>

          {/* Sign In Link */}
          <motion.div variants={itemVariants}>
            <Link
              to="/login"
              className="w-full py-3 rounded-xl font-bold text-lg transition-all duration-300 border-2 text-center"
              style={{
                borderColor: COLORS.primary.main,
                color: COLORS.primary.main,
                backgroundColor: `${COLORS.primary.main}10`,
              }}
            >
              Sign In
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
