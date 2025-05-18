import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import "./App.scss"
import { RootState } from "./store";
import { Path } from "@/constants/Path";
import { Header } from "@/components/header/header";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Notification } from "@/components/notification/NotificationContainer";

export const Layout = () => {
  const { isLogined } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLogined) {
      navigate(Path.login);
    }
  },[isLogined, navigate]);
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
