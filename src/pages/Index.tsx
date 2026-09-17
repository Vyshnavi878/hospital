import { Navigate } from "react-router-dom";

const Index = () => {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");

  if (token) {
    if (role === "admin") return <Navigate to="/admindashboard" replace />;
    return <Navigate to={role === "doctor" ? "/doctordashboard" : "/patientdashboard"} replace />;
  }

  return <Navigate to="/home" replace />;
};

export default Index;
