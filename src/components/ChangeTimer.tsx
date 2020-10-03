import React from 'react';
import Stepper from './shared/Stepper';
import './ChangeTimer.scss';

const ChangeTimer = ({ initialNumber, hideTimerControls = false, callback }: Props) => {
    return (
        <>
            {hideTimerControls && (
                <p className='note'>Reset timer to make changes</p>
            )}
            <div hidden={hideTimerControls}>
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

type Props = {
    initialNumber: number,
    hideTimerControls: boolean,
    callback?: (event: any) => void
}