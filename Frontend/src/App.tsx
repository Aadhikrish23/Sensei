import { Route, Routes } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Interview from "./pages/Interview";
import Jobs from "./pages/Jobs";
import Reports from "./pages/Reports";
import Resumes from "./pages/Resumes";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="resumes" element={<Resumes />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="interview" element={<Interview />} />
        <Route path="reports" element={<Reports />} />
         <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
