import React from 'react';
import { useAudio } from '../../context/AudioContext';

const Audio = () => {
    const { audioFile } = useAudio();
    const audioPath = `../../audio/${audioFile}`;

    return <audio src={audioPath} autoPlay></audio>;
};

export default Audio;
