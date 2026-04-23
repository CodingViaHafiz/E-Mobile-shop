import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiActivity,
  FiShield,
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiRefreshCw,
} from "react-icons/fi";
import axiosInstance from "../services/api";
import { useAuth } from "../store/AuthContext";
import { AdminLayout } from "../components/AdminLayout";
import { COLORS } from "../constants/designTokens";

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const fetchDashboard = async () => {
    try {
      setError("");
      const { data } = await axiosInstance.get("/admin/dashboard");
      setDashboard(data);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Failed to load admin dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleUpdate = async (targetUser, updates) => {
    try {
      setUpdatingId(targetUser._id);
      setError("");
      await axiosInstance.patch(`/admin/users/${targetUser._id}`, updates);
      await fetchDashboard();
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Failed to update user"
      );
    } finally {
      setUpdatingId("");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen pt-8 pb-24 md:pb-8 flex items-center justify-center">
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto"
              style={{
                borderColor: COLORS.primary.main,
                borderTopColor: "transparent",
              }}
            ></div>
            <p className="text-slate-600 mt-4">Loading admin dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const stats = [
    {
      label: "Total Users",
      value: dashboard?.stats?.totalUsers || 0,
      icon: FiUsers,
      color: COLORS.primary.main,
    },
    {
      label: "Admins",
      value: dashboard?.stats?.totalAdmins || 0,
      icon: FiShield,
      color: "#f59e0b",
    },
    {
      label: "Active Accounts",
      value: dashboard?.stats?.activeUsers || 0,
      icon: FiUserCheck,
      color: "#10b981",
    },
    {
      label: "Inactive Accounts",
      value: dashboard?.stats?.inactiveUsers || 0,
      icon: FiUserX,
      color: "#ef4444",
    },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen pt-8 pb-24 md:pb-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Admin Dashboard
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-2">
                Manage your store team
              </h1>
              <p className="text-slate-600 text-lg mt-3">
                Welcome back, {user?.name}. You can review accounts, promote admins,
                and control account access from here.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchDashboard}
              className="px-5 py-3 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
              }}
            >
              <FiRefreshCw />
              Refresh
            </motion.button>
          </motion.div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl border-2 border-red-200 bg-red-50 text-red-700 font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div
                    className="w-12 h-12 rounded-2xl text-white flex items-center justify-center mb-4"
                    style={{ background: stat.color }}
                  >
                    <Icon size={24} />
                  </div>
                  <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                  <p className="text-4xl font-bold text-slate-900 mt-2">{stat.value}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-8">
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
                  <p className="text-slate-600 mt-1">
                    Promote admins, restore access, or deactivate accounts.
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
                  <FiActivity />
                  Live role controls
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px]">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-sm text-slate-500">
                      <th className="px-6 py-4 font-semibold">User</th>
                      <th className="px-6 py-4 font-semibold">Role</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Joined</th>
                      <th className="px-6 py-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard?.users?.map((managedUser) => {
                      const isSelf = managedUser._id === user?._id;
                      const isUpdating = updatingId === managedUser._id;

                      return (
                        <tr
                          key={managedUser._id}
                          className="border-t border-slate-200 align-top hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-5">
                            <p className="font-bold text-slate-900">
                              {managedUser.name}
                              {isSelf ? " (You)" : ""}
                            </p>
                            <p className="text-sm text-slate-600 mt-1">
                              {managedUser.email}
                            </p>
                          </td>
                          <td className="px-6 py-5">
                            <span
                              className="inline-flex px-3 py-1 rounded-full text-sm font-semibold"
                              style={{
                                background:
                                  managedUser.role === "admin"
                                    ? "#fef3c7"
                                    : `${COLORS.primary.main}15`,
                                color:
                                  managedUser.role === "admin"
                                    ? "#b45309"
                                    : COLORS.primary.main,
                              }}
                            >
                              {managedUser.role}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <span
                              className="inline-flex px-3 py-1 rounded-full text-sm font-semibold"
                              style={{
                                background: managedUser.isActive ? "#dcfce7" : "#fee2e2",
                                color: managedUser.isActive ? "#15803d" : "#b91c1c",
                              }}
                            >
                              {managedUser.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-sm text-slate-600">
                            {new Date(managedUser.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-wrap gap-2">
                              <button
                                disabled={isSelf || isUpdating}
                                onClick={() =>
                                  handleUpdate(managedUser, {
                                    role:
                                      managedUser.role === "admin" ? "user" : "admin",
                                  })
                                }
                                className="px-3 py-2 rounded-xl text-sm font-semibold border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                              >
                                {managedUser.role === "admin"
                                  ? "Make User"
                                  : "Make Admin"}
                              </button>
                              <button
                                disabled={isSelf || isUpdating}
                                onClick={() =>
                                  handleUpdate(managedUser, {
                                    isActive: !managedUser.isActive,
                                  })
                                }
                                className="px-3 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                style={{
                                  background: managedUser.isActive ? "#ef4444" : "#10b981",
                                }}
                              >
                                {managedUser.isActive ? "Deactivate" : "Activate"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.section>

            <motion.aside
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Recent Signups
                </h2>
                <div className="space-y-4">
                  {dashboard?.recentUsers?.map((recentUser) => (
                    <div
                      key={recentUser._id}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {recentUser.name}
                          </p>
                          <p className="text-sm text-slate-600 mt-1">
                            {recentUser.email}
                          </p>
                        </div>
                        <span className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                          {recentUser.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-3">
                        Joined {new Date(recentUser.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl p-6 text-white shadow-lg"
                style={{
                  background: `linear-gradient(145deg, ${COLORS.primary.dark} 0%, #0f172a 100%)`,
                }}
              >
                <p className="text-sm uppercase tracking-[0.2em] text-blue-100">
                  Admin Notes
                </p>
                <h3 className="text-2xl font-bold mt-3">Management rules</h3>
                <ul className="mt-4 space-y-3 text-sm text-blue-50">
                  <li>Only admins can open this dashboard and manage other accounts.</li>
                  <li>Guests can browse the storefront without creating an account.</li>
                  <li>Admins cannot remove their own admin role or deactivate themselves.</li>
                </ul>
              </div>
            </motion.aside>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
