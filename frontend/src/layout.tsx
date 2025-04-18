import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Path } from "./constants/Path";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { Header } from "./components/header/header";
import { Sidebar } from "./components/sidebar/sidebar";
import "./App.scss"
import { Notification } from "./components/notification/NotificationContainer";


export const Layout = () => {
  const { isLogined } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLogined) {
      navigate(Path.login);
    }
  },[isLogined]);
  return (
    <>
      <Header />
      <div className="layout">
        <Sidebar />
        <Outlet />
        <Notification/>
      </div>
    </>
  );
};
