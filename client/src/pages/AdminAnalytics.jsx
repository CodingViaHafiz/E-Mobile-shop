import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FiActivity,
  FiPieChart,
  FiRefreshCw,
  FiShield,
  FiTrendingUp,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";
import axiosInstance from "../services/api";
import { AdminLayout } from "../components/AdminLayout";
import { AdminPageHeader } from "../components/AdminPageHeader";
import { AdminStatCard } from "../components/AdminStatCard";
import { COLORS } from "../constants/designTokens";

const sectionMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export const AdminAnalytics = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchAnalytics = async (silent = false) => {
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
        requestError?.response?.data?.message || "Failed to load analytics"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const stats = dashboard?.stats || {};
  const users = dashboard?.users || [];
  const recentUsers = dashboard?.recentUsers || [];

  const metrics = useMemo(() => {
    const totalUsers = stats.totalUsers || 0;
    const totalAdmins = stats.totalAdmins || 0;
    const activeUsers = stats.activeUsers || 0;
    const inactiveUsers = stats.inactiveUsers || 0;

    return {
      activeRate: totalUsers ? Math.round((activeUsers / totalUsers) * 100) : 0,
      adminRate: totalUsers ? Math.round((totalAdmins / totalUsers) * 100) : 0,
      recentCount: recentUsers.length,
      inactiveUsers,
    };
  }, [recentUsers.length, stats]);

  const statCards = [
    {
      label: "Engagement rate",
      value: `${metrics.activeRate}%`,
      icon: FiTrendingUp,
      accent: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
      hint: "Accounts currently active",
    },
    {
      label: "Admin coverage",
      value: `${metrics.adminRate}%`,
      icon: FiShield,
      accent: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      hint: "Operational access footprint",
    },
    {
      label: "Recent signups",
      value: metrics.recentCount,
      icon: FiUserPlus,
      accent: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
      hint: "Latest five accounts",
    },
    {
      label: "Inactive users",
      value: metrics.inactiveUsers,
      icon: FiUsers,
      accent: "linear-gradient(135deg, #fb7185 0%, #dc2626 100%)",
      hint: "Accounts needing review",
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-panel flex min-h-[70vh] items-center justify-center p-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            <p className="mt-4 text-sm font-semibold text-slate-600">
              Loading analytics...
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
          eyebrow="Analytics Preview"
          title="Track account health without a cluttered screen"
          description="This page turns the current admin data into a lightweight control-room view so the analytics nav item lands on a real, polished destination."
          meta={[
            "Live account summary",
            "Built from dashboard data",
            "Preview-ready layout",
          ]}
          actions={
            <button
              onClick={() => fetchAnalytics(true)}
              className="admin-button-primary"
            >
              <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          }
        />

        {error && (
          <div className="admin-panel border-red-200/80 bg-red-50/90 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => (
            <motion.div key={stat.label} {...sectionMotion}>
              <AdminStatCard {...stat} />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <motion.section {...sectionMotion} className="admin-section">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <FiPieChart size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-950">
                  Audience mix
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  A simple snapshot of active, inactive, and admin account distribution.
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-600">
                  <span>Active users</span>
                  <span>{stats.activeUsers || 0}</span>
                </div>
                <div className="h-4 rounded-full bg-slate-200">
                  <div
                    className="h-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                    style={{ width: `${metrics.activeRate}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-600">
                  <span>Admin accounts</span>
                  <span>{stats.totalAdmins || 0}</span>
                </div>
                <div className="h-4 rounded-full bg-slate-200">
                  <div
                    className="h-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                    style={{ width: `${metrics.adminRate}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-600">
                  <span>Inactive users</span>
                  <span>{stats.inactiveUsers || 0}</span>
                </div>
                <div className="h-4 rounded-full bg-slate-200">
                  <div
                    className="h-4 rounded-full bg-gradient-to-r from-rose-400 to-red-500"
                    style={{
                      width: `${
                        stats.totalUsers
                          ? Math.round(((stats.inactiveUsers || 0) / stats.totalUsers) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section {...sectionMotion} className="admin-section">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <FiActivity size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-950">
                  Recent activity
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  The latest accounts created in the system.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {recentUsers.length > 0 ? (
                recentUsers.map((entry) => (
                  <div
                    key={entry._id}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-950">{entry.name}</p>
                        <p className="mt-1 text-sm text-slate-600">{entry.email}</p>
                      </div>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                        {entry.role}
                      </span>
                    </div>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Joined {new Date(entry.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="admin-soft-panel p-5 text-sm text-slate-600">
                  No recent activity yet.
                </div>
              )}
            </div>
          </motion.section>
        </div>

        <motion.section {...sectionMotion} className="admin-section">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <FiTrendingUp size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">
                Notes
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                This preview uses current user/account data rather than long-term reporting.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="admin-soft-panel p-5 text-sm leading-6 text-slate-600">
              Total tracked accounts: <span className="font-bold text-slate-950">{users.length}</span>
            </div>
            <div className="admin-soft-panel p-5 text-sm leading-6 text-slate-600">
              Highest operational risk: <span className="font-bold text-slate-950">inactive account review</span>
            </div>
            <div className="admin-soft-panel p-5 text-sm leading-6 text-slate-600">
              Best next backend upgrade: <span className="font-bold text-slate-950">time-series analytics endpoints</span>
            </div>
          </div>
        </motion.section>
      </div>
    </AdminLayout>
  );
};
