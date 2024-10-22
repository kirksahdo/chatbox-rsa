import { createContext, ReactNode, useContext, useState } from "react";
import { User } from "../interfaces/User";
import { AuthContextType } from "../@types/auth";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (data: User) => {
    setUser(data);
    localStorage.setItem("token", data.token);
    localStorage.setItem("privateKey", data.encryptedPrivateKey);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("privateKey");
  };

  return (
    <AuthContext.Provider value={{ login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth should be used within a AuthProvider");
  }
  return context;
};
