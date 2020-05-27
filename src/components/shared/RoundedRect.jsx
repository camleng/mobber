import React from "react";
import "./RoundedRect.scss";

const RoundedRect = ({ title, className, onClick }) => {
    return (
        <div className={`rounded-rect ${className}`} onClick={onClick}>
            {title}
        </div>
    );
};

export default RoundedRect;
