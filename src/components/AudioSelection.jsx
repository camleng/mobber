import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popover from './shared/Popover';
import Audio from './shared/Audio';
import { useAudio } from '../context/AudioContext';
import { strings } from '../strings';
import './AudioSelection.scss';

const AudioSelection = ({ position = 'bottom' }) => {
    const { audioFile, options, setAudioFile } = useAudio();
    const [previewAudioFile, setPreviewAudioFile] = useState(false);
    let timeout;

    useEffect(() => {
        if (previewAudioFile) {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                setPreviewAudioFile(false);
            }, 1000);
        }
    }, [previewAudioFile]);

    const handleClick = (option) => {
        setAudioFile(option.file);
        setPreviewAudioFile(true);
    };

    const jsx = (
        <div className='popover audio-selection-container'>
            {options.map((option) => (
                <div
                    className={`audio-option ${option.selected ? 'selected' : ''}`}
                    onClick={() => handleClick(option)}
                    key={option.file}>
                    {option.name}
                </div>
            ))}
        </div>
    );

    const getIconName = () => {
        return audioFile === strings.audioFiles.noSound.file
            ? 'volume-mute'
            : 'volume-up';
    };

    return (
        <>
            <Popover
                jsx={jsx}
                className='audio-selection'
                position={position}
                render={() => (
                    <FontAwesomeIcon
                        icon={getIconName()}
                        title='Select notification sound'
                    />
                )}
            />
            {previewAudioFile && <Audio />}
        </>
    );
};

export default AudioSelection;
