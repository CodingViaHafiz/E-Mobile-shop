import React from "react";
import { AdminSidebar } from "./AdminSidebar";

export const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
};
