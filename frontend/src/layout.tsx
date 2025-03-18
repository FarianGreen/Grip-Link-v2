import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Path } from "./constants/Path";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";

export const Layout = () => {
  const { isLogined } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLogined) {
      navigate(Path.login);
    }
  });
  return (
    <>
      {/* <Header /> */}
      <Outlet />
      {/* <Sidebar /> */}
    </>
  );
};
