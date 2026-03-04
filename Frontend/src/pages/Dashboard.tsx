import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { accessToken } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
     
      <p>Token: {accessToken}</p>
       <Child />
    </div>
  );
};

const Child = () => {
  const { accessToken } = useAuth();
  return <p>Child sees: {accessToken}</p>;
};


export default Dashboard;