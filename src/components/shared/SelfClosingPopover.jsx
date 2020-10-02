import React, { useState } from 'react';
import Popover from './Popover';

const SelfClosingPopover = ({
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
        <Popover
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

export default SelfClosingPopover;
