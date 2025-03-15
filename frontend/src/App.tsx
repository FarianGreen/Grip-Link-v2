import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import { AppDispatch, RootState } from "./store/store";
import Login from "./components/Login";
import "./App.scss"


const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLogined } = useSelector((state: RootState) => state.auth);
  useEffect(() => {

  }, [dispatch, isLogined]);

  return (
    <div className="app">
      {isLogined ? (
        <div className="chats-container">
          <ChatList />
          <div className="chat-container">
            <ChatWindow />
          </div>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default App;
