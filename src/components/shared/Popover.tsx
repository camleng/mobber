import React, { useState } from 'react';
import PopoverBase from './PopoverBase';

export interface IPopoverProps {
    render: () => JSX.Element,
    text?: string,
    jsx?: JSX.Element,
    className?: string,
    position?: "left" | "bottom" | "right" | "top",
    closeOnClickOutside?: boolean,
    callback?: () => any,
}

const Popover = ({
    render,
    text,
    jsx,
    className,
    position,
    closeOnClickOutside,
    callback,
}: IPopoverProps) => {
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
