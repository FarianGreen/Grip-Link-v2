import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchMessages } from "../store/chatSlice";
import MessageInput from "./MessageInput";
import { connectSocket } from "../services/socket";

const ChatWindow: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const selectedChatId = useSelector((state: RootState) => state.chat.selectedChatId);
    const messages = useSelector((state: RootState) => state.chat.messages);

    useEffect(() => {
        connectSocket();
        if (selectedChatId !== null) {
            dispatch(fetchMessages(selectedChatId));
        }
    }, [dispatch, selectedChatId]);

    return (
        <div className="chat-window">
            <h2>Чат #{selectedChatId ?? "не выбран"}</h2>
            <div className="messages">
                {messages.length === 0 ? (
                    <p>Сообщений пока нет</p>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className="message">
                            <strong>{msg.senderId}:</strong> {msg.content}
                        </div>
                    ))
                )}
            </div>
            {selectedChatId && <MessageInput />}
        </div>
    );
};

export default ChatWindow;
