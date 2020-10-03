import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Audio from './shared/Audio';
import RoundedRect from './shared/RoundedRect';
import { useAudio } from '../context/AudioContext';
import './AudioSelection.scss';
import { AudioNotificationOption } from '../models/AudioNotificationOption';

const AudioSelection = () => {
    const { options, setCurrentlySelectedOption } = useAudio();
    const [isPreviewingAudioFile, setIsPreviewingAudioFile] = useState(false);
    const [previewButtonIsEnabled, setPreviewButtonIsEnabled] = useState(true);
    const [previewAudioFile, setPreviewAudioFile] = useState('')
    let timeout: NodeJS.Timeout;

    useEffect(() => {
        if (isPreviewingAudioFile) {
            setPreviewButtonIsEnabled(false);
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                setIsPreviewingAudioFile(false);
                setPreviewButtonIsEnabled(true);
            }, 1000);
        }
    }, [isPreviewingAudioFile]);

    const handleClick = (option: AudioNotificationOption) => {
        setPreviewAudioFile(option.file);
        setCurrentlySelectedOption(option);
    };

    const previewNotificationSound = () => {
        setIsPreviewingAudioFile(true);
    };

    return (
        <>
            <RoundedRect
                onClick={previewNotificationSound}
                className='preview'
                disabled={!previewButtonIsEnabled}>
                <>
                    <FontAwesomeIcon icon='play-circle' />
                    Preview
                </>
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

            {isPreviewingAudioFile && <Audio previewAudioFile={previewAudioFile} />}
        </>
    );
};

export default AudioSelection;
