import React, { useCallback } from 'react';
import Stepper from './shared/Stepper';
import './ChangeTimer.scss';

const ChangeTimer = ({ initialNumber, timerControlsAreHidden = false, callback }) => {
    return (
        <>
            {timerControlsAreHidden && (
                <p className='note'>Reset timer to make changes</p>
            )}
            <div hidden={timerControlsAreHidden}>
                <div className='mob-length'>Mob Length</div>
                <Stepper
                    initialNumber={initialNumber}
                    minimum={1}
                    onChange={callback}
                    unit={'min'}
                />
            </div>
        </>
    );
};

export default ChangeTimer;
