import Button from "../buttons/Button";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    return (
        <div className="sticky top-0 z-50 bg-[#EDE8F5] border-b shadow-sm border-[#E2DBF0]">
            <div className="navbar px-6 md:px-10">
                <div className="flex flex-1 justify-between items-center">
                    <h1
                        className="text-[#1A1A2E] font-playfair text-3xl md:text-3xl font-extrabold tracking-wide cursor-pointer"
                        onClick={() => navigate("/home")}
                    >
                        {import.meta.env.VITE_APP_NAME}
                    </h1>

                    <Button
                        className="bg-[#E8E0F8] text-[#6B52B5] border-none rounded-full px-4 text-sm font-semibold hover:bg-[#D6CBFA]"
                        onClick={() => navigate("/profile")}
                    >
                        Profile
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Header;