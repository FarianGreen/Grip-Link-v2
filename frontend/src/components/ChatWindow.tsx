import { useSelector } from "react-redux";
import MessageInput from "./MessageInput";
import MessageItem from "./messageItem/MessageItem";
import { useMarkMessagesRead } from "@/hooks/useMarkMessagesRead";
import { useChatLifecycle } from "@/hooks/useChatLifecycle";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useSelectedChat } from "@/hooks/useSelectedChat";
import { RootState } from "@/app/store";

interface ChatWindowProps {
  chatId: number | null;
}

const ChatWindow = ({ chatId }: ChatWindowProps) => {
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

  useChatLifecycle(chatId);
  useMarkMessagesRead(chatId);

  const selectedChatId = useSelectedChat();
  const messages = useChatMessages();

  return (
    <div className="chat-window">
      <div className="chat-window__tools">
        <h2>Чат #{selectedChatId?.chatId ?? "не выбран"}</h2>
      </div>

      <div className="messages">
        {messages.length === 0 ? (
          <p>Сообщений пока нет</p>
        ) : (
          <div className="messages-outer">
            <div className="messages-inner">
              {messages.map((msg) => (
                <MessageItem
                  key={msg.id}
                  message={msg}
                  currentUserId={currentUserId!}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {selectedChatId && <MessageInput />}
    </div>
  );
};

export default ChatWindow;
