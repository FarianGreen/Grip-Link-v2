import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
import { AppDispatch, RootState } from "../store/store";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="login-container">
      <h2>Вход</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Загрузка..." : "Войти"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
