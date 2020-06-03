import React from 'react';
import './RoundedRect.scss';

const RoundedRect = ({ title, className, onClick, children }) => {
    return (
        <div className={`rounded-rect ${className}`} onClick={onClick}>
            {children || title}
        </div>
    );
};

export default RoundedRect;
