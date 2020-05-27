import React from 'react';
import Popover from './shared/Popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Randomize.scss';

const Randomize = ({ randomize }) => {
    return (
        <Popover
            className='randomize'
            render={() => (
                <div onClick={randomize}>
                    <FontAwesomeIcon icon='dice' />
                </div>
            )}
        />
    );
};

export default Randomize;
