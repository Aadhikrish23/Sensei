import { useAuth } from "../context/AuthContext";
import { useTheme } from "../hooks/useTheme";

const Dashboard = () => {
  const { accessToken } = useAuth();
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
     
      <h1>Dashboard</h1>
     
      
      
    </div>
  );
};




export default Dashboard;