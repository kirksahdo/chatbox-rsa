import { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import MessageForm from "../components/MessageForm";
import ChatBox from "../components/ChatBox";
import { useChat } from "../hooks/useChat";

const Home = () => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const { registerUser, sendMessage, receivedMessages } = useChat(loggedInUser);

  const handleRegister = async (username: string) => {
    await registerUser(username);
    setLoggedInUser(username);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {!loggedInUser ? (
        <RegisterForm onRegister={handleRegister} />
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Bem-vindo, {loggedInUser}</h2>
          <MessageForm onSendMessage={sendMessage} />
          <ChatBox messages={receivedMessages} />
        </>
      )}
    </div>
  );
};

export default Home;
