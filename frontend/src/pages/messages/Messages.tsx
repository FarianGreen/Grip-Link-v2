import ChatList from "../../components/ChatList";
import ChatWindow from "../../components/ChatWindow";

const MessagesPage = () => {
  return (
    <div className="app">
      <div className="chats-container">
        <ChatList />
        <div className="chat-container">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
};
export default MessagesPage;
