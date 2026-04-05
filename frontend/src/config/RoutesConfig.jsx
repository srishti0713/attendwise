import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import SubjectsDisplay from "../pages/subjects/SubjectsDisplay";

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
    {
        path: "/subjects",
        element: <SubjectsDisplay />,
        protected: true,
        publicOnly: false,
    },
];
