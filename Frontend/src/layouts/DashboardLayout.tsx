import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="min-h-screen flex
bg-gradient-to-b
from-samurai-bg
to-samurai-bg/90
dark:from-ninja-bg
dark:to-black"
    >
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-200`}
      >
        <Sidebar
          collapsed={collapsed}
          toggleCollapse={() => setCollapsed(!collapsed)}
          closeSidebar={() => setSidebarOpen(false)}
        />
      </div>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Content */}
      <div
        className={`flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 ${
          collapsed ? "lg:ml-[72px]" : "lg:ml-[240px]"
        }`}
      >
        {/* Mobile Menu */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-3 py-2 rounded bg-samurai-primary text-white"
          >
            ☰ Menu
          </button>
        </div>

        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
