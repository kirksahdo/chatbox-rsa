import { createContext, ReactNode, useContext, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { User } from "../interfaces/User";
import { AuthContextType } from "../@types/auth";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useLocalStorage("user", null);

  const login = (data: User) => {
    setUser(data);
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth should be used within a AuthProvider");
  }
  return context;
};
