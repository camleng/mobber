import React from 'react';
import './RoundedRect.scss';

const RoundedRect = ({ title, className, onClick, children, ...rest }) => {
    return (
        <button className={`rounded-rect ${className}`} onClick={onClick} {...rest}>
            {children || title}
        </button>
    );
};

export default RoundedRect;
