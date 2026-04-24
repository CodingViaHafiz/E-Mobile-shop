import React from "react";

export const AdminStatCard = ({ icon: Icon, label, value, accent, hint }) => {
  return (
    <div className="admin-panel p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            {value}
          </p>
          {hint && <p className="mt-2 text-sm text-slate-500">{hint}</p>}
        </div>

        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg"
          style={{ background: accent }}
        >
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
};
