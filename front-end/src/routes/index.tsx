import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Error404 from "../pages/Error404";
import UnprotectedRoute from "./UnprotectedRoute";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <UnprotectedRoute />,
    children: [
      {
        path: "",
        element: <Login />,
      },
    ],
  },
  {
    path: "/register",
    element: <UnprotectedRoute />,
    children: [
      {
        path: "",
        element: <Register />,
      },
    ],
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <Home />,
      },
    ],
  },
  {
    path: "*",
    element: <Error404 />,
  },
]);

export default router;
