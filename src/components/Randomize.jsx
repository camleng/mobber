import React from 'react';
import Popover from './shared/Popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Randomize = ({ randomize }) => {
    return (
        <Popover
            text='Randomized!'
            className='randomize'
            position={['bottom', 'left']}
            render={() => (
                <div onClick={randomize}>
                    <FontAwesomeIcon icon='dice' />
                </div>
            )}
        />
    );
};

export default Randomize;
