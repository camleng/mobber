import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popover from './shared/Popover';

const ChangeTimer = ({ position, toggleEditing }) => {
    return (
        <Popover
            position={position}
            render={() => (
                <FontAwesomeIcon
                    icon='stopwatch'
                    className='stopwatch'
                    onClick={toggleEditing}
                />
            )}
        />
    );
};

export default ChangeTimer;
