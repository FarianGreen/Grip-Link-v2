import { Link } from "react-router-dom";
import { Path } from "../../constants/Path";
import "./header.scss";

export const Header = () => {
  return (
    <section className="header">
      <Link className="header__nav-menu-item" to={Path.home}>
        <span>Профиль</span>
      </Link>

      <Link className="header__nav-menu-item" to={Path.messages}>
        <span>Мессенджер</span>
      </Link>
    </section>
  );
};
