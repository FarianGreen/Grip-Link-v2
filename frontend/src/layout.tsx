import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Path } from "./constants/Path";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { Header } from "./pages/header/header";
import { Sidebar } from "./pages/sidebar/sidebar";
import "./App.scss"

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
      </div>
    </>
  );
};
