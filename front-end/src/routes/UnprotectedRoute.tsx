import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ReactNode } from "react";

const UnprotectedRoute: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    // user is authenticated
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default UnprotectedRoute;
