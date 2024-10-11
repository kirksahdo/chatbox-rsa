import React, { useState } from "react";
import AuthController from "../controllers/AuthController";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username.trim().length === 0 || username.trim().length === 0) {
      alert("All fields are required");
      return;
    }

    try {
      const result = AuthController.login({ username, password });
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

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
