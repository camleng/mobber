import React, { useState } from 'react';
import RoundedRect from './shared/RoundedRect';
import './NameEntry.scss';

const NameEntry = ({ setName }) => {
    const [enteredName, setEnteredName] = useState('');

    const submitName = () => {
        setName(enteredName.trim());
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') submitName();
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
