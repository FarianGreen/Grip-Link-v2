import { useEffect } from "react";
import { RootState } from "../../store/store";
import "./home.scss";
import { useDispatch, useSelector } from "react-redux";

const HomePage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  console.log(user)
  useEffect(() => {
    if (!user) return;
  }, [user]);
  return (
    <section className="profile">
      <div className="profile__card">
        <div className="profile__avatar">
          <img src="./src\assets\img\ava.jpg" alt="Аватар" />
        </div>

        <div className="profile__info">
          <h2 className="profile__name">{user?.name}</h2>
          <p className="profile__email">{user?.email}</p>
          <p className="profile__bio">Биография пользователя...{user?.role}</p>
        </div>

        <div className="profile__actions">
          <button className="profile__edit-btn">Редактировать профиль</button>
        </div>
      </div>
    </section>
  );
};
export default HomePage;
