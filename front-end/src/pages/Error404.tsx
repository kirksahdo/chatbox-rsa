import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white p-4">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold tracking-wider text-gray-500 animate-pulse">
          404
        </h1>
        <p className="text-2xl md:text-3xl font-light mt-4 mb-8">
          Oops! Página não encontrada.
        </p>
        <Link
          to="/"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Voltar para a Home
        </Link>
      </div>
    </div>
  );
};

export default Error404;
