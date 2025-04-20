import ChatList from "../../components/ChatList";
import ChatWindow from "../../components/ChatWindow";
import "./messages.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { withTransition } from "../../utils/withTransition";

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
