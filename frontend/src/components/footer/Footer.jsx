// import { TextAlignJustify, CalendarDays, Grid3x3 } from "lucide-react";
// import Button from "../buttons/Button";
// import { useNavigate } from "react-router-dom";

// const Footer = () => {
//     const navigate = useNavigate();
//     return (
//         <div className="dock bg-[#F2EEE8] border-t border-[#E2DBF0]">
//             <Button
//                 className="text-[#8070AA] bg-transparent border-none shadow-none hover:text-[#4A20C4]"
//                 onClick={() => navigate("/subjects")}
//             >
//                 <TextAlignJustify size={20} />
//             </Button>

//             <Button
//                 className="dock-active bg-[#1A1A2E] text-white border-none rounded-full w-12 h-12 flex items-center justify-center shadow-md hover:bg-[#2D2D4A]"
//                 onClick={() => navigate("/calendar")}
//             >
//                 <CalendarDays size={20} />
//             </Button>

//             <Button
//                 className="text-[#8070AA] bg-transparent border-none shadow-none hover:text-[#4A20C4]"
//                 onClick={() => navigate("/timetable")}
//             >
//                 <Grid3x3 size={20} />
//             </Button>
//         </div>
//     );
// };

// export default Footer;

import { TextAlignJustify, CalendarDays, Grid3x3 } from "lucide-react";
import Button from "../buttons/Button";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();
    return (
        <div className="dock bg-linear-to-br from-[#EDE8F5] via-[#F2EEE8] to-[#E8F0F5] border-t border-[#E2DBF0]">
            <Button
                className="text-[#8070AA] bg-transparent border-none shadow-none hover:text-[#4A20C4]"
                onClick={() => navigate("/subjects")}
            >
                <TextAlignJustify size={20} />
            </Button>

            <Button
                className="dock-active bg-[#1A1A2E] text-white border-none rounded-full w-12 h-12 flex items-center justify-center shadow-md hover:bg-[#2D2D4A]"
                onClick={() => navigate("/calendar")}
            >
                <CalendarDays size={20} />
            </Button>

            <Button
                className="text-[#8070AA] bg-transparent border-none shadow-none hover:text-[#4A20C4]"
                onClick={() => navigate("/timetable")}
            >
                <Grid3x3 size={20} />
            </Button>
        </div>
    );
};

export default Footer;