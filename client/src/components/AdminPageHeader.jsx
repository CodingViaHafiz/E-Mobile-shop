import React from "react";

export const AdminPageHeader = ({
  eyebrow = "Admin Workspace",
  title,
  description,
  actions,
  meta = [],
}) => {
  return (
    <div className="admin-section relative overflow-hidden !p-5 sm:!p-6">
      <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-blue-100/60 via-transparent to-transparent lg:block" />

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="admin-chip">{eyebrow}</p>
          <h1 className="admin-title mt-3">{title}</h1>
          {description && <p className="admin-subtitle">{description}</p>}

          {meta.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {meta.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-full bg-slate-950 px-2.5 py-1 text-[11px] font-semibold text-white/90"
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>

        {actions && <div className="grid w-full gap-3 sm:flex sm:flex-wrap lg:w-auto">{actions}</div>}
      </div>
    </div>
  );
};
