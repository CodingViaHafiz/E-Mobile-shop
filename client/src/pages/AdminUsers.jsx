import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiUserCheck,
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

export const AdminUsers = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchUsers = async (silent = false) => {
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
        requestError?.response?.data?.message || "Failed to load users"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const users = dashboard?.users || [];

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return users.filter((managedUser) => {
      const matchesSearch =
        !term ||
        managedUser.name?.toLowerCase().includes(term) ||
        managedUser.email?.toLowerCase().includes(term);

      const matchesRole =
        roleFilter === "all" || managedUser.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && managedUser.isActive) ||
        (statusFilter === "inactive" && !managedUser.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [roleFilter, searchTerm, statusFilter, users]);

  const handleUpdate = async (targetUser, updates) => {
    try {
      setUpdatingId(targetUser._id);
      setError("");
      await axiosInstance.patch(`/admin/users/${targetUser._id}`, updates);
      await fetchUsers(true);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message || "Failed to update user"
      );
    } finally {
      setUpdatingId("");
    }
  };

  const stats = [
    {
      label: "Visible users",
      value: filteredUsers.length,
      icon: FiUsers,
      accent: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
      hint: "Rows matching the current filters",
    },
    {
      label: "Admins",
      value: users.filter((entry) => entry.role === "admin").length,
      icon: FiShield,
      accent: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      hint: "Accounts with elevated permissions",
    },
    {
      label: "Active",
      value: users.filter((entry) => entry.isActive).length,
      icon: FiUserCheck,
      accent: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
      hint: "Able to access the storefront",
    },
    {
      label: "Inactive",
      value: users.filter((entry) => !entry.isActive).length,
      icon: FiUserX,
      accent: "linear-gradient(135deg, #fb7185 0%, #dc2626 100%)",
      hint: "Restricted from signing in",
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-panel flex min-h-[70vh] items-center justify-center p-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            <p className="mt-4 text-sm font-semibold text-slate-600">
              Loading users...
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
          eyebrow="User Management"
          title="Manage roles and account access"
          description="Search the team, filter for the exact users you need, and make role or access updates without squeezing those controls into the dashboard."
          meta={[
            `${users.length} total accounts`,
            `${users.filter((entry) => entry.isActive).length} active`,
            `${users.filter((entry) => entry.role === "admin").length} admins`,
          ]}
          actions={
            <button
              onClick={() => fetchUsers(true)}
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
          {stats.map((stat) => (
            <motion.div key={stat.label} {...sectionMotion}>
              <AdminStatCard {...stat} />
            </motion.div>
          ))}
        </div>

        <motion.section {...sectionMotion} className="admin-section space-y-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
            <div className="relative flex-1">
              <FiSearch
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name or email"
                className="admin-input pl-11"
              />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className="admin-select"
              >
                <option value="all">All roles</option>
                <option value="admin">Admins</option>
                <option value="user">Users</option>
              </select>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="admin-select"
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  <th className="px-4 py-4">User</th>
                  <th className="px-4 py-4">Role</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Joined</th>
                  <th className="px-4 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((managedUser) => {
                    const isSelf = managedUser._id === user?._id;
                    const isUpdating = updatingId === managedUser._id;

                    return (
                      <tr
                        key={managedUser._id}
                        className="border-b border-slate-200/80 align-top transition hover:bg-blue-50/40"
                      >
                        <td className="px-4 py-5">
                          <p className="font-bold text-slate-950">
                            {managedUser.name}
                            {isSelf ? " (You)" : ""}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            {managedUser.email}
                          </p>
                        </td>
                        <td className="px-4 py-5">
                          <span
                            className="inline-flex rounded-full px-3 py-1 text-sm font-semibold"
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
                        <td className="px-4 py-5">
                          <span
                            className="inline-flex rounded-full px-3 py-1 text-sm font-semibold"
                            style={{
                              background: managedUser.isActive ? "#dcfce7" : "#fee2e2",
                              color: managedUser.isActive ? "#15803d" : "#b91c1c",
                            }}
                          >
                            {managedUser.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-5 text-sm text-slate-600">
                          {new Date(managedUser.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-5">
                          <div className="flex flex-wrap gap-2">
                            <button
                              disabled={isSelf || isUpdating}
                              onClick={() =>
                                handleUpdate(managedUser, {
                                  role:
                                    managedUser.role === "admin" ? "user" : "admin",
                                })
                              }
                              className="admin-button-secondary px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {managedUser.role === "admin"
                                ? "Make user"
                                : "Make admin"}
                            </button>
                            <button
                              disabled={isSelf || isUpdating}
                              onClick={() =>
                                handleUpdate(managedUser, {
                                  isActive: !managedUser.isActive,
                                })
                              }
                              className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                managedUser.isActive
                                  ? "bg-rose-500 hover:bg-rose-600"
                                  : "bg-emerald-500 hover:bg-emerald-600"
                              }`}
                            >
                              {managedUser.isActive ? "Deactivate" : "Activate"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-16 text-center">
                      <div className="mx-auto max-w-md">
                        <p className="text-lg font-bold text-slate-950">
                          No users match these filters
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          Try broadening the search or resetting the role and status filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.section>
      </div>
    </AdminLayout>
  );
};
