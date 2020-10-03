import React, { useRef, useEffect } from 'react';
import { useAudio } from '../../context/AudioContext';

const Audio = ({ previewAudioFile }: Props) => {
    const audioRef = useRef(null);
    const { audioFile, isMuted } = useAudio();
    const audioPath = `../../audio/${previewAudioFile ? previewAudioFile : audioFile}`;
    let timeout: NodeJS.Timeout;
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
        if (audioRef !== null && audioRef.current === null) return;
        audioRef.current.onended = () => {
            timeout = setTimeout(() => {
                audioRef.current.play();
                clearTimeout(timeout);
            }, delaySeconds * 1000);
        };
    };

    return audioFile && !isMuted ? (
        <audio src={audioPath} ref={audioRef} autoPlay></audio>
    ) : (
        <></>
    );
};

export default Audio;

type Props = {
    previewAudioFile?: string
}
