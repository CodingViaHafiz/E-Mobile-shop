import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiClock,
  FiMail,
  FiMessageSquare,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import { AdminLayout } from "../components/AdminLayout";
import { AdminPageHeader } from "../components/AdminPageHeader";
import { AdminStatCard } from "../components/AdminStatCard";
import { contactMessageApi } from "../services/contactMessages";

const sectionMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

const STATUS_OPTIONS = ["new", "read", "replied", "closed"];

const statusTone = {
  new: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  read: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  replied: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  closed: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
};

const formatLabel = (value = "") =>
  value.charAt(0).toUpperCase() + value.slice(1);

const compactDate = (value) =>
  new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export const AdminMessages = () => {
  const [messageData, setMessageData] = useState({
    messages: [],
    unreadCount: 0,
    pagination: {
      page: 1,
      total: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState("");
  const [noteDrafts, setNoteDrafts] = useState({});

  const loadMessages = async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      const data = await contactMessageApi.getAdminMessages({
        search,
        status: statusFilter,
        page,
        limit: 10,
      });
      setMessageData(data);
      setNoteDrafts((current) => {
        const nextDrafts = { ...current };

        data.messages.forEach((message) => {
          if (nextDrafts[message._id] === undefined) {
            nextDrafts[message._id] = message.adminNote || "";
          }
        });

        return nextDrafts;
      });
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Failed to load messages");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [search, statusFilter, page]);

  const summary = useMemo(() => {
    const messages = messageData.messages || [];

    return {
      new: messageData.unreadCount || 0,
      visible: messages.length,
      replied: messages.filter((message) => message.status === "replied").length,
      closed: messages.filter((message) => message.status === "closed").length,
    };
  }, [messageData.messages, messageData.unreadCount]);

  const stats = [
    {
      label: "New messages",
      value: summary.new,
      icon: FiMail,
      accent: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      hint: "Messages still waiting for admin attention",
    },
    {
      label: "Visible",
      value: summary.visible,
      icon: FiMessageSquare,
      accent: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
      hint: "Messages shown in the current result set",
    },
    {
      label: "Replied",
      value: summary.replied,
      icon: FiCheckCircle,
      accent: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
      hint: "Visible messages marked as replied",
    },
    {
      label: "Closed",
      value: summary.closed,
      icon: FiClock,
      accent: "linear-gradient(135deg, #64748b 0%, #334155 100%)",
      hint: "Visible messages closed by admins",
    },
  ];

  const handleUpdateMessage = async (messageId, updates) => {
    try {
      setUpdatingId(messageId);
      setError("");
      setFeedback("");
      await contactMessageApi.updateMessage(messageId, updates);
      setFeedback("Message updated successfully");
      await loadMessages(true);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Failed to update message");
    } finally {
      setUpdatingId("");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      setUpdatingId(messageId);
      setError("");
      setFeedback("");
      await contactMessageApi.deleteMessage(messageId);
      setFeedback("Message deleted successfully");
      await loadMessages(true);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Failed to delete message");
    } finally {
      setUpdatingId("");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-panel flex min-h-[70vh] items-center justify-center p-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            <p className="mt-4 text-sm font-semibold text-slate-600">
              Loading messages...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminPageHeader
          eyebrow="Messages"
          title="Customer Messages"
          description="Review contact form submissions, mark progress, and keep admin notes for follow-up."
          meta={[
            `${messageData.pagination.total || 0} total messages`,
            `${messageData.unreadCount || 0} new`,
            `${statusFilter === "all" ? "all statuses" : formatLabel(statusFilter)}`,
          ]}
          actions={
            <button onClick={() => loadMessages(true)} className="admin-button-primary">
              <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          }
        />

        {feedback && (
          <div className="admin-panel border-emerald-200/80 bg-emerald-50/90 p-4 text-sm font-semibold text-emerald-700">
            {feedback}
          </div>
        )}

        {error && (
          <div className="admin-panel border-red-200/80 bg-red-50/90 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <motion.div key={stat.label} {...sectionMotion}>
              <AdminStatCard {...stat} />
            </motion.div>
          ))}
        </div>

        <motion.section {...sectionMotion} className="admin-section !p-0 overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-4 sm:px-6">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_140px]">
              <div className="relative">
                <FiSearch
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => {
                    setPage(1);
                    setSearch(event.target.value);
                  }}
                  placeholder="Search name, email, phone, subject, or message"
                  className="admin-input pl-11"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => {
                  setPage(1);
                  setStatusFilter(event.target.value);
                }}
                className="admin-select w-full"
              >
                <option value="all">All statuses</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {formatLabel(status)}
                  </option>
                ))}
              </select>

              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600">
                {messageData.pagination.total || 0} results
              </div>
            </div>
          </div>

          {messageData.messages?.length > 0 ? (
            <>
              <div className="divide-y divide-slate-200">
                {messageData.messages.map((message) => (
                  <article
                    key={message._id}
                    className="grid gap-5 px-4 py-5 transition hover:bg-slate-50/70 xl:grid-cols-[1fr_1.4fr_260px] sm:px-6"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-slate-950">{message.name}</p>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${statusTone[message.status]}`}
                        >
                          {formatLabel(message.status)}
                        </span>
                      </div>
                      <p className="mt-2 truncate text-sm text-slate-600">{message.email}</p>
                      <p className="mt-1 text-sm text-slate-500">{message.phone}</p>
                      <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                        {compactDate(message.createdAt)}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-lg font-black tracking-tight text-slate-950">
                        {message.subject}
                      </h2>
                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                        {message.message}
                      </p>
                      {message.handledBy && (
                        <p className="mt-3 text-xs font-semibold text-slate-500">
                          Last handled by {message.handledBy.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <select
                        value={message.status}
                        disabled={updatingId === message._id}
                        onChange={(event) =>
                          handleUpdateMessage(message._id, { status: event.target.value })
                        }
                        className="admin-select w-full"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {formatLabel(status)}
                          </option>
                        ))}
                      </select>

                      <textarea
                        value={noteDrafts[message._id] ?? ""}
                        disabled={updatingId === message._id}
                        onChange={(event) =>
                          setNoteDrafts((current) => ({
                            ...current,
                            [message._id]: event.target.value,
                          }))
                        }
                        rows={4}
                        placeholder="Admin note"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          disabled={updatingId === message._id}
                          onClick={() =>
                            handleUpdateMessage(message._id, {
                              adminNote: noteDrafts[message._id] ?? "",
                            })
                          }
                          className="admin-button-secondary w-full disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Save note
                        </button>
                        <button
                          type="button"
                          disabled={updatingId === message._id}
                          onClick={() => handleDeleteMessage(message._id)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-100 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <FiTrash2 />
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="border-t border-slate-200 bg-slate-50/70 px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-slate-600">
                    Page {messageData.pagination.page} of {messageData.pagination.totalPages}
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:flex">
                    <button
                      type="button"
                      disabled={!messageData.pagination.hasPreviousPage}
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      className="admin-button-secondary w-full disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={!messageData.pagination.hasNextPage}
                      onClick={() => setPage((current) => current + 1)}
                      className="admin-button-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <FiMessageSquare size={24} />
              </div>
              <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-950">
                No messages found
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Customer contact messages will appear here after they submit the form.
              </p>
            </div>
          )}
        </motion.section>
      </div>
    </AdminLayout>
  );
};
