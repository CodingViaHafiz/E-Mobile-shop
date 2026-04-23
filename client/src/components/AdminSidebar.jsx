import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiHome,
  FiBox,
  // FiBarChart3,
  FiUsers,
  FiTrendingUp,
  FiSettings,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";
import { useAuth } from "../store/AuthContext";

export const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    {
      label: "Dashboard",
      icon: FiHome,
      path: "/admin",
      badge: null,
    },
    {
      label: "Inventory",
      icon: FiBox,
      path: "/admin/inventory",
      badge: null,
    },
    {
      label: "Users",
      icon: FiUsers,
      path: "/admin/users",
      badge: null,
    },
    {
      label: "Analytics",
      icon: FiTrendingUp,
      path: "/admin/analytics",
      badge: "Soon",
    },
    {
      label: "Settings",
      icon: FiSettings,
      path: "/admin/settings",
      badge: null,
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-20 left-4 z-40 p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 top-16"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        exit={{ x: -280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed lg:static top-16 left-0 w-72 h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 z-40 flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-black text-white mb-1">E-Mobile</h2>
          <p className="text-xs text-slate-400 font-semibold">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="group relative"
              >
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${active
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                >
                  <Icon size={20} />
                  <span className="flex-1">{item.label}</span>

                  {item.badge && (
                    <span className="px-2 py-1 text-xs font-bold rounded-full bg-yellow-500 text-slate-900">
                      {item.badge}
                    </span>
                  )}

                  {active && <FiChevronRight size={18} />}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-slate-300 hover:bg-red-600 hover:text-white transition-all duration-300"
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>
    </>
  );
};
