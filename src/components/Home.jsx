import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import RoundedRect from './shared/RoundedRect';
import { strings } from '../strings';
import './Home.scss';

const Home = () => {
    const [mobId, setMobId] = useState('');
    const history = useHistory();

    const activateRandomMob = () => {
        fetch('/mob/generate').then(async (res) => {
            const { mobId } = await res.json();
            history.push(`/mob/${mobId}`);
        });
    };

    const joinMob = () => {
        history.push(`/mob/${mobId}`);
    };

    const handleKeyPress = (e) => {
        if (e.key === strings.keyboardKeys.enter && mobId.length === 6) joinMob();
    };

    return (
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
                            title='Mob ID'></input>
                        <RoundedRect title='Join' className='join' onClick={joinMob} />
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
                            onClick={activateRandomMob}
                        />
                    </div>
                </div>
            </div>
            <div className='placeholder'></div>
        </>
    );
};

export default Home;
