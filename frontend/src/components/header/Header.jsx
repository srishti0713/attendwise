import Button from "../buttons/Button";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    return (
        <div className="sticky top-0 z-50 backdrop-blur-md dark:bg-black/20 border-b border-white/10 bg-blue-800">
            <div className="navbar px-6 md:px-10">
                <div className="flex flex-1 justify-between ">
                    <h1
                        className="text-white text-xl md:text-2xl font-extrabold tracking-wide cursor-pointer"
                        onClick={() => {
                            navigate("/home");
                        }}
                    >
                        {import.meta.env.VITE_APP_NAME}
                    </h1>

                    <Button
                        onClick={() => {
                            navigate("/profile");
                        }}
                    >
                        Profile
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Header;
