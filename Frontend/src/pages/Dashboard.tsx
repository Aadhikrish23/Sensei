import { useAuth } from "../context/AuthContext";
import { useTheme } from "../hooks/useTheme";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  

  return (
    <div className="space-y-8">

      {/* Welcome section */}
      <div>
        <h1 className="text-3xl font-bold text-samurai-text dark:text-ninja-text">
          Welcome to Sensei
        </h1>
        <p className="text-samurai-muted dark:text-ninja-muted">
          Your AI interview training platform
        </p>
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-3 gap-6">

        <div className="p-6 rounded-lg bg-samurai-card dark:bg-ninja-card">
          <h2 className="text-lg font-semibold">Resumes</h2>
          <p className="text-2xl font-bold">0</p>
        </div>

        <div className="p-6 rounded-lg bg-samurai-card dark:bg-ninja-card">
          <h2 className="text-lg font-semibold">Jobs</h2>
          <p className="text-2xl font-bold">0</p>
        </div>

        <div className="p-6 rounded-lg bg-samurai-card dark:bg-ninja-card">
          <h2 className="text-lg font-semibold">Interviews</h2>
          <p className="text-2xl font-bold">0</p>
        </div>

      </div>

      {/* Quick actions */}
      <div className="space-y-4">

        <h2 className="text-xl font-semibold">Quick Actions</h2>

        <div className="flex gap-4">

          <button className="px-6 py-3 rounded-lg bg-samurai-primary text-white"
          onClick={() => navigate("/resumes")}>
            Upload Resume
          </button>

          <button className="px-6 py-3 rounded-lg bg-samurai-primary text-white"
            onClick={() => navigate("/jobs")}>
            Add Job Description
          </button>

          <button className="px-6 py-3 rounded-lg bg-samurai-primary text-white"
          onClick={() => navigate("/interview")}>
            Start Interview
          </button>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;