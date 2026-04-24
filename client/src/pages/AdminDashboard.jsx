import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiActivity,
  FiArrowRight,
  FiRefreshCw,
  FiShield,
  FiUserCheck,
  FiUserPlus,
  FiUserX,
  FiUsers,
} from "react-icons/fi";
import axiosInstance from "../services/api";
import { useAuth } from "../store/AuthContext";
import { AdminLayout } from "../components/AdminLayout";
import { AdminPageHeader } from "../components/AdminPageHeader";
import { AdminStatCard } from "../components/AdminStatCard";
import { COLORS } from "../constants/designTokens";

const sectionMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = [
    {
      label: "Total users",
      value: dashboard?.stats?.totalUsers || 0,
      icon: FiUsers,
      accent: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
      hint: "Everyone with an account in the store",
    },
    {
      label: "Admins",
      value: dashboard?.stats?.totalAdmins || 0,
      icon: FiShield,
      accent: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      hint: "Accounts with back-office access",
    },
    {
      label: "Active accounts",
      value: dashboard?.stats?.activeUsers || 0,
      icon: FiUserCheck,
      accent: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
      hint: "Customers and staff who can sign in",
    },
    {
      label: "Inactive accounts",
      value: dashboard?.stats?.inactiveUsers || 0,
      icon: FiUserX,
      accent: "linear-gradient(135deg, #fb7185 0%, #dc2626 100%)",
      hint: "Accounts currently restricted",
    },
  ];

  const recentUsers = dashboard?.recentUsers || [];
  const activeRate = dashboard?.stats?.totalUsers
    ? Math.round((dashboard.stats.activeUsers / dashboard.stats.totalUsers) * 100)
    : 0;
  const adminCoverage = dashboard?.stats?.totalUsers
    ? Math.round((dashboard.stats.totalAdmins / dashboard.stats.totalUsers) * 100)
    : 0;

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-panel flex min-h-[70vh] items-center justify-center p-8">
          <div className="text-center">
            <div
              className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"
            />
            <p className="mt-4 text-sm font-semibold text-slate-600">
              Loading admin dashboard...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <AdminPageHeader
          eyebrow="Admin Dashboard"
          title="See the whole back office at a glance"
          description={`Welcome back, ${user?.name || "Admin"}. This overview keeps the most important account, access, and activity signals in one place without making the dashboard feel crowded.`}
          meta={[
            `${activeRate}% active rate`,
            `${adminCoverage}% admin coverage`,
            `${recentUsers.length} recent signups`,
          ]}
          actions={
            <>
              <Link to="/admin/users" className="admin-button-secondary">
                Manage users
                <FiArrowRight />
              </Link>
              <button
                onClick={() => fetchDashboard(true)}
                className="admin-button-primary"
              >
                <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
                Refresh
              </button>
            </>
          }
        />

        {error && (
          <div className="admin-panel border-red-200/80 bg-red-50/90 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <motion.div key={stat.label} {...sectionMotion}>
              <AdminStatCard {...stat} />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.4fr_1fr]">
          <motion.section {...sectionMotion} className="admin-section">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="admin-chip">Team health</p>
                <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950">
                  Account signals
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Quick ratios to help you decide whether access management needs attention.
                </p>
              </div>
              <Link to="/admin/analytics" className="admin-button-secondary">
                Open analytics
              </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="admin-soft-panel p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-500">
                    Active account ratio
                  </p>
                  <span className="text-sm font-black text-slate-950">
                    {activeRate}%
                  </span>
                </div>
                <div className="mt-4 h-3 rounded-full bg-slate-200">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500"
                    style={{ width: `${activeRate}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  Most accounts are currently able to sign in and use the store.
                </p>
              </div>

              <div className="admin-soft-panel p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-500">
                    Admin share
                  </p>
                  <span className="text-sm font-black text-slate-950">
                    {adminCoverage}%
                  </span>
                </div>
                <div className="mt-4 h-3 rounded-full bg-slate-200">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                    style={{ width: `${adminCoverage}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  Keep admin access limited so operational controls stay safe.
                </p>
              </div>

              <div className="admin-soft-panel p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                    <FiUserPlus size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Newest account
                    </p>
                    <p className="mt-1 text-lg font-black text-slate-950">
                      {recentUsers[0]?.name || "No recent signups"}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-600">
                  {recentUsers[0]
                    ? `Joined ${new Date(recentUsers[0].createdAt).toLocaleString()}.`
                    : "Recent user activity will appear here."}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-950 p-5 text-white shadow-xl shadow-slate-950/15">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-blue-200">
                    <FiActivity size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-300">
                      Recommended action
                    </p>
                    <p className="mt-1 text-lg font-black">Review inactive users</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-300">
                  There are {dashboard?.stats?.inactiveUsers || 0} inactive accounts.
                  Confirm whether they are intentional restrictions or stale records.
                </p>
              </div>
            </div>
          </motion.section>

          <motion.aside {...sectionMotion} className="space-y-8">
            <section className="admin-section">
              <div className="flex items-center justify-between">
                <div>
                  <p className="admin-chip">Recent signups</p>
                  <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950">
                    Latest users
                  </h2>
                </div>
                <Link to="/admin/users" className="text-sm font-semibold text-blue-600">
                  View all
                </Link>
              </div>

              <div className="mt-6 space-y-3">
                {recentUsers.length > 0 ? (
                  recentUsers.map((recentUser) => (
                    <div
                      key={recentUser._id}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-4 transition hover:border-blue-200 hover:bg-blue-50/40"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-slate-950">{recentUser.name}</p>
                          <p className="mt-1 text-sm text-slate-600">
                            {recentUser.email}
                          </p>
                        </div>
                        <span className="rounded-full bg-slate-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                          {recentUser.role}
                        </span>
                      </div>
                      <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                        Joined {new Date(recentUser.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="admin-soft-panel p-5 text-sm text-slate-600">
                    No new signups yet.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-xl shadow-slate-950/20">
              <p className="admin-chip border-white/10 bg-white/5 text-blue-100">
                Admin notes
              </p>
              <h3 className="mt-4 text-2xl font-black tracking-tight">
                Keep operations predictable
              </h3>
              <div className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
                <p>Only admins can access this workspace and manage other accounts.</p>
                <p>Admins cannot remove their own admin role or deactivate themselves.</p>
                <p>
                  Use the dedicated users page when you need to change roles or account status.
                </p>
              </div>
            </section>
          </motion.aside>
        </div>
      </div>
    </AdminLayout>
  );
};
