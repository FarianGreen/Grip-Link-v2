import { useEffect, useState } from "react";
import { RootState } from "../../store/store";
import "./home.scss";
import { useDispatch, useSelector } from "react-redux";

const HomePage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name:"",
    email:"",
    bio: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSave = () => {
    // TODO: позже добавим dispatch в бекенд
    setIsEditing(false);
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        bio: "Тут могла бы быть ваша биография 😎", // позже добавим из user
      });
    }
  }, [user]);
  return (
    <section className="profile">
      <div className="profile__card">
        <div className="profile__avatar">
          <img src="./src\assets\img\ava.jpg" alt="Аватар" />
        </div>
        {!isEditing ? (
          <div className="profile__info">
            <h2 className="profile__name">{formData.name}</h2>
            <p className="profile__email">{formData.email}</p>
            <p className="profile__bio">{formData.bio}</p>
          </div>
        ) : (
          <form className="profile__edit-form">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Имя"
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="О себе..."
            />
          </form>
        )}

        <div className="profile__actions">
          {isEditing ? (
            <button className="profile__edit-btn" onClick={handleSave}>
              Сохранить
            </button>
          ) : (
            <button className="profile__edit-btn" onClick={handleEditToggle}>Редактировать профиль</button>
          )}
        </div>
      </div>
    </section>
  );
};
export default HomePage;
