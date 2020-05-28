import React, { useState, createContext, useContext } from 'react';

const AudioContext = createContext();

const AudioProvider = (props) => {
    const [audioFile, setAudioFile] = useState('your-turn.mp3');
    const [options, setOptions] = useState([
        { name: 'Your Turn', file: 'your-turn.mp3', selected: true },
        { name: "Time's up", file: 'times-up.m4a', selected: false },
    ]);

    const makeSelection = (option) => {
        let _options = [...options];

        let oldOptionIndex = _options.findIndex((opt) => opt.selected);
        _options[oldOptionIndex].selected = false;

        let optionIndex = _options.findIndex((opt) => opt === option);
        _options[optionIndex].selected = true;

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
