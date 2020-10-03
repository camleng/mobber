import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    determineScreenSizeCategory,
    addWindowResizeCallback,
} from '../services/screenSize';
import './Menu.scss';

const Menu = ({ children }: Props) => {
    const category = determineScreenSizeCategory();
    const [isTablet, setIsTablet] = useState(category === 'tablet');
    const [shown, setShown] = useState(false);

    const toggle = () => setShown(!shown);

    useEffect(() => {
        addWindowResizeCallback((category: string) => {
            const isTablet = category === 'tablet';
            setIsTablet(isTablet);
        });
    }, []);

    return (
        <div className='menu'>
            {
                <div className={`menu-caret`}>
                    {
                        <FontAwesomeIcon
                            icon='chevron-down'
                            onClick={toggle}
                            className={`icon ${shown ? 'show' : ''}`}
                            title='toggle menu'
                        />
                    }
                </div>
            }
            <div className={`menu-options ${shown || isTablet ? 'show' : ''}`}>
                {children}
            </div>
        </div>
    );
};

export default Menu;

type Props = {
    children: JSX.Element
}