import { useState } from "react";

const MessageForm: React.FC<{
  onSendMessage: (payload: { recipient: string; message: string }) => void;
}> = ({ onSendMessage }) => {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSendMessage({ recipient, message });
    setRecipient("");
    setMessage("");
  };

  return (
    <form
      onSubmit={(e) => handleSubmit}
      className="mt-6 bg-white shadow-md rounded px-8 py-6 w-full max-w-md"
    >
      <h3 className="text-lg font-semibold mb-2">Envio de Mensagens</h3>
      <input
        type="text"
        placeholder="Destinatário"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      <input
        type="text"
        placeholder="Mensagem"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
      >
        Enviar
      </button>
    </form>
  );
};

export default MessageForm;
