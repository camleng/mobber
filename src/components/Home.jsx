import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import RoundedRect from './shared/RoundedRect';
import { strings } from '../strings';
import useStorage from '../hooks/useStorage';
import { useMob } from '../context/MobContext';
import NameEntry from './NameEntry';
import './Home.scss';
import { useMobbers } from '../context/MobbersContext';

const Home = () => {
    const [mobId, setMobId] = useState('');
    const [id, setId] = useStorage('mobber:id');
    const [name, setName] = useState();
    const [isEditingName, setIsEditingName] = useState(false);
    const history = useHistory();
    const { socket } = useMob();
    const { createMobber } = useMobbers();

    socket.on(strings.commands.mobbers.creation, (mobber) => {
        console.log('Got name update', JSON.stringify(mobber));
        setId(mobber.id);
        setName(mobber.name);
    });

    const activateRandomMob = async () => {
        if (name === undefined) {
            setIsEditingName(true);
            return;
        }
        const res = await fetch('/mob/generate');
        const { mobId } = await res.json();
        history.push(`/mob/${mobId}`);
    };

    const joinMob = () => {
        history.push(`/mob/${mobId}`);
    };

    const handleKeyPress = (e) => {
        if (e.key === strings.keyboardKeys.enter && mobId.length === 6) joinMob();
    };

    const handleNameChange = async (newName) => {
        createMobber(newName);
        console.log();
        setIsEditingName(false);
        await activateRandomMob();
    };

    return (
        <>
            {!isEditingName && (
                <>
                    <ul className='skip-links'>
                        <li>
                            <a href='#main-content'>Skip to main content</a>
                        </li>
                    </ul>
                    <div className='container' id='main-content'>
                        <div className='join-mob'>
                            <label>Join a mob</label>
                            <div>
                                <input
                                    placeholder='Mob ID'
                                    onChange={(e) => setMobId(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    value={mobId}
                                    title='Mob ID'
                                    maxLength={6}></input>
                                <RoundedRect
                                    title='Join'
                                    className='join'
                                    onClick={joinMob}
                                />
                            </div>
                        </div>
                        <div className='separators'>
                            <div className='sep'></div>
                            <div className='or'>or</div>
                            <div className='sep'></div>
                        </div>
                        <div className='create-mob'>
                            <label>Create a mob</label>
                            <div>
                                <RoundedRect
                                    title='Create'
                                    className='create'
                                    onClick={async () => await activateRandomMob()}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='placeholder'></div>
                </>
            )}
            {isEditingName && (
                <NameEntry
                    submitNameChange={async (newName) => await handleNameChange(newName)}
                />
            )}
        </>
    );
};

export default Home;
