import Button from "../buttons/Button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

const Header = () => {
    const navigate = useNavigate();
    return (
        <div className="sticky top-0 z-50 bg-[#EDE8F5] border-b shadow-sm border-[#E2DBF0]">
            <div className="navbar px-6 md:px-10">
                <div className="flex flex-1 justify-between items-center">
                    
                    {/* Logo + Name — clicking either navigates home */}
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate("/home")}
                    >
                        {/* Logo: always visible */}
                        <img
                            src={"/attendwise-logo-circle.png"}
                            alt="Attendwise Logo"
                            className="h-9 w-9 object-contain"
                        />
                        {/* App name: hidden on mobile, visible on md+ */}
                        <h1 className="hidden md:block text-[#1A1A2E] font-playfair text-3xl font-extrabold tracking-wide">
                            {import.meta.env.VITE_APP_NAME}
                        </h1>
                    </div>

                    {/* Action buttons: always visible */}
                    <div className="flex gap-4 ml-4">
                        <Button
                            className="bg-[#E8E0F8] text-[#6B52B5] border-none rounded-full px-4 text-sm font-semibold hover:bg-[#D6CBFA]"
                            onClick={() => navigate("/setup-semester")}
                        >
                            <Plus size={18} />
                        </Button>
                        <Button
                            className="bg-[#E8E0F8] text-[#6B52B5] border-none rounded-full px-4 text-sm font-semibold hover:bg-[#D6CBFA]"
                            onClick={() => navigate("/profile")}
                        >
                            Profile
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;