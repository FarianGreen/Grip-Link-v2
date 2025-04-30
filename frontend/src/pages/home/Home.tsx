import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "@/store/store";
import "./home.scss";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "@/store/profileSlice";

interface ProfileFormData {
  name: string;
  email: string;
  bio: string;
  avatar: File | null;
}

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
    bio: "",
    avatar: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, avatar: e.target.files[0] });
    } else {
      setFormData({ ...formData, avatar: null });
    }
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSave = async () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("bio", formData.bio);
    if (formData.avatar) {
      data.append("avatar", formData.avatar);
    }

    dispatch(updateProfile(data));
    handleEditToggle();
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        bio: user.bio || "Тут могла бы быть ваша биография 😎",
        avatar: null,
      });
    }
  }, [user]);
  return (
    <section className="profile">
      <div className="profile__card">
        <div className="profile__avatar">
          <img
            src={
              user?.avatar
                ? `http://localhost:5000/uploads/avatars/${user.avatar}`
                : "null"
            }
            alt="Аватар"
            className="profile__avatar-img"
          />
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
            <input
              type="file"
              name="avatar"
              onChange={handleAvatarChange}
              className="profile__file-input"
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
