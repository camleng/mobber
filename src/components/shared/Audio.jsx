import React, { useRef, useEffect } from 'react';
import { useAudio } from '../../context/AudioContext';

const Audio = ({ previewAudioFile }) => {
    const audioRef = useRef(null);
    const { audioFile } = useAudio();
    const audioPath = `../../audio/${previewAudioFile ? previewAudioFile : audioFile}`;
    let timeout;
    const delaySeconds = 30;

    useEffect(() => {
        return () => {
            clearTimeout(timeout);
        };
    }, []);

    useEffect(() => {
        setDelay();
    }, [audioRef]);

    const setDelay = () => {
        if (!audioRef.current) return;
        audioRef.current.onended = () => {
            timeout = setTimeout(() => {
                audioRef.current.play();
                clearTimeout(timeout);
            }, delaySeconds * 1000);
        };
    };

    return audioFile ? <audio src={audioPath} ref={audioRef} autoPlay></audio> : <></>;
};

export default Audio;
