import React from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <div className="app">
                <ChatList />
                <div className="chat-container">
                    <ChatWindow />
                </div>
            </div>
        </Provider>
    );
};

export default App;
