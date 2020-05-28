import React, { useState } from 'react';
import TinyPopover from 'react-tiny-popover';
import './Popover.scss';

const Popover = ({
    render,
    text,
    jsx,
    className = '',
    position = ['left', 'bottom'],
}) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const getContent = () => {
        if (jsx) return jsx;
        if (text) return <div className='popover'>{text}</div>;
    };

    return (
        <TinyPopover
            isOpen={isPopoverOpen}
            position={position}
            onClickOutside={() => setIsPopoverOpen(false)}
            content={getContent()}>
            <div className={className} onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
                {render()}
            </div>
        </TinyPopover>
    );
};

export default Popover;
