import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Audio from './shared/Audio';
import RoundedRect from './shared/RoundedRect';
import { useAudio } from '../context/AudioContext';
import { strings } from '../strings';
import './AudioSelection.scss';

const AudioSelection = () => {
    const { audioFile, options, setAudioFile } = useAudio();
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
        setAudioFile(option.file);
    };

    const previewNotificationSound = () => {
        setPreviewAudioFile(true);
    };

    const jsx = (
        <div className='popover audio-selection-container'>
            {options.map((option) => (
                <div
                    className={`audio-option ${option.selected ? 'selected' : ''}`}
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
            {previewAudioFile && <Audio />}
        </>
    );
};

export default AudioSelection;
