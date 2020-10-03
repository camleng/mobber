import React, { useState, createContext, useContext, useEffect } from 'react';
import useStorage from '../hooks/useStorage';
import { AudioNotificationOption } from '../models/AudioNotificationOption';
import { strings } from '../strings';

const AudioContext = createContext<AudioContextValue>({} as AudioContextValue);

const AudioProvider = (props: Props) => {
    const initialOptions: AudioNotificationOption[] = [
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
    const [isMuted, setIsMuted] = useState(false);

    const selectOption = (selectionPredicate: (option: AudioNotificationOption) => boolean) => {
        let _options: AudioNotificationOption[] = [...options].map((opt) => ({ ...opt, selected: false }));
        let optionIndex = _options.findIndex(selectionPredicate);
        if (optionIndex !== -1) _options[optionIndex].selected = true;
        setOptions(_options);
    };

    const resetSelectedOption = () => {
        if (previousSelectedOption)
            selectOption((opt: AudioNotificationOption) => opt.file === previousSelectedOption.file);
    };

    useEffect(() => {
        if (currentlySelectedOption) {
            selectOption((opt: AudioNotificationOption) => opt.file === currentlySelectedOption.file);
        }
    }, [currentlySelectedOption]);

    useEffect(() => {
        setPreviousSelectedOption(currentlySelectedOption);
    }, [audioFile]);

    const mute = () => setIsMuted(true);
    const unmute = () => setIsMuted(false);

    return (
        <AudioContext.Provider
            value={{
                audioFile,
                options,
                resetSelectedOption,
                setAudioFile,
                isMuted,
                mute,
                unmute,
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

export type AudioContextValue = {
    audioFile: string,
    options: AudioNotificationOption[],
    resetSelectedOption: () => void,
    setAudioFile: (value: string) => void,
    isMuted: boolean,
    mute: () => void,
    unmute: () => void,
    currentlySelectedOption: AudioNotificationOption | undefined,
    setCurrentlySelectedOption: React.Dispatch<React.SetStateAction<AudioNotificationOption | undefined>>
    setPreviousSelectedOption: React.Dispatch<React.SetStateAction<AudioNotificationOption | undefined>>
};

export type Props = {
    children: JSX.Element
}
