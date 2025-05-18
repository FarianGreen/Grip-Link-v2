import ChatList from "@/components/chatList/ChatList";
import ChatWindow from "@/components/ChatWindow";
import "./messages.scss";
import { useSelector } from "react-redux";
import { withTransition } from "@/utils/withTransition";
import { RootState } from "@/app/store";

const ChatWindowWithTransition = withTransition(ChatWindow);

const MessagesPage = () => {
  const { selectedChatId } = useSelector((state: RootState) => state.chat);

  return (
    <div className="app">
      <div className="chats-container">
        <ChatList />
        <div className="chat-container">
          <ChatWindowWithTransition chatId={selectedChatId} />
        </div>
      </div>
    </div>
  );
};
export default MessagesPage;
