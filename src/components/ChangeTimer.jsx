import React, { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popover from './shared/Popover';
import Stepper from './shared/Stepper';
import { useTimer } from '../context/TimerContext';
import './ChangeTimer.scss';

const ChangeTimer = ({ position, toggleEditing, disabled = false }) => {
    const { countdown, updateCountdown } = useTimer();

    const updateTheCountdown = useCallback((number) => updateCountdown(number * 60), [
        updateCountdown,
    ]);

    const jsx = (
        <div className='popover-body'>
            <div className='mob-length'>Mob Length</div>
            <Stepper
                initialNumber={Math.floor(countdown / 60)}
                minimum={1}
                callback={updateTheCountdown}
            />
        </div>
    );

    return (
        <Popover
            jsx={!disabled && jsx}
            callback={!disabled && toggleEditing}
            position={position}
            render={() => (
                <FontAwesomeIcon
                    icon='stopwatch'
                    className={`stopwatch ${disabled ? 'disabled' : ''}`}
                    onClick={disabled ? undefined : toggleEditing}
                    title='Change Mob Length'
                />
            )}
        />
    );
};

export default ChangeTimer;
