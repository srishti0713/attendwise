import React from "react";
import Button from "../../components/buttons/Button";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-between py-16 px-6"
            style={{
                background:
                    "linear-gradient(135deg, #C9A96E 0%, #B8A9C9 40%, #9B9EC8 70%, #8B9DC8 100%)",
            }}
        >
            {/* Hero */}
            <div className="flex flex-col items-center text-center mt-8">
                <h1 className="font-playfair text-5xl md:text-6xl font-bold text-[#1A1A2E] mb-4 tracking-tight">
                    AttendWise
                </h1>
                <p className="text-[#2D2D4A] text-base md:text-lg max-w-md leading-relaxed mb-8 opacity-80">
                    Manage your classes, track attendance, and stay organized
                    like never before.
                </p>
                <div className="flex gap-3">
                    <Button
                        onClick={() => navigate("/register")}
                        className="bg-[#1A1A2E] text-white border-none rounded-full px-8 py-2.5 text-sm font-semibold"
                    >
                        Sign Up
                    </Button>
                    <Button
                        onClick={() => navigate("/login")}
                        className="bg-white/30 text-[#1A1A2E] border border-white/50 rounded-full px-8 py-2.5 text-sm font-semibold backdrop-blur-sm"
                    >
                        Sign In
                    </Button>
                </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl my-12">
                {[
                    {
                        title: "Easy Tracking",
                        desc: "Mark and manage attendance quickly with a simple interface.",
                    },
                    {
                        title: "Analytics",
                        desc: "Get insights into attendance trends and performance.",
                    },
                    {
                        title: "Secure & Reliable",
                        desc: "Your data is safe and accessible anytime, anywhere.",
                    },
                ].map((card) => (
                    <div
                        key={card.title}
                        className="rounded-2xl p-6 flex font-playfair flex-col gap-3 relative"
                        style={{
                            background: "rgba(255,255,255,0.25)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(255,255,255,0.4)",
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-[#1A1A2E] font-semibold text-base">
                                {card.title}
                            </h2>
                        </div>
                        <p className="text-[#2D2D4A] text-sm leading-relaxed opacity-75">
                            {card.desc}
                        </p>
                        <div
                            className="mt-2 h-1.5 rounded-full w-2/3"
                            style={{
                                background:
                                    "linear-gradient(to right, #C9A96E, #B8A9C9)",
                            }}
                        ></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LandingPage;
