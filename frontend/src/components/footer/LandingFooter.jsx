const LandingFooter = () => { 
    const email = import.meta.env.VITE_EMAIL || "";
    return (
        <div className="w-full max-w-4xl mx-auto mt-8">

            {/* Divider */}
            <div
                className="h-px w-full mb-8"
                style={{
                    background: "linear-gradient(to right, transparent, rgba(26,26,46,0.3), transparent)",
                }}
            />

            {/* Footer content */}
            <div className="flex flex-col items-center gap-1 pb-4 px-2">
                <p className="text-[#1A1A2E] text-xs font-semibold uppercase tracking-widest opacity-50">
                    Contact Us
                </p>
                <a
                    href={`mailto:${email}`}
                    className="text-[#1A1A2E] text-xs opacity-60 hover:opacity-100 hover:underline transition-opacity bg-transparent cursor-pointer"
                >
                    {email}
                </a>
                <p className="text-[#1A1A2E] text-xs opacity-50 mt-1">
                    © {new Date().getFullYear()} AttendWise. All rights reserved.
                </p>
            </div>

        </div>
    );
};

export default LandingFooter;   