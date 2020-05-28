import React, { useState, createContext, useContext, useEffect } from 'react';
import useStorage from '../hooks/useStorage';

const AudioContext = createContext();

const AudioProvider = (props) => {
    const [audioFile, setAudioFile] = useStorage('audioFile', 'your-turn.mp3');
    const [options, setOptions] = useState([
        { name: 'Your Turn', file: 'your-turn.mp3', selected: false },
        { name: "Time's up", file: 'times-up.m4a', selected: false },
    ]);

    useEffect(() => {
        setOption((opt) => opt.file === audioFile, true);
    }, []);

    const setOption = (predicate, value) => {
        let _options = [...options];

        let optionIndex = _options.findIndex(predicate);
        _options[optionIndex].selected = value;
    };

    const makeSelection = (option) => {
        let _options = [...options];

        setOption((opt) => opt.selected === true, false);
        setOption((opt) => opt === option, true);

        setOptions(_options);
        setAudioFile(option.file);
    };

    return (
        <AudioContext.Provider value={{ audioFile, options, makeSelection }}>
            {props.children}
        </AudioContext.Provider>
    );
};

const useAudio = () => {
    return useContext(AudioContext);
};

export { useAudio, AudioProvider };
