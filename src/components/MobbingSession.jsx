import React, { useState, useEffect } from 'react';
import Countdown from './Countdown';
import Mobbers from './Mobbers';
import RoundedRect from './shared/RoundedRect';
import CurrentMobbers from './CurrentMobbers';
import Randomize from './Randomize';
import Clipboard from './Clipboard';
import { hasEnoughMobbers } from '../services/mobberCountChecker';
import { toast } from 'react-toastify';
import { useMobbers } from '../context/MobbersContext';
import { useSession } from '../context/SessionContext';
import { useHistory } from 'react-router-dom';
import { formatTime } from '../services/timeFormatter';
import './MobbingSession.scss';

const MobbingSession = () => {
    const [initialSeconds, setInitialSeconds] = useState(0);
    const [countdown, setCountdown] = useState();
    const [inProgress, setInProgress] = useState();
    const { mobbers, driver, changeRoles } = useMobbers();
    const { socket, sessionId } = useSession();
    const [activating, setActivating] = useState(true);
    const history = useHistory();

    useEffect(() => {
        checkIfActive();
    }, []);

    const checkIfActive = async () => {
        const res = await fetch(`/session/${sessionId}/is-active`);
        const data = await res.json();

        if (data.isActive) {
            connect();
            setActivating(false);
        } else {
            toast.error(`Session "${sessionId}" is not active`);
            history.push('/');
        }
    };

    useEffect(() => {
        let title = `Mobber - ${formatTime(countdown)}`;
        if (driver) title += ` | ${driver.name}`;
        document.title = title;
    }, [countdown]);

    socket.on('TIMER:UPDATE', (update) => {
        setInProgress(update.inProgress);
        setCountdown(update.remainingSeconds);
        setInitialSeconds(update.initialSeconds);
    });

    const sendMessage = (event, payload) => {
        payload = payload || {};
        payload.sessionId = sessionId;
        socket.emit(event, payload);
    };

    const start = () => {
        if (hasEnoughMobbers(mobbers)) sendMessage('TIMER:START');
    };

    const stop = () => {
        const event = 'TIMER:STOP';
        sendMessage(event);
    };

    const reset = () => {
        const event = 'TIMER:RESET';
        sendMessage(event);
    };

    const connect = () => {
        const event = 'SESSION:CONNECT';
        sendMessage(event);
    };

    const randomizeMobbers = () => {
        const event = 'MOBBERS:RANDOMIZE';
        sendMessage(event);
    };

    return activating ? (
        <h1>Activating</h1>
    ) : (
        <>
            {mobbers.length >= 2 && <Randomize randomize={randomizeMobbers} />}
            <Clipboard />
            <div className='countdown-and-controls'>
                <Countdown countdown={countdown} inProgress={inProgress} />

                <div className='buttons'>
                    {!inProgress && countdown > 0 && (
                        <RoundedRect title='Start' className='start' onClick={start} />
                    )}
                    {inProgress && (
                        <RoundedRect title='Stop' className='stop' onClick={stop} />
                    )}
                    {!inProgress && countdown !== initialSeconds && (
                        <RoundedRect title='Reset' className='reset' onClick={reset} />
                    )}
                    {!inProgress && countdown === initialSeconds && (
                        <RoundedRect
                            title='Next'
                            className='next'
                            onClick={changeRoles}
                        />
                    )}
                </div>
            </div>

            <CurrentMobbers />
            <Mobbers />
        </>
    );
};

export default MobbingSession;
