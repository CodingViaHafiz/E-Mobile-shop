import React from "react";
import { AdminSidebar } from "./AdminSidebar";

export const AdminLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(circle at top left, rgba(40,92,204,0.14), transparent 30%), linear-gradient(180deg, #f7fbff 0%, #eef5ff 52%, #f9fafb 100%)",
        }}
      />
      <AdminSidebar />
      <main className="relative min-h-screen w-full lg:pl-72">
        <div className="min-h-screen px-4 pb-24 pt-20 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
};
