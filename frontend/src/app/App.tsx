import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import { fetchUser } from "@/features/auth/authThunks";
import { initSocket } from "@/services/socket";
import Loader from "@/components/Loader/Loader";
import AnimatedRoutes from "@/utils/AnimatedRoutes";
import { useLocation, useNavigate } from "react-router-dom";
import { Path } from "@/constants/Path";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLogined, loading } = useSelector(
    (state: RootState) => state.auth
  );
  console.log(loading);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [user, dispatch]);

  useEffect(() => {
    initSocket();
  }, []);

  useEffect(() => {
    const isAuthPage =
      location.pathname === Path.login || location.pathname === Path.register;

    if (!isLogined && !user && !loading && !isAuthPage) {
      navigate(Path.login);
    }
  }, [isLogined, user, loading, navigate, location.pathname]);

  if (loading) {
    return <Loader />;
  }

  return <AnimatedRoutes />;
}

export default App;
