import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popover from './shared/Popover';
import Stepper from './shared/Stepper';
import { useTimer } from '../context/TimerContext';

const ChangeTimer = ({ position, toggleEditing }) => {
    const { countdown, updateCountdown } = useTimer();

    return (
        <Popover
            jsx={
                <div className='popover-body'>
                    <div>
                        <Stepper initialNumber={countdown} callback={updateCountdown} />
                    </div>
                </div>
            }
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
