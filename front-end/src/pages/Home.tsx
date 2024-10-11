import ChatMain from "../components/ChatMain";
import ChatSideBar from "../components/ChatSideBar";

const Home = () => {
  return (
    <div
      className="h-screen w-screen first-line:overflow-hidden flex items-center justify-center"
      style={{ background: "#edf2f7" }}
    >
      <div className="flex h-screen w-screen overflow-hidden">
        <ChatSideBar />
        <ChatMain />
      </div>
    </div>
  );
};

export default Home;
