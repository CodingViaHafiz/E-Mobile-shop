import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FiAlertTriangle,
  FiBell,
  FiCheck,
  FiLock,
  FiShield,
  FiSliders,
} from "react-icons/fi";
import { AdminLayout } from "../components/AdminLayout";
import { AdminPageHeader } from "../components/AdminPageHeader";

const sections = [
  {
    title: "Operations",
    description: "Control how the admin team gets notified about store activity.",
    icon: FiBell,
    color: "bg-blue-100 text-blue-700",
    items: [
      {
        key: "stockAlerts",
        label: "Low-stock alerts",
        description: "Surface warning notifications when inventory falls below safe limits.",
      },
      {
        key: "dailyDigest",
        label: "Daily admin digest",
        description: "Receive a morning summary of new users, inactive accounts, and warnings.",
      },
    ],
  },
  {
    title: "Permissions",
    description: "Add a little friction before risky account changes are made.",
    icon: FiShield,
    color: "bg-amber-100 text-amber-700",
    items: [
      {
        key: "confirmRoleChanges",
        label: "Confirm role changes",
        description: "Require an extra confirmation step before promoting or demoting an account.",
      },
      {
        key: "confirmDeactivation",
        label: "Confirm deactivations",
        description: "Prevent accidental lockouts by asking for an explicit approval step.",
      },
    ],
  },
  {
    title: "Security",
    description: "Preview settings for the secure admin workflow we want to support next.",
    icon: FiLock,
    color: "bg-emerald-100 text-emerald-700",
    items: [
      {
        key: "twoFactorReminder",
        label: "Two-factor reminder",
        description: "Prompt admins to enable stronger sign-in protection.",
      },
      {
        key: "sessionReminder",
        label: "Session timeout reminder",
        description: "Warn admins before an idle session is about to expire.",
      },
    ],
  },
];

const ToggleRow = ({ active, description, label, onToggle }) => {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="max-w-xl">
        <p className="font-bold text-slate-950">{label}</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      </div>

      <button
        onClick={onToggle}
        className={`relative h-9 w-16 rounded-full transition ${
          active ? "bg-slate-950" : "bg-slate-300"
        }`}
        aria-pressed={active}
      >
        <span
          className={`absolute top-1 h-7 w-7 rounded-full bg-white shadow-md transition ${
            active ? "left-8" : "left-1"
          }`}
        />
      </button>
    </div>
  );
};

export const AdminSettingsPage = () => {
  const saveTimerRef = useRef(null);
  const [settings, setSettings] = useState({
    stockAlerts: true,
    dailyDigest: true,
    confirmRoleChanges: true,
    confirmDeactivation: true,
    twoFactorReminder: false,
    sessionReminder: true,
  });
  const [saved, setSaved] = useState(false);

  const toggleSetting = (key) => {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
    setSaved(true);
    window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => setSaved(false), 1800);
  };

  useEffect(() => {
    return () => window.clearTimeout(saveTimerRef.current);
  }, []);

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <AdminPageHeader
          eyebrow="Admin Settings"
          title="Shape the back-office workflow"
          description="These controls give the settings nav item a polished home and make the admin area feel complete, even before the backend settings API is wired."
          meta={["Preview controls", "Session-only changes", "Designed for future API support"]}
          actions={
            <div className="admin-soft-panel flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600">
              <FiSliders className="text-blue-600" />
              Admin preferences preview
            </div>
          }
        />

        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="admin-panel border-emerald-200/80 bg-emerald-50/90 p-4 text-sm font-semibold text-emerald-700"
          >
            <span className="inline-flex items-center gap-2">
              <FiCheck />
              Settings updated in this session.
            </span>
          </motion.div>
        )}

        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <section key={section.title} className="admin-section">
                  <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${section.color}`}
                    >
                      <Icon size={22} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black tracking-tight text-slate-950">
                        {section.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {section.items.map((item) => (
                      <ToggleRow
                        key={item.key}
                        active={settings[item.key]}
                        label={item.label}
                        description={item.description}
                        onToggle={() => toggleSetting(item.key)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="space-y-8">
            <section className="rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-xl shadow-slate-950/20">
              <p className="admin-chip border-white/10 bg-white/5 text-blue-100">
                Readiness
              </p>
              <h2 className="mt-4 text-2xl font-black tracking-tight">
                Admin settings are now visually complete
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                The toggles are intentionally session-only for now. Once a backend settings
                endpoint exists, this layout can be wired without redesigning the page.
              </p>
            </section>

            <section className="admin-section">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-700">
                  <FiAlertTriangle size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-950">
                    Danger zone
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    These actions are placeholders until the matching admin workflows exist.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <button
                  disabled
                  className="w-full rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-left text-sm font-semibold text-red-700 opacity-70"
                >
                  Freeze all staff access
                </button>
                <button
                  disabled
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-left text-sm font-semibold text-slate-500 opacity-70"
                >
                  Export full admin audit log
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
