import React from 'react';
import TinyPopover from 'react-tiny-popover';
import { IPopoverProps } from './Popover';
import './Popover.scss';

export interface IPopoverBaseProps extends IPopoverProps {
    isPopoverOpen: boolean,
    setIsPopoverOpen: (value: boolean) => void,
}

const PopoverBase = ({
    render,
    text,
    jsx,
    className = '',
    position = 'bottom',
    isPopoverOpen,
    setIsPopoverOpen,
    closeOnClickOutside = true,
    callback,
}: IPopoverBaseProps) => {
    const content = (): JSX.Element => {
        if (jsx) return jsx;
        if (text) return <div className='popover'>{text}</div>;
        else return <></>;
    };

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
            isOpen={isPopoverOpen}
            position={position}
            onClickOutside={onClose}
            content={content}>
            <div className={className} onClick={togglePopover}>
                {render()}
            </div>
        </TinyPopover>
    );
};



export default PopoverBase;
