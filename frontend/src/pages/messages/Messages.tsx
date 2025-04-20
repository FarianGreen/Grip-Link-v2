import { AnimatePresence } from "framer-motion";
import ChatList from "../../components/ChatList";
import ChatWindow from "../../components/ChatWindow";
import "./messages.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { motion } from "framer-motion";

const MessagesPage = () => {
  const { selectedChatId } = useSelector((state: RootState) => state.chat);
  console.log(selectedChatId);
  return (
    <div className="app">
      <div className="chats-container">
        <ChatList />
        <div className="chat-container">
          <AnimatePresence mode="wait">
            {selectedChatId && (
              <motion.div
                key={selectedChatId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{ height: "100%" }}
              >
                <ChatWindow chatId={selectedChatId} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
export default MessagesPage;
