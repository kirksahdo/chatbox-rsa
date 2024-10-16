import ChatMain from "../components/ChatMain";
import ChatSideBar from "../components/ChatSideBar";
import { ChatProvider } from "../hooks/useChats";
import { CurrentChatProvider } from "../hooks/useCurrentChat";

const Home = () => {
  return (
    <CurrentChatProvider>
      <ChatProvider>
        <div
          className="h-screen w-screen first-line:overflow-hidden flex items-center justify-center"
          style={{ background: "#edf2f7" }}
        >
          <div className="flex h-screen w-screen overflow-hidden">
            <ChatSideBar />
            <ChatMain />
          </div>
        </div>
      </ChatProvider>
    </CurrentChatProvider>
  );
};

export default Home;
