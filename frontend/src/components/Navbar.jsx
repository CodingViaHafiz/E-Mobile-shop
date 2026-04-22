import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiShoppingBag, FiUser, FiSettings, FiLogOut } from "react-icons/fi";

const navItems = [
  { path: "/", icon: FiHome, label: "Home" },
  { path: "/shop", icon: FiShoppingBag, label: "Shop" },
  { path: "/profile", icon: FiUser, label: "Profile" },
  { path: "/settings", icon: FiSettings, label: "Settings" },
  { path: "/account", icon: FiLogOut, label: "Account" },
];

export const Navbar = () => {
  const { pathname } = useLocation();

  const isActive = (path) => pathname === path;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
        <div className="w-full flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            E-Mobile
          </h1>

          <div className="flex gap-2">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition ${isActive(path)
                    ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <Icon className="text-xl" />
                <span className="hidden lg:inline">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl border-t border-gray-200">
        <div className="flex justify-around items-center h-20">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition ${isActive(path)
                  ? "bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <Icon className="text-2xl" />
              <span className="text-xs font-semibold">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};