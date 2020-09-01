import React, { useState, createContext, useContext, useEffect } from 'react';
import useStorage from '../hooks/useStorage';
import { strings } from '../strings';

const AudioContext = createContext();

const AudioProvider = (props) => {
    const initialOptions = [
        {
            name: strings.audioFiles.yourTurn.name,
            file: strings.audioFiles.yourTurn.file,
            selected: false,
        },
        {
            name: strings.audioFiles.timesUp.name,
            file: strings.audioFiles.timesUp.file,
            selected: false,
        },
        {
            name: strings.audioFiles.noSound.name,
            file: strings.audioFiles.noSound.file,
            selected: false,
        },
    ];
    const [options, setOptions] = useState(initialOptions);
    const [audioFile, setAudioFile] = useStorage(
        strings.storageKeys.audioFile,
        initialOptions[0].file
    );

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

const useAudio = () => useContext(AudioContext);

export { useAudio, AudioProvider };
