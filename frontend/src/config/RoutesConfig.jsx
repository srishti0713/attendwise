import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

export const routes = [
    {
        path: "/register",
        element: <Register />,
        protected: false,
        publicOnly: true,
    },
    {
        path: "/login",
        element: <Login />,
        protected: false,
        publicOnly: true,
    },
];
