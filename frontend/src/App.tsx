import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { fetchUser } from "./store/authSlice";
import Loader from "./components/Loader/Loader";
import AnimatedRoutes from "./utils/AnimatedRoutes";
import { initSocket } from "./services/socket";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLogined, loading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [user, loading, dispatch]);

  useEffect(() => {
    initSocket();
  }, [dispatch]);

  if (isLogined && !user && loading) {
    return <Loader />;
  }

  return <AnimatedRoutes />;
}

export default App;
