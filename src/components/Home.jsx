import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import RoundedRect from './shared/RoundedRect';
import './Home.scss';

const Home = () => {
    const [sessionId, setSessionId] = useState('');
    const history = useHistory();

    const activateRandomSession = () => {
        fetch('/api/session/generate').then(async (res) => {
            const { sessionId } = await res.json();
            history.push(`/session/${sessionId}`);
        });
    };

    return (
        <>
            <div>
                <div className='connect-to-session'>
                    <label>Connect to an existing session</label>
                    <div>
                        <input
                            onChange={(e) => setSessionId(e.target.value)}
                            value={sessionId}></input>
                        <RoundedRect
                            title='Connect'
                            className='connect'
                            onClick={() => history.push(`/session/${sessionId}`)}
                        />
                    </div>
                </div>
                <p className='or'>or</p>
                <div className='create-session'>
                    <label>Create a new session</label>
                    <div>
                        <RoundedRect
                            title='Create'
                            className='create'
                            onClick={activateRandomSession}
                        />
                    </div>
                </div>
            </div>
            <div className='placeholder'></div>
        </>
    );
};

export default Home;
