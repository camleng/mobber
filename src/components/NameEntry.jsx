import React, { useState } from 'react';
import RoundedRect from './shared/RoundedRect';
import { strings } from '../strings';
import './NameEntry.scss';
import { toast } from 'react-toastify';

const NameEntry = ({ name, submitNameChange }) => {
    const [enteredName, setEnteredName] = useState(name);

    const submitName = () => {
        const trimmedName = enteredName.trim();
        if (trimmedName.length > 50) {
            toast.error('Please enter a name that is less than 50 characters')
            return;
        }
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
