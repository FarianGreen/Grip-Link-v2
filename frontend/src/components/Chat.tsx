import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { connectSocket } from "../services/socket";

const Chat: React.FC = () => {
    const messages = useSelector((state: RootState) => state.chat.messages);

    useEffect(() => {
        connectSocket();
    }, []);

    return (
        <div>
            <h2>Чат</h2>
            <ul>
                {messages.map((msg) => (
                    <li key={msg.id}>
                        <strong>Пользователь {msg.senderId}:</strong> {msg.content}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Chat;
