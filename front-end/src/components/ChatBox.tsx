import { Message } from "../interfaces/Messages";

const ChatBox: React.FC<{ messages: Message[] }> = ({ messages }) => {
  return (
    <div className="mt-6 bg-white shadow-md rounded px-8 py-6 w-full max-w-md">
      <h3 className="text-lg font-semibold mb-2">Mensagens Recebidas</h3>
      {messages.length === 0 ? (
        <p className="text-gray-500">Nenhuma mensagem recebida ainda.</p>
      ) : (
        <ul className="space-y-2">
          {messages.map((msg, index) => (
            <li key={index} className="p-4 bg-gray-200 rounded-lg shadow-md">
              <p>
                <strong>{msg.sender}</strong>: {msg.content}
              </p>
              <p className="text-sm text-gray-500">
                {msg.timestamp.toDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatBox;
