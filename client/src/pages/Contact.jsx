import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiMail,
  FiUser,
  FiMessageSquare,
  FiPhone,
  FiCheck,
  FiSend,
} from "react-icons/fi";
import { COLORS } from "../constants/designTokens";

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

export const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // simulate API call
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);

    setForm({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const contactSections = [
    {
      title: "Basic Information",
      icon: FiUser,
      color: "#3b82f6",
      fields: [
        { name: "name", label: "Full Name", type: "text", placeholder: "Enter your name" },
        { name: "email", label: "Email Address", type: "email", placeholder: "Enter your email" },
        { name: "phone", label: "Phone Number", type: "text", placeholder: "Enter your phone" },
      ],
    },
    {
      title: "Message Details",
      icon: FiMessageSquare,
      color: "#10b981",
      fields: [
        { name: "subject", label: "Subject", type: "text", placeholder: "Enter subject" },
        { name: "message", label: "Message", type: "textarea", placeholder: "Write your message..." },
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8" style={{ background: COLORS.neutral.bg }}>
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-2">
            Contact Us
          </h1>
          <p className="text-neutral-600 text-lg">
            Get in touch with us. We’d love to hear from you.
          </p>
        </motion.div>

        {/* SUCCESS MESSAGE */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl flex items-center gap-3"
            style={{
              background: "#dcfce7",
              borderColor: "#86efac",
              border: "2px solid",
            }}
          >
            <FiCheck size={20} style={{ color: "#10b981" }} />
            <span className="font-medium" style={{ color: "#15803d" }}>
              Message sent successfully!
            </span>
          </motion.div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {contactSections.map((section, sectionIdx) => {
              const Icon = section.icon;

              return (
                <motion.div
                  key={sectionIdx}
                  variants={itemVariants}
                  className="bg-white rounded-3xl shadow-lg border border-neutral-100 p-8"
                >
                  {/* SECTION HEADER */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-neutral-200">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                      style={{ background: section.color }}
                    >
                      <Icon size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900">
                      {section.title}
                    </h2>
                  </div>

                  {/* FIELDS */}
                  <div className="space-y-4">
                    {section.fields.map((field) => (
                      <div key={field.name}>
                        <label className="block mb-1 font-bold text-neutral-900">
                          {field.label}
                        </label>

                        {field.type === "textarea" ? (
                          <textarea
                            name={field.name}
                            value={form[field.name]}
                            onChange={handleChange}
                            required
                            rows={5}
                            placeholder={field.placeholder}
                            className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3 focus:outline-none focus:border-blue-500 transition"
                          />
                        ) : (
                          <input
                            type={field.type}
                            name={field.name}
                            value={form[field.name]}
                            onChange={handleChange}
                            required
                            placeholder={field.placeholder}
                            className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3 focus:outline-none focus:border-blue-500 transition"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* SUBMIT BUTTON */}
          <motion.div
            className="mt-10 flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
              }}
            >
              Send Message
              <FiSend />
            </motion.button>
          </motion.div>
        </form>

        {/* EXTRA CONTACT INFO (same layout style as your links) */}
        <motion.div
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl border border-neutral-100 p-6"
          >
            <p className="font-bold text-neutral-900 mb-1">Email</p>
            <p className="text-sm text-neutral-600">support@emobileshop.com</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl border border-neutral-100 p-6"
          >
            <p className="font-bold text-neutral-900 mb-1">Phone</p>
            <p className="text-sm text-neutral-600">+92 300 0000000</p>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
};