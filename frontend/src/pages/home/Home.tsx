import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../store/store";
import "./home.scss";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../store/profileSlice";

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSave = async () => {
    const { name, bio } = formData;
    // Отправка данных на сервер для обновления профиля
    await dispatch(updateProfile({ name, bio }));
    setIsEditing(false); // Выход из режима редактирования
  };
console.log(user)
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        bio: user.bio || "Тут могла бы быть ваша биография 😎", // Используем значение bio, если оно есть
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
            <button className="profile__edit-btn" onClick={handleEditToggle}>
              Редактировать профиль
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
export default HomePage;
