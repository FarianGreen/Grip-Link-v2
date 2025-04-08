import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChats, setSelectedChat } from "../store/chatSlice";
import { RootState, AppDispatch } from "../store/store";

const ChatList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const chats = useSelector((state: RootState) => state.chat.chats) || [];
    const selectedChatId = useSelector((state: RootState) => state.chat.selectedChatId);
    
    useEffect(() => {
        dispatch(fetchChats()); 
    }, [dispatch]);
    return (
        <div className="chat-list">
            <h2>Чаты</h2>
            {Array.isArray(chats) && chats.length === 0 ? (
                <p>Нет чатов</p>
            ) : (
                Array.isArray(chats) &&
                chats.map((chat) => (
                    <div
                        key={chat.chatId}
                        className={`chat-item ${selectedChatId === chat.chatId ? "active" : ""}`}
                        onClick={() => dispatch(setSelectedChat(chat.chatId))}
                    >
                        <p>
                            Чат #{chat.chatId} — {chat.users.map((u) => u.name).join(", ")}
                        </p>
                        {chat.lastMessage && (
                            <small>Последнее сообщение: {chat.lastMessage.content}</small>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default ChatList;
