import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="w-[240px] min-h-screen bg-samurai-card dark:bg-ninja-card border-r border-samurai-border dark:border-ninja-border p-6 flex flex-col">
      <h1 className="text-xl font-bold mb-8 text-samurai-text dark:text-ninja-text">
        Sensei
      </h1>

      <nav className="flex flex-col gap-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md transition
    ${
      isActive
        ? "bg-samurai-primary text-white dark:bg-ninja-primary"
        : "text-samurai-text dark:text-ninja-text hover:text-samurai-primary dark:hover:text-ninja-accent"
    }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/resumes"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md transition
    ${
      isActive
        ? "bg-samurai-primary text-white dark:bg-ninja-primary"
        : "text-samurai-text dark:text-ninja-text hover:text-samurai-primary dark:hover:text-ninja-accent"
    }`
          }
        >
          Resumes
        </NavLink>

        <NavLink
          to="/jobs"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md transition
    ${
      isActive
        ? "bg-samurai-primary text-white dark:bg-ninja-primary"
        : "text-samurai-text dark:text-ninja-text hover:text-samurai-primary dark:hover:text-ninja-accent"
    }`
          }
        >
          Job Descriptions
        </NavLink>

        <NavLink
          to="/interviews"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md transition
    ${
      isActive
        ? "bg-samurai-primary text-white dark:bg-ninja-primary"
        : "text-samurai-text dark:text-ninja-text hover:text-samurai-primary dark:hover:text-ninja-accent"
    }`
          }
        >
          Interview Section
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md transition
    ${
      isActive
        ? "bg-samurai-primary text-white dark:bg-ninja-primary"
        : "text-samurai-text dark:text-ninja-text hover:text-samurai-primary dark:hover:text-ninja-accent"
    }`
          }
        >
          Reports
        </NavLink>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}

