import React, { useState } from 'react';
import TinyPopover from 'react-tiny-popover';
import './Popover.scss';

const Popover = ({
    render,
    text,
    jsx,
    className = '',
    position = ['left', 'bottom'],
    callback,
}) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const getContent = () => {
        if (jsx) return jsx;
        if (text) return <div className='popover'>{text}</div>;
    };

    const onClose = () => {
        setIsPopoverOpen(false);
        if (callback) callback();
    };

    const togglePopover = () => setIsPopoverOpen(!isPopoverOpen);

    return (
        <TinyPopover
            isOpen={isPopoverOpen}
            position={position}
            onClickOutside={onClose}
            content={getContent()}>
            <div className={className} onClick={togglePopover}>
                {render()}
            </div>
        </TinyPopover>
    );
};

export default Popover;
