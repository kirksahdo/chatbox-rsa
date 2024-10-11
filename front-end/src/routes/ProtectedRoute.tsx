import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ReactNode } from "react";

const ProtectedRoute: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
