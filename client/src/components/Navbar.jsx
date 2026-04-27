import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiHome,
  FiShoppingBag,
  FiUser,
  FiSettings,
  FiLogOut,
  FiShield,
  FiShoppingCart,
} from "react-icons/fi";
import { COLORS, Z_INDEX } from "../constants/designTokens";
import { useAuth } from "../store/AuthContext";
import { useCart } from "../store/CartContext";

export const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(null);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { itemCount } = useCart();

  const isActive = (path) => pathname === path;
  const baseItems = [
    { path: "/", icon: FiHome, label: "Home" },
    { path: "/shop", icon: FiShoppingBag, label: "Shop" },
    { path: "/cart", icon: FiShoppingCart, label: "Cart" },
    { path: "/contact", icon: FiUser, label: "Contact" },
  ];

  const navItems = isAuthenticated
    ? [
      ...baseItems,
      ...(isAdmin
        ? [{ path: "/admin", icon: FiShield, label: "Admin" }]
        : [
          { path: "/profile", icon: FiUser, label: "Profile" },
          { path: "/settings", icon: FiSettings, label: "Settings" },
        ]),
      { path: "/account", icon: FiUser, label: "Account" },
    ]
    : baseItems;

  const mobileItems = isAuthenticated
    ? isAdmin
      ? [
        { path: "/", icon: FiHome, label: "Home" },
        { path: "/shop", icon: FiShoppingBag, label: "Shop" },
        { path: "/admin", icon: FiShield, label: "Admin" },
        { path: "/account", icon: FiUser, label: "Account" },
      ]
      : [
        { path: "/", icon: FiHome, label: "Home" },
        { path: "/shop", icon: FiShoppingBag, label: "Shop" },
        { path: "/cart", icon: FiShoppingCart, label: "Cart" },
        { path: "/account", icon: FiUser, label: "Account" },
      ]
    : [
      { path: "/", icon: FiHome, label: "Home" },
      { path: "/shop", icon: FiShoppingBag, label: "Shop" },
      { path: "/cart", icon: FiShoppingCart, label: "Cart" },
      { path: "/login", icon: FiUser, label: "Login" },
    ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItemVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  };

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        className="hidden md:block fixed top-0 left-0 right-0 bg-white shadow-md border-b border-neutral-100"
        style={{ zIndex: Z_INDEX.fixed }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex-shrink-0"
          >
            <Link to="/" className="flex items-center gap-2 group cursor-pointer">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-lg transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
                }}
              >
                EM
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent hidden lg:inline">
                E-Mobile
              </span>
            </Link>
          </motion.div>

          {/* Navigation Items */}
          <motion.div
            className="flex gap-1 items-center"
            variants={containerVariants}
            animate="animate"
            initial="initial"
          >
            {navItems.map(({ path, icon: Icon, label }, index) => (
              <motion.div
                key={path}
                variants={navItemVariants}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                onHoverStart={() => setIsHovering(path)}
                onHoverEnd={() => setIsHovering(null)}
              >
                <Link
                  to={path}
                  className="relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 group"
                  style={{
                    color: isActive(path) ? COLORS.primary.main : COLORS.neutral.textLight,
                  }}
                >
                  {/* Active indicator background */}
                  {isActive(path) && (
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: `linear-gradient(135deg, rgba(40, 92, 204, 0.1) 0%, rgba(40, 92, 204, 0.05) 100%)`,
                      }}
                      layoutId="navActive"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Hover background */}
                  {!isActive(path) && isHovering === path && (
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-neutral-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}

                  <div className="relative z-10 flex items-center gap-2">
                    <div className="relative">
                      <Icon className="text-xl transition-transform duration-300 group-hover:scale-110" />
                      {path === "/cart" && itemCount > 0 && (
                        <span className="absolute -right-2 -top-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-slate-950 px-1 text-[10px] font-bold text-white">
                          {itemCount}
                        </span>
                      )}
                    </div>
                    <span className="hidden lg:inline">{label}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="hidden lg:block text-right">
                  <p className="text-sm font-bold text-neutral-900">{user?.name}</p>
                  <p className="text-xs uppercase tracking-wide text-neutral-500">
                    {user?.role}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl font-medium text-sm border border-neutral-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300 flex items-center gap-2"
                  style={{ color: "#dc2626" }}
                >
                  <FiLogOut />
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300"
                  style={{ color: COLORS.neutral.text }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl font-semibold text-sm text-white transition-all duration-300 shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
                  }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Bottom Navigation */}
      <motion.nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 shadow-2xl"
        style={{ zIndex: Z_INDEX.fixed }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex justify-around items-center h-20">
          {mobileItems.map(({ path, icon: Icon, label }, index) => (
            <motion.div
              key={path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
              className="flex-1 h-full flex items-center justify-center relative"
            >
              <Link
                to={path}
                className="flex flex-col items-center justify-center w-full h-full gap-1 relative group cursor-pointer transition-all duration-300"
                style={{
                  color: isActive(path) ? COLORS.primary.main : COLORS.neutral.textLight,
                }}
              >
                {/* Active indicator */}
                {isActive(path) && (
                  <motion.div
                    className="absolute inset-0 rounded-t-2xl"
                    style={{
                      background: `linear-gradient(135deg, rgba(40, 92, 204, 0.1) 0%, rgba(40, 92, 204, 0.05) 100%)`,
                    }}
                    layoutId="mobileNavActive"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Hover effect */}
                {!isActive(path) && (
                  <motion.div
                    className="absolute inset-0 rounded-t-2xl bg-neutral-50 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.2 }}
                  />
                )}

                <div className="relative z-10 text-2xl transition-transform duration-300 group-hover:scale-110">
                  <Icon />
                  {path === "/cart" && itemCount > 0 && (
                    <span className="absolute -right-3 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-slate-950 px-1 text-[10px] font-bold text-white">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold relative z-10">{label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.nav>
    </>
  );
};
