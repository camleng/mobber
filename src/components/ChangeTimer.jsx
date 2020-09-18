import React, { useCallback } from 'react';
import Stepper from './shared/Stepper';
import './ChangeTimer.scss';

const ChangeTimer = ({ initialNumber, disabled = false, callback }) => {
    return (
        <>
            {disabled && <p className='note'>Reset timer to make changes</p>}
            <div className={disabled ? 'disabled' : ''}>
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
