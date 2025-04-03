import { lazy, Suspense, useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Layout } from './layout';
import { Path } from './constants/Path';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store/store';
import { fetchUser } from './store/authSlice';



const MessagesPage = lazy(() => import('./pages/messages/Messages'));
const RegisterForm = lazy(() => import('./pages/register/Register'));
const LoginForm = lazy(() => import('./pages/login/Login'));
const HomePage =lazy(()=> import('./pages/home/Home'))


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Suspense fallback={<div>Loading...</div>}><HomePage /></Suspense> },
      { path: Path.messages, element: <Suspense fallback={<div>Loading...</div>}><MessagesPage /></Suspense> },
    ],
  },
  { path: Path.register, element: <Suspense fallback={<div>Loading...</div>}><RegisterForm /></Suspense> },
  { path: Path.login, element: <Suspense fallback={<div>Loading...</div>}><LoginForm /></Suspense> },
]);

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      dispatch(fetchUser());
    }
  }, [dispatch]);
  return <RouterProvider router={router} />;
}

export default App;