import React from 'react';
import soundfile from '../../audio/your-turn.mp3';

const Audio = () => {
    return <audio src={soundfile} autoPlay />;
};

export default Audio;
