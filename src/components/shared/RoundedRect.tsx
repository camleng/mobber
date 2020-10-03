import React from 'react';
import './RoundedRect.scss';

const RoundedRect = ({ title, className, onClick, children, ...rest }: Props) => {
    return (
        <button className={`rounded-rect ${className}`} onClick={onClick} {...rest}>
            {children || title}
        </button>
    );
};

export default RoundedRect;

type Props = {
    title?: string,
    className: string,
    disabled?: boolean = false,
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    children?: JSX.Element
}
