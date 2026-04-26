import React from "react";
import { FiAlertTriangle, FiClock, FiSliders } from "react-icons/fi";
import { AdminLayout } from "../components/AdminLayout";
import { AdminPageHeader } from "../components/AdminPageHeader";

export const AdminSettingsPage = () => {
  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <AdminPageHeader
          eyebrow="Admin Settings"
          title="Settings are not connected yet"
          description="This section will return when a real admin settings API exists. For now, the admin workspace only shows live data-backed pages."
          actions={
            <div className="admin-soft-panel flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600">
              <FiSliders className="text-blue-600" />
              Awaiting backend support
            </div>
          }
        />

        <section className="admin-section">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <FiAlertTriangle size={22} />
              </div>
              <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-950">
                No fake controls here anymore
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                The previous preview toggles and placeholder actions were removed because
                they did not read from or save to the backend.
              </p>
            </div>

            <div className="admin-soft-panel flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600">
              <FiClock className="text-slate-500" />
              Waiting for a real settings endpoint
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};
