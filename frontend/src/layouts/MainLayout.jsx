import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import { useRef } from "react";

const ROUTES = ["/subjects", "/home", "/timetable"];

const MainLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const touchStartX = useRef(null);

    const currentIndex = ROUTES.indexOf(location.pathname);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        const THRESHOLD = 60;

        if (diff > THRESHOLD && currentIndex < ROUTES.length - 1) {
            navigate(ROUTES[currentIndex + 1]);
        } else if (diff < -THRESHOLD && currentIndex > 0) {
            navigate(ROUTES[currentIndex - 1]);
        }

        touchStartX.current = null;
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main
                className="pt-6 px-4 bg-linear-to-br from-[#EDE8F5] via-[#F2EEE8] to-[#E8F0F5] flex-1 overflow-y-auto min-h-0 "
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;