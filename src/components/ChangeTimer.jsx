import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popover from './shared/Popover';
import Stepper from './shared/Stepper';
import { useTimer } from '../context/TimerContext';
import './ChangeTimer.scss';

const ChangeTimer = ({ position, toggleEditing, disabled = false }) => {
    const {
        countdown,
        updateCountdown,
        sessionsPerBreak,
        updateSessionsPerBreak,
        minutesPerBreak,
        updateMinutesPerBreak,
    } = useTimer();

    const memoizedUpdateCountdown = useCallback(
        (number) => updateCountdown(number * 60),
        [updateCountdown]
    );

    const memoizedUpdateSessionsPerBreak = useCallback(
        (number) => updateSessionsPerBreak(number),
        [updateSessionsPerBreak]
    );

    const memoizedUpdateMinutesPerBreak = useCallback(
        (number) => updateMinutesPerBreak(number),
        [updateMinutesPerBreak]
    );

    const jsx = (
        <div className='popover-body'>
            <div>
                <label>Minutes per session</label>
                <Stepper
                    initialNumber={Math.floor(countdown / 60)}
                    minimum={1}
                    callback={memoizedUpdateCountdown}
                />
            </div>

            <div>
                <label>Sessions per break</label>
                <Stepper
                    initialNumber={sessionsPerBreak}
                    minimum={1}
                    callback={memoizedUpdateSessionsPerBreak}
                />
            </div>

            <div>
                <label>Minutes per break</label>
                <Stepper
                    initialNumber={minutesPerBreak}
                    minimum={1}
                    callback={memoizedUpdateMinutesPerBreak}
                />
            </div>
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
