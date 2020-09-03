import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popover from './shared/Popover';
import Stepper from './shared/Stepper';
import { useTimer } from '../context/TimerContext';
import './ChangeTimer.scss';

const ChangeTimer = ({ position, toggleEditing }) => {
    const { countdown, updateCountdown } = useTimer();

    return (
        <Popover
            jsx={
                <div className='popover-body'>
                    <div className='mob-length'>Mob Length</div>
                    <Stepper
                        initialNumber={Math.floor(countdown / 60)}
                        callback={(number) => updateCountdown(number * 60)}
                    />
                </div>
            }
            callback={toggleEditing}
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
