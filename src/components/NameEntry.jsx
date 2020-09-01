import React from 'react';
import RoundedRect from './shared/RoundedRect';
import './NameEntry.scss';
import useStorage from '../hooks/useStorage';
import { strings } from '../strings';

const NameEntry = ({ submitNameChange }) => {
    const [enteredName, setEnteredName] = useStorage(
        strings.storageKeys.mobberNameKey,
        ''
    );

    const submitName = () => {
        submitNameChange(enteredName.trim());
    };

    const handleKeyPress = (e) => {
        if (e.key === strings.keyboardKeys.enter) submitName();
    };

    return (
        <div className='name-entry'>
            <label>What should we call you?</label>
            <input
                value={enteredName}
                onChange={(e) => setEnteredName(e.target.value)}
                onKeyPress={handleKeyPress}></input>
            <RoundedRect onClick={submitName} title='Enter' className='enter' />
        </div>
    );
};

export default NameEntry;
