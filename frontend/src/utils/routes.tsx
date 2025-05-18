import { lazy } from "react";
import { withBoundedSuspense } from "./withBoundedSuspense";

import { Path } from "@/constants/Path";
import { Layout } from "@/app/layout";


const MessagesPage = lazy(() => import("@/pages/messages/Messages"));
const RegisterForm = lazy(() => import("@/pages/register/Register"));
const LoginForm = lazy(() => import("@/pages/login/Login"));
const HomePage = lazy(() => import("@/pages/home/Home"));

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: withBoundedSuspense(HomePage),
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
    element: withBoundedSuspense(LoginForm),
  },
];

export default routes;
