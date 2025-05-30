import "./register.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../store/authSlice";
import { AppDispatch, RootState } from "../../store/store";
import { Path } from "../../constants/Path";
import { RegisterFormData, registerSchema } from "../../shared/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormInput from "../../components/formInput/FormInput";

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      navigate(Path.home);
    }
  };

  return (
    <div className="auth-container">
      <div className="animation-card">
        <div className="card-content">
          <h2>Регистрация</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              label="Имя"
              type="text"
              {...register("name")}
              error={errors.name}
            />
            <FormInput
              label="Email"
              type="email"
              {...register("email")}
              error={errors.email}
            />
            <FormInput
              label="Пароль"
              type="password"
              {...register("password")}
              error={errors.password}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Загрузка..." : "Зарегистрироваться"}
            </button>
          </form>
          <p className="from-link">
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
