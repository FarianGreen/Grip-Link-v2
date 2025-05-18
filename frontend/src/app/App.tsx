import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import { fetchUser } from "@/features/auth/authThunks";
import { initSocket } from "@/services/socket";
import Loader from "@/components/Loader/Loader";
import AnimatedRoutes from "@/utils/AnimatedRoutes";
import { useNavigate } from "react-router-dom";
import { Path } from "@/constants/Path";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isLogined, loading } = useSelector(
    (state: RootState) => state.auth
  );
  console.log(loading)

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [user, dispatch]);

  useEffect(() => {
    initSocket();
  }, []);

  useEffect(() => {
    if (!isLogined && !user && !loading) {
      navigate(Path.login);
    }
  }, [isLogined, user, loading, navigate]);

  if (loading) {
    console.log(loading)
    return <Loader />;
  }

  return <AnimatedRoutes />;
}

export default App;