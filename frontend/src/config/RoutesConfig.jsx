import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import LandingPage from "../pages/core/LandingPage";
import HomePage from "../pages/homePage/HomePage";
import SubjectsDisplay from "../pages/subjects/SubjectsDisplay";

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
        path: "/subjects",
        element: <SubjectsDisplay />,
        protected: true,
        publicOnly: false,
    },
    {
        path: "/home",
        element: <HomePage />,
        protected: true,
        publicOnly: false,
    },
];
