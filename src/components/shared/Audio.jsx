import React, { useRef, useEffect } from 'react';
import { useAudio } from '../../context/AudioContext';

const Audio = () => {
    const audioRef = useRef(null);
    const { audioFile } = useAudio();
    const audioPath = `../../audio/${audioFile}`;
    let timeout;
    const delaySeconds = 10;

    useEffect(() => {
        return () => {
            clearTimeout(timeout);
        };
    }, []);

    useEffect(() => {
        setDelay();
    }, [audioRef]);

    const setDelay = () => {
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
