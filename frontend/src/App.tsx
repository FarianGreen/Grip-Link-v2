import { lazy, Suspense } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Layout } from './layout';
import { Path } from './constants/Path';



const MessagesPage = lazy(() => import('./pages/messages/Messages'));
const RegisterForm = lazy(() => import('./pages/register/Register'));
const LoginForm = lazy(() => import('./pages/login/Login'));


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
    //   { index: true, element: <Suspense fallback={<div>Loading...</div>}><Home /></Suspense> },
      { path: Path.messages, element: <Suspense fallback={<div>Loading...</div>}><MessagesPage /></Suspense> },
    ],
  },
  { path: Path.register, element: <Suspense fallback={<div>Loading...</div>}><RegisterForm /></Suspense> },
  { path: Path.login, element: <Suspense fallback={<div>Loading...</div>}><LoginForm /></Suspense> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;