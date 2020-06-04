import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { determineScreenSizeCategory, addResizeCallback } from '../services/screenSize';
import './Menu.scss';

const Menu = ({ children }) => {
    const category = determineScreenSizeCategory();
    const [isTablet, setIsTablet] = useState(category === 'tablet');
    const [shown, setShown] = useState(false);

    const toggle = () => setShown(!shown);

    useEffect(() => {
        addResizeCallback((category) => {
            const isTablet = category === 'tablet';
            setIsTablet(isTablet);
        });
    }, []);

    return (
        <div className='menu'>
            {
                <div className={`menu-caret`}>
                    {!shown && (
                        <FontAwesomeIcon
                            icon='chevron-down'
                            onClick={toggle}
                            className='icon'
                        />
                    )}
                    {shown && (
                        <FontAwesomeIcon
                            icon='chevron-up'
                            onClick={toggle}
                            className='icon'
                        />
                    )}
                </div>
            }
            <div className={`menu-options ${shown || isTablet ? 'show' : ''}`}>
                {children}
            </div>
        </div>
    );
};

export default Menu;
