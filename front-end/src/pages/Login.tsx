import React, { useEffect, useState } from "react";
import AuthController from "../controllers/AuthController";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../hooks/useAuth";
import { useLoading } from "../hooks/useLoading";

const Login = () => {
  // States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Hooks
  const { addToast } = useToast();
  const { login, logout } = useAuth();
  const { setIsLoading } = useLoading();

  const handleLogin = async () => {
    if (username.trim().length === 0 || username.trim().length === 0) {
      addToast("All fields are required", "danger");
      return;
    }
    try {
      setIsLoading(true);

      const result = await AuthController.login({ username, password });
      addToast("Login successful", "success");
      login(result);
    } catch (err: any) {
      addToast(
        err.response.data.detail ??
          "Login error, contact some system administrator.",
        "danger",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateCredentials = async (token: string) => {
    try {
      const result = await AuthController.validateCredentials({ token });
      login(result);
      addToast("Credentials validated successfully", "success");
    } catch (err: any) {
      logout();
      addToast(
        err.response.data.detail ??
          "Login error, contact some system administrator.",
        "danger",
      );
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      handleValidateCredentials(token);
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            id="username"
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ease-in-out"
            placeholder="Digite seu username"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ease-in-out"
            placeholder="Digite sua senha"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={handleLogin}
            className="bg-purple-500 w-full hover:bg-purple-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Entrar
          </button>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{" "}
            <a href="/register" className="text-purple-500 hover:underline">
              Registrar
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
