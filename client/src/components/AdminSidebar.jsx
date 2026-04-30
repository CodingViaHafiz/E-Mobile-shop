import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  FiBox,
  FiHome,
  FiKey,
  FiLogOut,
  FiMenu,
  FiMessageSquare,
  FiShoppingBag,
  FiTrendingUp,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { COLORS } from "../constants/designTokens";
import { useAuth } from "../store/AuthContext";

export const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();

  const navItems = [
    { label: "Dashboard", icon: FiHome, path: "/admin" },
    { label: "Inventory", icon: FiBox, path: "/admin/inventory" },
    { label: "Orders", icon: FiShoppingBag, path: "/admin/orders" },
    { label: "Messages", icon: FiMessageSquare, path: "/admin/messages" },
    { label: "Password Resets", icon: FiKey, path: "/admin/password-resets" },
    { label: "Users", icon: FiUsers, path: "/admin/users" },
    { label: "Analytics", icon: FiTrendingUp, path: "/admin/analytics" },
  ];

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path) =>
    path === "/admin"
      ? location.pathname === path
      : location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((current) => !current)}
        className="fixed left-4 top-4 z-[70] flex h-11 w-11 items-center justify-center border border-blue-100 bg-white text-slate-900 shadow-lg shadow-blue-100/70 lg:hidden"
        aria-label={isOpen ? "Close admin menu" : "Open admin menu"}
      >
        {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-[60] flex w-72 flex-col border-r border-blue-100 bg-white text-slate-900 shadow-2xl shadow-blue-100/60 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div
          className="shrink-0 border-b border-blue-100 px-6 py-5 text-white"
          style={{
            background: `linear-gradient(180deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex rounded-full h-11 w-11 items-center justify-center border border-white/20 bg-white/15 text-lg font-black">
              EM
            </div>
            <div>
              <p className="text-2xl font-black tracking-tight">E-Mobile</p>
              <p className="text-xs uppercase tracking-[0.3em] text-blue-100">
                Admin Workspace
              </p>
            </div>
          </div>

          <div className="mt-4 border rounded-xl border-white/20 bg-white/10 px-4 py-3">
            <p className="text-sm font-semibold text-white">{user?.name || "Admin"}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-blue-100">
              {user?.role || "Administrator"}
            </p>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 no-scrollbar">
          <p className="px-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Navigation
          </p>

          <nav className="mt-3 space-y-2 pb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex rounded-xl items-center gap-3 border px-4 py-3 transition ${active
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-transparent bg-white text-slate-700 hover:border-blue-100 hover:bg-blue-50/60 hover:text-blue-700"
                    }`}
                >
                  <div
                    className={`flex h-6 w-10 items-center justify-center border ${active
                      ? "border-blue-200 bg-white text-blue-700"
                      : "border-blue-100 bg-blue-50 text-slate-500"
                      }`}
                  >
                    <Icon size={18} />
                  </div>
                  <span className="text-sm font-semibold">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="shrink-0 border-t border-blue-100 px-4 py-4 bg-white">
          <div className="space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 border border-blue-100 bg-blue-50 px-4 py-3 text-sm rounded-xl font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              <FiHome size={18} />
              <span>Home</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 border border-red-100 bg-white px-4 py-3 text-sm rounded-xl font-semibold text-red-600 transition hover:bg-red-50"
            >
              <FiLogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
