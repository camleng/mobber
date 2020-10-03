import React, { useState } from 'react';
import RoundedRect from './shared/RoundedRect';
import { strings } from '../strings';
import { toast } from 'react-toastify';
import { useMobbers } from '../context/MobbersContext';
import './NameEntry.scss';

const NameEntry = ({ name, submitNameChange }: Props) => {
    const [enteredName, setEnteredName] = useState(name);
    const { mobbers } = useMobbers();

    const submitName = () => {
        const trimmedName = enteredName.trim();
        if (trimmedName.length > 50) {
            toast.error(strings.errors.nameLength);
            return;
        }
        if (isUnique(trimmedName)) {
            toast.error(strings.errors.duplicateMobberName);
            return;
        }

        submitNameChange(enteredName.trim());
    };

    const isUnique = (newName: string) => {
        return name !== newName && mobbers.map((m) => m.name).includes(newName);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

type Props = {
    name: string,
    submitNameChange: (newName: string) => void
}