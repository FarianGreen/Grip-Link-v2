import { Link } from "react-router-dom";
import { Path } from "@/constants/Path";
import "./header.scss";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { logoutUser } from "@/features/auth/authThunks";
import { LogoutIcon } from "../Icons";

export const Header = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const handleClick = (path: string) => {
    setActiveItem(path);
  };
  const handleLogOut = () => {
    dispatch(logoutUser());
  };
  return (
    <section className="header">
      <div className="header__inner">
        <div className="header__side" />
        <ul className="header-links">
          {[
            { path: Path.home, label: "Профиль" },
            { path: Path.messages, label: "Мессенджер" },
          ].map(({ path, label }) => (
            <Link
              key={path}
              className={`header__nav-menu-item ${
                activeItem === path ? "active" : ""
              }`}
              onClick={() => handleClick(path)}
              to={path}
            >
              <span>{label}</span>
            </Link>
          ))}
        </ul>
        <div className="header__side">
          <button className="header-logout-btn" onClick={() => handleLogOut()}>
            Выйти
            <LogoutIcon size={24} color="white" className="ml-auto" />
          </button>
        </div>
      </div>
    </section>
  );
};
