import React, { useState } from 'react';
import TinyPopover from 'react-tiny-popover';
import './Popover.scss';

const Popover = ({
    render,
    text,
    jsx,
    className = '',
    position = ['left', 'bottom'],
    isOpen = true,
    closeOnClickOutside = true,
    callback,
}) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const content = jsx ? jsx : <div className='popover'>{text}</div>;

    const onClose = () => {
        if (closeOnClickOutside) {
            setIsPopoverOpen(false);
            if (callback) callback();
        }
    };

    const togglePopover = () => {
        setIsPopoverOpen(!isPopoverOpen);
    };

    return (
        <TinyPopover
            isOpen={isPopoverOpen && isOpen}
            position={position}
            onClickOutside={onClose}
            content={content}>
            <div className={className} onClick={togglePopover}>
                {render()}
            </div>
        </TinyPopover>
    );
};

export default Popover;
