import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiCheck, FiMail, FiPhone, FiSend, FiUser } from "react-icons/fi";
import { authRequestApi } from "../services/authRequests";

export const ForgotPassword = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      setFeedback("");
      const data = await authRequestApi.createPasswordResetRequest(form);
      setFeedback(data.message || "Password reset request sent to admin");
      setForm({ name: "", email: "", phone: "", note: "" });
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Failed to send password reset request",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 p-6 shadow-xl shadow-slate-900/10 sm:p-8"
      >
        <Link
          to="/login"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
        >
          <FiArrowLeft />
          Back to login
        </Link>

        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
            Account recovery
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            Request password reset
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Submit your details and an admin will verify your account, then set a
            temporary password for you.
          </p>
        </div>

        {feedback && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            <FiCheck />
            {feedback}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Full Name</span>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Email</span>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Phone</span>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="+92 300 0000000"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Note for admin
            </span>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={4}
              placeholder="Add any detail that helps admin verify your account"
              className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending request..." : "Send reset request"}
            <FiSend />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
