import React, { useEffect } from "react";
import "./login.scss";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { loginUser } from "../../store/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { Path } from "../../constants/Path";
import { loginSchema, LoginSchemaType } from "../../shared/loginSchema";
import FormInput from "../../components/formInput/FormInput";

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isLogined } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginSchemaType) => {
    dispatch(loginUser(data));
  };

  useEffect(() => {
    if (isLogined) {
      navigate(Path.home);
    }
  }, [isLogined]);

  return (
    <div className="login-container">
      <div className="animation-card">
        <div className="card-content">
          <h2>Вход</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
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
            <button className="login-button" type="submit" disabled={loading}>
              {loading ? "Загрузка..." : "Войти"}
            </button>
            {error && <p className="error">{error}</p>}
          </form>
          <p className="from-link">
            Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
