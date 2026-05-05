import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import LandingPage from "../pages/core/LandingPage";
import HomePage from "../pages/home/HomePage";
import EditProfilePage from "../pages/profile/EditProfilePage";
import ProfilePage from "../pages/profile/ProfilePage";
import SubjectsDisplay from "../pages/subjects/SubjectsDisplay";
import AddSemesterPage from "../pages/semester/AddSemesterPage";
import EditSemesterPage from "../pages/semester/EditSemesterPage";

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
    {
        path: "/profile",
        element: <ProfilePage />,
        protected: true,
        publicOnly: false,
    },
    {
        path: "/profile/edit",
        element: <EditProfilePage />,
        protected: true,
        publicOnly: false,
    },
    {
        path: "/setup-semester",
        element: <AddSemesterPage />,
        protected: true,
        publicOnly: false,
    },
    {
        path: "/semesters/:semesterId/edit",
        element: <EditSemesterPage />,
        protected: true,
        publicOnly: false,
    },
];
