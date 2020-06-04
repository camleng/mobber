import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popover from './shared/Popover';
import { useAudio } from '../context/AudioContext';
import './AudioSelection.scss';

const AudioSelection = ({ position = 'bottom' }) => {
    const { options, setAudioFile } = useAudio();

    const jsx = (
        <div className='popover audio-selection-container'>
            {options.map((option) => (
                <div
                    className={`audio-option ${option.selected ? 'selected' : ''}`}
                    onClick={() => setAudioFile(option.file)}
                    key={option.file}>
                    {option.name}
                </div>
            ))}
        </div>
    );

    return (
        <Popover
            jsx={jsx}
            className='audio-selection'
            position={position}
            render={() => <FontAwesomeIcon icon='volume-up' />}
        />
    );
};

export default AudioSelection;
