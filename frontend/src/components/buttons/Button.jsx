import React from "react";
//reusable button component
const Button = ({
    label,
    children,
    variant = "",
    outline = false,
    fullWidth = false,
    onClick,
    className = "",
}) => {
    return (
        <button
            onClick={onClick}
            className={`btn ${outline ? "btn-outline" : `btn-${variant}`} ${fullWidth ? "w-full" : ""}`}
        >
            {children || label}
        </button>
    );
};

export default Button;
