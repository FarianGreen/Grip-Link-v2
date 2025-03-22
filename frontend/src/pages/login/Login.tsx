import React, { useEffect, useState } from "react";
import "./login.scss";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/authSlice";
import { AppDispatch, RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { Path } from "../../constants/Path";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const { isLogined } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };
  useEffect(() => {
    if (isLogined) {
      navigate(Path.home);
    }
  }, [isLogined]);
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Вход</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Пароль</label>
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Загрузка..." : "Войти"}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
        <p className="register-link">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
