import React, { useState } from "react";
import AuthController from "../controllers/AuthController";
import { encryptPrivateKey, generateKeyPair } from "../utils/crypto";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (username.trim().length === 0) {
      alert("The username is required");
      return;
    }
    if (password !== confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }
    registerUser();
  };

  const registerUser = async () => {
    try {
      const { publicKey, privateKey } = generateKeyPair();
      const encriptedPrivateKey = encryptPrivateKey(privateKey, password);

      const result = await AuthController.register({
        username,
        encrypted_private_key: encriptedPrivateKey,
        password: password,
        public_key: publicKey,
      });

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Registrar
        </h2>

        <div className="mt-4">
          <label className="block text-gray-600 text-sm mb-2">
            Nome de Usuário
          </label>
          <input
            className="w-full px-3 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ease-in-out"
            type="text"
            placeholder="Nome de Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-600 text-sm mb-2">Senha</label>
          <input
            className="w-full px-3 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ease-in-out"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-600 text-sm mb-2">
            Confirmar Senha
          </label>
          <input
            className="w-full px-3 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ease-in-out"
            type="password"
            placeholder="Confirmar Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="mt-6">
          <button
            className="w-full  bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-900 transition duration-200"
            onClick={handleRegister}
          >
            Registrar
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Já tem uma conta?{" "}
          <a href="/" className="text-purple-500 hover:underline">
            Entre aqui
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
