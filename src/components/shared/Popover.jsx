import React, { useState } from 'react';
import PopoverBase from './PopoverBase';

const Popover = ({
    render,
    text,
    jsx,
    className,
    position,
    closeOnClickOutside,
    callback,
}) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    return (
        <PopoverBase
            render={render}
            jsx={jsx}
            text={text}
            isPopoverOpen={isPopoverOpen}
            setIsPopoverOpen={setIsPopoverOpen}
            closeOnClickOutside={closeOnClickOutside}
            position={position}
            className={className}
            callback={callback}
        />
    );
};

export default Popover;
