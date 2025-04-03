import { Link } from "react-router-dom";
import { Path } from "../../constants/Path";
import "./header.scss";
import { useState } from "react";

export const Header = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const handleClick = (path: string) => {
    setActiveItem(path);
  };
  return (
    <section className="header">
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
    </section>
  );
};
