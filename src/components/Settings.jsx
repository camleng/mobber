import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popover from './shared/Popover';
import ChangeTimer from './ChangeTimer';
import RoundedRect from './shared/RoundedRect';
import AudioSelection from './AudioSelection';
import { useTimer } from '../context/TimerContext';
import { useAudio } from '../context/AudioContext';
import './Settings.scss';

const Settings = ({ position, isReset }) => {
    const { countdown, updateCountdown } = useTimer();
    const [newTimerLength, setNewTimerLength] = useState(countdown);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const { resetSelectedOption, setAudioFile, currentlySelectedOption } = useAudio();

    const save = () => {
        updateCountdown(newTimerLength * 60);
        setAudioFile(currentlySelectedOption.file);
        setIsPopoverOpen(false);
    };

    const cancel = () => {
        resetSelectedOption();
        setIsPopoverOpen(false);
    };

    const jsx = (
        <div className='popover settings'>
            <div className='settings-sections'>
                <div className='settings-section timer-section'>
                    <div className='setting-heading'>Timer</div>
                    <div className='setting-body'>
                        <ChangeTimer
                            initialNumber={Math.floor(countdown / 60)}
                            timerControlsAreHidden={!isReset()}
                            callback={setNewTimerLength}
                        />
                    </div>
                </div>
                <div className='settings-section'>
                    <div className='setting-heading'>Notification Sound</div>
                    <div className='setting-body'>
                        <AudioSelection />
                    </div>
                </div>
            </div>

            <div className='settings-buttons'>
                <RoundedRect className='cancel' onClick={cancel}>
                    Cancel
                </RoundedRect>

                <RoundedRect className='save' onClick={save}>
                    Save
                </RoundedRect>
            </div>
        </div>
    );

    return (
        <Popover
            jsx={jsx}
            position={position}
            isPopoverOpen={isPopoverOpen}
            setIsPopoverOpen={setIsPopoverOpen}
            closeOnClickOutside={false}
            render={() => (
                <FontAwesomeIcon
                    icon='sliders-h'
                    title='Settings'
                    onClick={() => setIsPopoverOpen(true)}
                />
            )}
        />
    );
};

export default Settings;
