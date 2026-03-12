import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Mic,
  BarChart3,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

type SidebarProps = {
  collapsed: boolean;
  toggleCollapse: () => void;
  closeSidebar?: () => void;
};

export default function Sidebar({
  collapsed,
  toggleCollapse,
  closeSidebar
}: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItem =
    "flex items-center gap-3 px-3 py-2 rounded-md transition";

  const navInactive =
    "text-samurai-text dark:text-ninja-text hover:text-samurai-primary dark:hover:text-ninja-accent";

  const navActive =
    "bg-samurai-primary text-white dark:bg-ninja-primary";

  return (
    <div
      className={`h-screen ${
        collapsed ? "w-[72px]" : "w-[240px]"
      } bg-samurai-card dark:bg-ninja-card border-r border-samurai-border dark:border-ninja-border p-4 flex flex-col transition-all duration-300`}
    >
      {/* Header */}
<div className="flex items-center justify-between mb-6">

  {/* Left side */}
  <div className="flex items-center gap-2">
    {!collapsed && (
      <h1 className="text-xl font-bold text-samurai-text dark:text-ninja-text">
        Sensei
      </h1>
    )}

    {!collapsed && <ThemeToggle />}
  </div>

  {/* Collapse Button */}
  <button
    onClick={toggleCollapse}
    className="p-1 rounded hover:bg-samurai-border dark:hover:bg-ninja-border text-samurai-text dark:text-ninja-text"
  >
    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
  </button>

</div>

      <nav className="flex flex-col gap-3">

        <NavLink
          to="/dashboard"
          onClick={closeSidebar}
          className={({ isActive }) =>
            `${navItem} ${isActive ? navActive : navInactive}`
          }
        >
          <LayoutDashboard size={18} />
          {!collapsed && "Dashboard"}
        </NavLink>

        <NavLink
          to="/resumes"
          onClick={closeSidebar}
          className={({ isActive }) =>
            `${navItem} ${isActive ? navActive : navInactive}`
          }
        >
          <FileText size={18} />
          {!collapsed && "Resumes"}
        </NavLink>

        <NavLink
          to="/jobs"
          onClick={closeSidebar}
          className={({ isActive }) =>
            `${navItem} ${isActive ? navActive : navInactive}`
          }
        >
          <Briefcase size={18} />
          {!collapsed && "Jobs"}
        </NavLink>

        <NavLink
          to="/interviews"
          onClick={closeSidebar}
          className={({ isActive }) =>
            `${navItem} ${isActive ? navActive : navInactive}`
          }
        >
          <Mic size={18} />
          {!collapsed && "Interviews"}
        </NavLink>

        <NavLink
          to="/reports"
          onClick={closeSidebar}
          className={({ isActive }) =>
            `${navItem} ${isActive ? navActive : navInactive}`
          }
        >
          <BarChart3 size={18} />
          {!collapsed && "Reports"}
        </NavLink>

      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto bg-red-500 text-white py-2 rounded-md hover:bg-red-600 text-sm"
      >
        {!collapsed ? "Logout" : "⎋"}
      </button>
    </div>
  );
}