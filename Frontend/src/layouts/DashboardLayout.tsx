import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">

      <Sidebar />

      <div className="flex-1 p-8 bg-samurai-bg dark:bg-ninja-bg">
        <Outlet />
      </div>

    </div>
  );
}