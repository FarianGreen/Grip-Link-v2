import { useEffect } from "react";
import "./login.scss";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Path } from "@/constants/Path";
import { loginSchema, LoginSchemaType } from "@/shared/validationsSchems/loginSchema";
import Input from "@/shared/ui/input/Input";
import { AppDispatch, RootState } from "@/app/store";
import { loginUser } from "@/features/auth/authThunks";
import { PasswordInput } from "@/shared/ui/PasswordInput";

const Login = () => {
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
          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email"
              {...register("email")}
              error={errors.email}
            />
            <PasswordInput
              label="Пароль"
              {...register("password")}
              error={errors.password}
            />
            <button className="login-button" type="submit" >
              {loading ? "Загрузка..." : "Войти"}
            </button>
            {error && <p className="error">{error}</p>}
          </form>
          <p className="from-link">
            Нет аккаунта? <Link to={Path.register}>Зарегистрироваться</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
