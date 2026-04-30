import React, { useEffect, useState } from "react";
import { FiKey, FiRefreshCw } from "react-icons/fi";
import { AdminLayout } from "../components/AdminLayout";
import { AdminPageHeader } from "../components/AdminPageHeader";
import { authRequestApi } from "../services/authRequests";

const statusTone = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  rejected: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

export const AdminPasswordResets = () => {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("pending");
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await authRequestApi.getPasswordResetRequests(status);
      setRequests(data.requests || []);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Failed to load password reset requests",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [status]);

  const updateDraft = (id, field, value) => {
    setDrafts((current) => ({
      ...current,
      [id]: { ...(current[id] || {}), [field]: value },
    }));
  };

  const handleUpdate = async (request, nextStatus) => {
    const draft = drafts[request._id] || {};

    try {
      setUpdatingId(request._id);
      setError("");
      setFeedback("");
      await authRequestApi.updatePasswordResetRequest(request._id, {
        status: nextStatus,
        temporaryPassword: draft.temporaryPassword || "",
        adminNote: draft.adminNote || "",
      });
      setFeedback(
        nextStatus === "approved"
          ? "Temporary password set successfully"
          : "Password reset request rejected",
      );
      await loadRequests();
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Failed to update password reset request",
      );
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminPageHeader
          eyebrow="Security"
          title="Password Reset Requests"
          description="Verify users manually and set temporary passwords for approved reset requests."
          meta={[`${requests.length} visible requests`, status]}
          actions={
            <button onClick={loadRequests} className="admin-button-primary">
              <FiRefreshCw />
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

        <section className="admin-section !p-0 overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-4 sm:px-6">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="admin-select w-full sm:w-60"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="all">All</option>
            </select>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm font-semibold text-slate-600">
              Loading reset requests...
            </div>
          ) : requests.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {requests.map((request) => (
                <article key={request._id} className="grid gap-5 p-5 xl:grid-cols-[1fr_1.2fr]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-black text-slate-950">{request.name}</h2>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${statusTone[request.status]}`}
                      >
                        {request.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{request.email}</p>
                    <p className="mt-1 text-sm text-slate-600">{request.phone}</p>
                    <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                      {request.note || "No user note provided."}
                    </p>
                    {!request.user && (
                      <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                        No matching user account exists for this email.
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      disabled={request.status !== "pending" || updatingId === request._id}
                      value={drafts[request._id]?.temporaryPassword || ""}
                      onChange={(event) =>
                        updateDraft(request._id, "temporaryPassword", event.target.value)
                      }
                      placeholder="Temporary password for approval"
                      className="admin-input"
                    />
                    <textarea
                      disabled={request.status !== "pending" || updatingId === request._id}
                      value={drafts[request._id]?.adminNote || ""}
                      onChange={(event) =>
                        updateDraft(request._id, "adminNote", event.target.value)
                      }
                      placeholder="Admin note"
                      rows={3}
                      className="admin-input resize-none"
                    />

                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        disabled={request.status !== "pending" || updatingId === request._id}
                        onClick={() => handleUpdate(request, "approved")}
                        className="admin-button-primary disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FiKey />
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={request.status !== "pending" || updatingId === request._id}
                        onClick={() => handleUpdate(request, "rejected")}
                        className="admin-button-secondary disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-sm font-semibold text-slate-600">
              No password reset requests found.
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
};
