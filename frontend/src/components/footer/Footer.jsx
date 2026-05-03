import { TextAlignJustify, CalendarDays, Grid3x3, House } from "lucide-react";
import Button from "../buttons/Button";
import { useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;

    const tabs = [
        { icon: <House size={20} />, route: "/home" },
        { icon: <TextAlignJustify size={20} />, route: "/subjects" },
        { icon: <CalendarDays size={20} />, route: "/calendar" },
        { icon: <Grid3x3 size={20} />, route: "/timetable" },
    ];

    return (
        <div className="bg-linear-to-br from-[#EDE8F5] via-[#F2EEE8] to-[#E8F0F5] border-t border-[#E2DBF0] flex justify-around items-center px-6 py-3">
            {tabs.map(({ icon, route }) => {
                const isActive = path === route;
                return (
                    <button
                        key={route}
                        onClick={() => navigate(route)}
                        className="flex flex-col items-center gap-1 border-none bg-transparent cursor-pointer"
                    >
                        
                            <div
                                className={`px-6 py-3 rounded-full flex items-center justify-center transition-all ${
                                    isActive
                                        ? "bg-[#1A1A2E] text-white"
                                        : "bg-[#D6CBFA] text-[#4A20C4]"
                                }`}
                            >
                                {icon}
                            </div>
                        
                           
                       
                    </button>
                );
            })}
        </div>
    );
};

export default Footer;
