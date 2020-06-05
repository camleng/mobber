import React from 'react';
import RoundedRect from './shared/RoundedRect';
import './NameEntry.scss';
import useStorage from '../hooks/useStorage';

const NameEntry = ({ setName }) => {
    const [enteredName, setEnteredName] = useStorage('mobber:name', '');

    const submitName = () => {
        setName(enteredName);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') submitName();
    };

    return (
        <div className='name-entry'>
            <label>What should we call you?</label>
            <input
                value={enteredName}
                onChange={(e) => setEnteredName(e.target.value.trim())}
                onKeyPress={handleKeyPress}></input>
            <RoundedRect onClick={submitName} title='Enter' className='enter' />
        </div>
    );
};

export default NameEntry;
