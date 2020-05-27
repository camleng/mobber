import React, { useState } from 'react';
import TinyPopover from 'react-tiny-popover';
import './Popover.scss';

const Popover = ({ render, text, className = '', position = ['left', 'bottom'] }) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    return (
        <TinyPopover
            isOpen={isPopoverOpen}
            position={position}
            onClickOutside={() => setIsPopoverOpen(false)}
            content={text && <div className='popover'>{text}</div>}>
            <div className={className} onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
                {render()}
            </div>
        </TinyPopover>
    );
};

export default Popover;
