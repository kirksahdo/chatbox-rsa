import { useState } from "react";

const RegisterForm: React.FC<{ onRegister: (username: string) => void }> = ({
  onRegister,
}) => {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onRegister(username);
    setUsername("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded px-8 py-6 w-full max-w-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">
        Cadastro de Usuário
      </h2>
      <input
        type="text"
        placeholder="Nome de usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Registrar
      </button>
    </form>
  );
};

export default RegisterForm;
