import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAudio } from '../context/AudioContext';
import './Volume.scss';

const Volume = () => {
    const [isMuted, setIsMuted] = useState(false);
    const { mute, unmute } = useAudio();

    useEffect(() => {
        if (isMuted) mute();
        else unmute();
    }, [isMuted]);

    const toggleMute = () => setIsMuted(!isMuted);
    return (
        <div onClick={toggleMute} className='volume'>
            {isMuted && <FontAwesomeIcon icon='volume-mute' title='Muted' />}
            {!isMuted && <FontAwesomeIcon icon='volume-up' title='Unmuted' />}
        </div>
    );
};

export default Volume;
