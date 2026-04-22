import React from "react";
import { useAuth } from "../store/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiMapPin,
  FiPhone,
  FiCalendar,
  FiLogOut,
  FiEdit2,
  FiShield,
} from "react-icons/fi";
import { COLORS } from "../constants/designTokens";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const membershipLevel = "Premium";
  const joinDate = "January 15, 2025";

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8" style={{ background: COLORS.neutral.bg }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-2">
            My Profile
          </h1>
          <p className="text-neutral-600 text-lg">Manage your account information</p>
        </motion.div>

        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Profile Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl shadow-lg border border-neutral-100 p-8 md:p-12"
            whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              {/* Avatar */}
              <motion.div
                className="w-32 h-32 rounded-2xl flex items-center justify-center text-5xl text-white flex-shrink-0 relative"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
                }}
                whileHover={{ scale: 1.05 }}
              >
                {user?.name?.charAt(0) || "👤"}
                <motion.div
                  className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              {/* Profile Info */}
              <div className="text-center md:text-left flex-1">
                <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                  {user?.name}
                </h2>
                <p className="text-neutral-600 text-lg mb-4">{user?.email}</p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <motion.div
                    className="px-4 py-2 rounded-full text-sm font-semibold"
                    style={{
                      background: `${COLORS.primary.main}20`,
                      color: COLORS.primary.main,
                    }}
                  >
                    {membershipLevel} Member
                  </motion.div>
                  <motion.div
                    className="px-4 py-2 rounded-full text-sm font-semibold"
                    style={{
                      background: `${COLORS.secondary.main}60`,
                      color: COLORS.neutral.text,
                    }}
                  >
                    {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"}
                  </motion.div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3 md:flex-col">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-xl font-semibold text-white flex items-center gap-2 transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
                  }}
                >
                  <FiEdit2 size={18} />
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-6 py-3 rounded-xl font-semibold border-2 flex items-center gap-2 transition-all duration-300 hover:bg-red-50"
                  style={{
                    borderColor: "#ef4444",
                    color: "#ef4444",
                  }}
                >
                  <FiLogOut size={18} />
                  Logout
                </motion.button>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-neutral-200 my-8" />

            {/* Account Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors duration-300"
                whileHover={{ x: 4 }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
                  }}
                >
                  <FiUser size={20} />
                </div>
                <div>
                  <p className="text-neutral-600 text-sm font-medium">Full Name</p>
                  <p className="text-lg font-bold text-neutral-900">{user?.name}</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors duration-300"
                whileHover={{ x: 4 }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
                  }}
                >
                  <FiMail size={20} />
                </div>
                <div>
                  <p className="text-neutral-600 text-sm font-medium">Email Address</p>
                  <p className="text-lg font-bold text-neutral-900">{user?.email}</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors duration-300"
                whileHover={{ x: 4 }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
                  }}
                >
                  <FiCalendar size={20} />
                </div>
                <div>
                  <p className="text-neutral-600 text-sm font-medium">Joined Date</p>
                  <p className="text-lg font-bold text-neutral-900">{joinDate}</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors duration-300"
                whileHover={{ x: 4 }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
                  }}
                >
                  <FiShield size={20} />
                </div>
                <div>
                  <p className="text-neutral-600 text-sm font-medium">Account Status</p>
                  <p className="text-lg font-bold text-green-600">Active</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Account Security */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl shadow-lg border border-neutral-100 p-8 md:p-12"
          >
            <h3 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
              <FiShield size={28} style={{ color: COLORS.primary.main }} />
              Security & Privacy
            </h3>
            <div className="space-y-4">
              <motion.button
                whileHover={{ x: 4 }}
                className="w-full p-4 rounded-xl border-2 border-neutral-200 text-left hover:border-blue-600 transition-all duration-300"
              >
                <p className="font-bold text-neutral-900">Change Password</p>
                <p className="text-sm text-neutral-600 mt-1">Update your password regularly</p>
              </motion.button>
              <motion.button
                whileHover={{ x: 4 }}
                className="w-full p-4 rounded-xl border-2 border-neutral-200 text-left hover:border-blue-600 transition-all duration-300"
              >
                <p className="font-bold text-neutral-900">Two-Factor Authentication</p>
                <p className="text-sm text-neutral-600 mt-1">Add an extra layer of security</p>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
