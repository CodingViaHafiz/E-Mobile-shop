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
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const fields = [
  { name: "name", label: "Full Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "subject", label: "Subject", type: "text" },
];

const contactMethods = [
  { label: "Email", value: "support@emobileshop.com", icon: FiMail },
  { label: "Phone", value: "+92 300 0000000", icon: FiPhone },
  { label: "Location", value: "Pakistan", icon: FiMapPin },
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      await contactMessageApi.createMessage(form);

      setSuccess(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to send message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8" style={{ background: COLORS.neutral.bg }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 lg:grid-cols-2"
        >
          {/* LEFT PANEL */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl text-white p-6 space-y-6"
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary.dark}, #0f172a)`,
            }}
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Contact Our Team
              </h1>
              <p className="text-sm text-slate-300 mt-2">
                We usually reply within 24 hours.
              </p>
            </div>

            {contactMethods.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-4">
                  <Icon />
                  <div>
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className="font-semibold">{item.value}</p>
                  </div>
                </div>
              );
            })}

            <div className="flex items-center gap-3 text-sm text-slate-300">
              <FiClock />
              Usually within 24 hours
            </div>
          </motion.div>

          {/* RIGHT PANEL */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold mb-4">Send Message</h2>

            {success && (
              <div className="flex items-center gap-2 text-green-600 mb-3">
                <FiCheck /> Message Sent
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-600 mb-3">
                <FiAlertCircle /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {fields.map((field) => (
                  <input
                    key={field.name}
                    type={field.type}
                    name={field.name}
                    placeholder={field.label}
                    value={form[field.name]}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                ))}
              </div>

              <textarea
                name="message"
                placeholder="Your message..."
                value={form.message}
                onChange={handleChange}
                required
                className={`${inputClass} min-h-[120px]`}
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};