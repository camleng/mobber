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
    ];
    const [options, setOptions] = useState(initialOptions);
    const [audioFile, setAudioFile] = useStorage(
        strings.storageKeys.audioFile,
        initialOptions[0].file
    );
    const initialSelectedOption = options.find((opt) => opt.file === audioFile);
    const [currentlySelectedOption, setCurrentlySelectedOption] = useState(
        initialSelectedOption
    );
    const [previousSelectedOption, setPreviousSelectedOption] = useState(
        initialSelectedOption
    );

    const selectOption = (selectionPredicate) => {
        let _options = [...options].map((opt) => ({ ...opt, selected: false }));
        let optionIndex = _options.findIndex(selectionPredicate);
        if (optionIndex !== -1) _options[optionIndex].selected = true;
        setOptions(_options);
    };

    const resetOption = () => {
        console.log('Resetting to ', previousSelectedOption.file);
        selectOption((opt) => opt.file === previousSelectedOption.file);
    };

    useEffect(() => {
        if (currentlySelectedOption) {
            selectOption((opt) => opt.file === currentlySelectedOption.file);
        }
    }, [currentlySelectedOption]);

    useEffect(() => {
        setPreviousSelectedOption(currentlySelectedOption);
    }, [audioFile]);

    return (
        <AudioContext.Provider
            value={{
                audioFile,
                options,
                resetOption,
                setAudioFile,
                currentlySelectedOption,
                setCurrentlySelectedOption,
                setPreviousSelectedOption,
            }}>
            {props.children}
        </AudioContext.Provider>
    );
};

const useAudio = () => useContext(AudioContext);

export { useAudio, AudioProvider };
