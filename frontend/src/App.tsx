import { JSX, lazy, Suspense, useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout } from "./layout";
import { Path } from "./constants/Path";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { fetchUser } from "./store/authSlice";
import ErrorBoundry from "./shared/errorBoundary/ErrorBoundary";

const MessagesPage = lazy(() => import("./pages/messages/Messages"));
const RegisterForm = lazy(() => import("./pages/register/Register"));
const LoginForm = lazy(() => import("./pages/login/Login"));
const HomePage = lazy(() => import("./pages/home/Home"));

const withBoundedSuspense = (Component: React.LazyExoticComponent<() => JSX.Element>) => (
  <ErrorBoundry>
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  </ErrorBoundry>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: withBoundedSuspense(HomePage)
      },
      {
        path: Path.messages,
        element: withBoundedSuspense(MessagesPage),
      },
    ],
  },
  {
    path: Path.register,
    element: withBoundedSuspense(RegisterForm),
  },
  {
    path: Path.login,
    element:withBoundedSuspense(LoginForm),
  },
]);

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = localStorage.getItem("accessToken");
  useEffect(() => {
    if (!token || !user) {
      dispatch(fetchUser());
    }
  }, [dispatch]);
  return <RouterProvider router={router} />;
}

export default App;
