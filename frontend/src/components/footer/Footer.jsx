import { TextAlignJustify, CalendarDays, Grid3x3 } from "lucide-react";
import Button from "../buttons/Button";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();
    return (
        <div className="dock">
            <Button
                onClick={() => {
                    navigate("/subjects");
                }}
            >
                <TextAlignJustify />
            </Button>

            <Button
                className="dock-active"
                onClick={() => {
                    navigate("/calendar");
                }}
            >
                <CalendarDays />
            </Button>

            <Button
                onClick={() => {
                    navigate("/timetable");
                }}
            >
                <Grid3x3 />
            </Button>
        </div>
    );
};

export default Footer;
