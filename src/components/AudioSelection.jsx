import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Audio from './shared/Audio';
import RoundedRect from './shared/RoundedRect';
import { useAudio } from '../context/AudioContext';
import './AudioSelection.scss';

const AudioSelection = () => {
    const { options, setCurrentlySelectedOption, currentlySelectedOption } = useAudio();
    const [previewAudioFile, setPreviewAudioFile] = useState(false);
    const [previewIsEnabled, setPreviewIsEnabled] = useState(true);
    let timeout;

    useEffect(() => {
        if (previewAudioFile) {
            setPreviewIsEnabled(false);
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                setPreviewAudioFile(false);
                setPreviewIsEnabled(true);
            }, 1000);
        }
    }, [previewAudioFile]);

    const handleClick = (option) => {
        setCurrentlySelectedOption(option);
    };

    const previewNotificationSound = () => {
        setPreviewAudioFile(true);
    };

    return (
        <>
            <RoundedRect
                onClick={previewNotificationSound}
                className='preview'
                disabled={!previewIsEnabled}>
                <FontAwesomeIcon icon='play-circle' />
                Preview
            </RoundedRect>

            <div className='audio-selection-container'>
                {options.map((option) => (
                    <div
                        className={`audio-option ${option.selected ? 'selected' : ''}`}
                        onClick={() => handleClick(option)}
                        key={option.file}>
                        {option.name}
                    </div>
                ))}
            </div>

            {previewAudioFile && (
                <Audio previewAudioFile={currentlySelectedOption.file} />
            )}
        </>
    );
};

export default AudioSelection;
