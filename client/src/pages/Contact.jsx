import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiAlertCircle,
  FiCheck,
  FiClock,
  FiMail,
  FiMessageSquare,
  FiMapPin,
  FiPhone,
  FiSend,
} from "react-icons/fi";
import { COLORS } from "../constants/designTokens";
import { contactMessageApi } from "../services/contactMessages";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50";

const fields = [
  { name: "name", label: "Full Name", type: "text", placeholder: "Your name" },
  { name: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
  { name: "phone", label: "Phone Number", type: "text", placeholder: "+92 300 0000000" },
  { name: "subject", label: "Subject", type: "text", placeholder: "How can we help?" },
];

const contactMethods = [
  {
    label: "Email",
    value: "support@emobileshop.com",
    icon: FiMail,
  },
  {
    label: "Phone",
    value: "+92 300 0000000",
    icon: FiPhone,
  },
  {
    label: "Location",
    value: "Pakistan",
    icon: FiMapPin,
  },
];

export const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess(false);

      await contactMessageApi.createMessage(form);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Failed to send message. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden pt-20" style={{ background: COLORS.neutral.bg }}>
      <main className="mx-auto flex h-[calc(100vh-5rem)] max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[0.85fr_1.4fr] lg:items-stretch"
        >
          <motion.div
            variants={itemVariants}
            className="flex min-h-0 flex-col overflow-hidden rounded-[28px] bg-slate-950 text-white shadow-2xl shadow-slate-950/20"
          >
            <div
              className="shrink-0 px-6 py-6 sm:px-8"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary.dark} 0%, #0f172a 72%)`,
              }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
                <FiMessageSquare />
                Contact
              </span>
              <h1 className="mt-5 text-3xl font-black tracking-tight md:text-4xl">
                Talk to our mobile experts
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Send your question, product request, or order concern. Your message
                goes straight to the admin dashboard for follow-up.
              </p>
            </div>

            <div className="min-h-0 flex-1 space-y-3 bg-white px-6 py-5 text-slate-900 sm:px-8">
              {contactMethods.map((method) => {
                const Icon = method.icon;

                return (
                  <div
                    key={method.label}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      <Icon size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {method.label}
                      </p>
                      <p className="mt-1 truncate text-sm font-bold text-slate-950">
                        {method.value}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-blue-200">
                    <FiClock size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Response
                    </p>
                    <p className="mt-1 text-sm font-bold">Usually within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex min-h-0 flex-col rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur-xl sm:p-6"
          >
            <div className="mb-5 flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Send Message
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  How can we help?
                </h2>
              </div>
              <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 sm:flex">
                <FiSend size={20} />
              </div>
            </div>

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex shrink-0 items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
              >
                <FiCheck size={18} />
                Message sent successfully.
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex shrink-0 items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
              >
                <FiAlertCircle size={18} />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col gap-4">
              <div className="grid shrink-0 gap-4 md:grid-cols-3">
                {fields.map((field) => (
                  <label
                    key={field.name}
                    className={field.name === "subject" ? "md:col-span-3" : ""}
                  >
                    <span className="mb-1.5 block text-sm font-bold text-slate-700">
                      {field.label}
                    </span>
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      disabled={submitting}
                      required
                      placeholder={field.placeholder}
                      className={inputClass}
                    />
                  </label>
                ))}
              </div>

              <label className="flex min-h-0 flex-1 flex-col">
                <span className="mb-1.5 block text-sm font-bold text-slate-700">
                  Message
                </span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  disabled={submitting}
                  required
                  placeholder="Write your message..."
                  className={`${inputClass} min-h-0 flex-1 resize-none leading-6`}
                />
              </label>

              <div className="flex shrink-0 flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-medium leading-5 text-slate-500">
                  Admin will see this message in the Messages page.
                </p>
                <motion.button
                  whileHover={{ y: submitting ? 0 : -2 }}
                  whileTap={{ scale: submitting ? 1 : 0.98 }}
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition disabled:cursor-not-allowed disabled:opacity-70"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
                  }}
                >
                  {submitting ? "Sending..." : "Send Message"}
                  <FiSend />
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
};
