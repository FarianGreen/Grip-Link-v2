import { Link } from "react-router-dom";
import "./sidebar.scss";
import { Path } from "../../constants/Path";

export const Sidebar = () => {
  return (
    <ul className="navbar">
      <Link className="navbar__item" to={Path.home}>
        Профиль
      </Link>
      <Link className="navbar__item" to={Path.messages}>
        Сообщения
      </Link>
    </ul>
  );
};
