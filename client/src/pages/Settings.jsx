import React, { useState } from "react";
import { useAuth } from "../store/AuthContext";
import { motion } from "framer-motion";
import {
  FiBell,
  FiLock,
  FiGlobe,
  // FiToggle2,
  // FiToggle1,
  FiArrowRight,
  FiCheck,
} from "react-icons/fi";
import { COLORS } from "../constants/designTokens";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    darkMode: false,
    twoFactor: false,
    smsNotifications: true,
    marketingEmails: false,
    orderUpdates: true,
  });
  const [saveStatus, setSaveStatus] = useState(false);

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2000);
  };

  const settingsSections = [
    {
      title: "Notifications",
      icon: FiBell,
      color: "#3b82f6",
      settings: [
        {
          key: "notifications",
          label: "Push Notifications",
          desc: "Receive push notifications on your device",
        },
        {
          key: "smsNotifications",
          label: "SMS Notifications",
          desc: "Get order updates via SMS",
        },
        {
          key: "orderUpdates",
          label: "Order Updates",
          desc: "Notifications about your orders and shipments",
        },
      ],
    },
    {
      title: "Email Preferences",
      icon: FiGlobe,
      color: "#10b981",
      settings: [
        {
          key: "emailUpdates",
          label: "Order Emails",
          desc: "Receive email about your orders and promotions",
        },
        {
          key: "marketingEmails",
          label: "Marketing Emails",
          desc: "Receive promotional emails and special offers",
        },
      ],
    },
    {
      title: "Security",
      icon: FiLock,
      color: "#ef4444",
      settings: [
        {
          key: "twoFactor",
          label: "Two-Factor Authentication",
          desc: "Add an extra layer of security to your account",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8" style={{ background: COLORS.neutral.bg }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-2">
            Settings
          </h1>
          <p className="text-neutral-600 text-lg">Manage your preferences and account settings</p>
        </motion.div>

        {/* Save Notification */}
        {saveStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 rounded-xl flex items-center gap-3"
            style={{
              background: "#dcfce7",
              borderColor: "#86efac",
              border: "2px solid",
            }}
          >
            <FiCheck size={20} style={{ color: "#10b981" }} />
            <span className="font-medium" style={{ color: "#15803d" }}>
              Settings saved successfully
            </span>
          </motion.div>
        )}

        {/* Settings Sections */}
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {settingsSections.map((section, sectionIdx) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={sectionIdx}
                variants={itemVariants}
                className="bg-white rounded-3xl shadow-lg border border-neutral-100 p-8 overflow-hidden"
              >
                {/* Section Header */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-neutral-200">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                    style={{ background: section.color }}
                  >
                    <Icon size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900">{section.title}</h2>
                </div>

                {/* Settings List */}
                <div className="space-y-3">
                  {section.settings.map((setting, idx) => (
                    <motion.div
                      key={setting.key}
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-between p-4 rounded-2xl hover:bg-neutral-50 transition-all duration-300 border-2 border-neutral-100 hover:border-blue-200"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-neutral-900 mb-1">{setting.label}</p>
                        <p className="text-sm text-neutral-600">{setting.desc}</p>
                      </div>

                      {/* Toggle */}
                      <motion.button
                        onClick={() => handleToggle(setting.key)}
                        className="w-14 h-8 rounded-full relative flex items-center transition-all duration-300 ml-4 flex-shrink-0"
                        style={{
                          background: settings[setting.key]
                            ? COLORS.primary.main
                            : COLORS.neutral.border,
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="w-7 h-7 rounded-full bg-white absolute"
                          animate={{
                            left: settings[setting.key] ? "26px" : "2px",
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Additional Settings Links */}
        <motion.div
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.a
            variants={itemVariants}
            href="#"
            whileHover={{ x: 4 }}
            className="bg-white rounded-2xl border border-neutral-100 p-6 hover:border-blue-600 transition-all duration-300 flex items-center justify-between group"
          >
            <div>
              <p className="font-bold text-neutral-900 mb-1">Change Password</p>
              <p className="text-sm text-neutral-600">Update your password regularly</p>
            </div>
            <FiArrowRight
              size={24}
              className="text-neutral-400 group-hover:text-blue-600 transition-colors duration-300"
            />
          </motion.a>

          <motion.a
            variants={itemVariants}
            href="#"
            whileHover={{ x: 4 }}
            className="bg-white rounded-2xl border border-neutral-100 p-6 hover:border-blue-600 transition-all duration-300 flex items-center justify-between group"
          >
            <div>
              <p className="font-bold text-neutral-900 mb-1">Privacy Policy</p>
              <p className="text-sm text-neutral-600">Review our privacy terms</p>
            </div>
            <FiArrowRight
              size={24}
              className="text-neutral-400 group-hover:text-blue-600 transition-colors duration-300"
            />
          </motion.a>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          className="mt-12 bg-red-50 border-2 border-red-200 rounded-3xl p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-bold text-red-900 mb-4">Danger Zone</h3>
          <p className="text-red-800 mb-6">
            These actions are irreversible. Please proceed with caution.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-300"
            style={{
              background: "#ef4444",
            }}
          >
            Delete Account
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
//               <div>
//                 <p className="font-semibold text-gray-800">Two-Factor Authentication</p>
//                 <p className="text-gray-600 text-sm">Add an extra layer of security</p>
//               </div>
//               <input
//                 type="checkbox"
//                 checked={settings.twoFactor}
//                 onChange={() => handleToggle('twoFactor')}
//                 className="w-6 h-6 text-purple-600 rounded cursor-pointer"
//               />
//             </div >
//   <button className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition duration-300">
//     Change Password
//   </button>
//           </div >
//         </div >
//       </div >
//     </div >
//   );
// };
