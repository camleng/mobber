import React, { useEffect } from 'react';
import RoundedRect from './shared/RoundedRect';
import useStorage from '../hooks/useStorage';
import { strings } from '../strings';
import './NameEntry.scss';

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
                data-private
                value={enteredName}
                onChange={(e) => setEnteredName(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus></input>
            <RoundedRect onClick={submitName} title='Enter' className='enter' />
        </div>
    );
};

export default NameEntry;
