import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Menu.scss';

const Menu = ({ children }) => {
    const [shown, setShown] = useState(true);

    const toggle = () => setShown(!shown);

    return (
        <div className='menu-container'>
            <div className={`menu-overlay ${shown ? 'show' : ''}`}>
                {!shown && (
                    <FontAwesomeIcon
                        icon='chevron-up'
                        onClick={toggle}
                        className='icon'
                    />
                )}
                {shown && (
                    <FontAwesomeIcon
                        icon='chevron-down'
                        onClick={toggle}
                        className='icon'
                    />
                )}
            </div>
            <div className='menu-options'>{children}</div>
        </div>
    );
};

export default Menu;
