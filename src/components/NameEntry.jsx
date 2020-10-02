import React, { useState } from 'react';
import RoundedRect from './shared/RoundedRect';
import { strings } from '../strings';
import { toast } from 'react-toastify';
import { useMob } from '../context/MobContext';
import duplicateNameChecker from '../services/duplicateNameChecker';
import './NameEntry.scss';

const NameEntry = ({ name, callback }) => {
    const [enteredName, setEnteredName] = useState(name || '');
    const { mobId } = useMob();

    const submitName = async () => {
        const trimmedName = enteredName.trim();
        if (trimmedName.length > 50) {
            toast.error(strings.errors.nameLength);
            return;
        }

        if (await duplicateNameChecker.nameAlreadyExistsInMob(trimmedName, mobId)) {
            toast.error(strings.errors.duplicateMobberName);
            return;
        }

        console.log('All good here for the name!');

        callback(enteredName.trim());
    };

    // const isUnique = (newName) => {
    //     return name !== newName && mobbers.map((m) => m.name).includes(newName);
    // };

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
            <RoundedRect onClick={submitName} title='Save' className='save' />
        </div>
    );
};

export default NameEntry;
