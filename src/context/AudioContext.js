import React, { useState, createContext, useContext, useEffect } from 'react';
import useStorage from '../hooks/useStorage';

const AudioContext = createContext();

const AudioProvider = (props) => {
    const initialOptions = [
        { name: 'Your Turn', file: 'your-turn.mp3', selected: false },
        { name: "Time's up", file: 'times-up.m4a', selected: false },
        { name: 'No sound', file: '', selected: false },
    ];
    const [options, setOptions] = useState(initialOptions);
    const [audioFile, setAudioFile] = useStorage('audioFile', initialOptions[0].file);

    const selectOption = (selectionPredicate) => {
        let _options = [...options].map((opt) => ({ ...opt, selected: false }));
        let optionIndex = _options.findIndex(selectionPredicate);
        if (optionIndex !== -1) _options[optionIndex].selected = true;
        setOptions(_options);
    };

    useEffect(() => {
        selectOption((opt) => opt.file === audioFile);
    }, [audioFile]);

    return (
        <AudioContext.Provider value={{ audioFile, options, setAudioFile }}>
            {props.children}
        </AudioContext.Provider>
    );
};

const useAudio = () => {
    return useContext(AudioContext);
};

export { useAudio, AudioProvider };
