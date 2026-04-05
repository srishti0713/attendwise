import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import LandingPage from "../pages/core/LandingPage";
import HomePage from "../pages/homePage/HomePage";

export const routes = [
    {
        path: "/",
        element: <LandingPage />,
        protected: false,
        publicOnly: true,
    },
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
    {
        path: "/home",
        element: <HomePage />,
        protected: true,
        publicOnly: false,
    },
];
