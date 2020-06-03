import React, { useState, useEffect } from 'react';
import Countdown from './Countdown';
import Mobbers from './Mobbers';
import RoundedRect from './shared/RoundedRect';
import CurrentMobbers from './CurrentMobbers';
import Randomize from './Randomize';
import Clipboard from './Clipboard';
import Audio from './shared/Audio';
import AudioSelection from './AudioSelection';
import { hasEnoughMobbers } from '../services/mobberCountChecker';
import { toast } from 'react-toastify';
import { useMobbers } from '../context/MobbersContext';
import { useSession } from '../context/SessionContext';
import { useHistory } from 'react-router-dom';
import { formatTime } from '../services/timeFormatter';
import { DragDropContext } from 'react-beautiful-dnd';
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
        if (!hasEnoughMobbers(mobbers)) return;
        const event = 'TIMER:START';
        sendMessage(event);
    };

    const stop = () => sendMessage('TIMER:STOP');

    const reset = () => sendMessage('TIMER:RESET');

    const connect = () => sendMessage('SESSION:CONNECT');

    const randomizeMobbers = () => sendMessage('MOBBERS:RANDOMIZE');

    const reassignMobbers = (mobbers) => sendMessage('MOBBERS:REASSIGN', { mobbers });

    const isReset = () => !inProgress && !hasElapsed();

    const isStopped = () => !inProgress && countdown > 0;

    const hasElapsed = () => countdown !== initialSeconds;

    const hasEnded = () => countdown === 0;

    const noop = () => {};

    const placeMobberInDroppedPosition = (result) => {
        const { destination, source } = result;

        if (!destination || destination.index === source.index) return;

        const _mobbers = [...mobbers];
        const movedMobber = _mobbers.splice(source.index, 1)[0];

        _mobbers.splice(destination.index, 0, movedMobber);

        reassignMobbers(_mobbers);
    };

    return activating ? (
        <h1>Activating</h1>
    ) : (
        <>
            <AudioSelection />

            {mobbers.length >= 2 && isReset() && (
                <Randomize randomize={randomizeMobbers} />
            )}

            <Clipboard />

            <div className='countdown-and-controls'>
                <Countdown countdown={countdown} inProgress={inProgress} />

                <div className='buttons'>
                    {isStopped() && (
                        <RoundedRect title='Start' className='start' onClick={start} />
                    )}
                    {inProgress && (
                        <RoundedRect title='Stop' className='stop' onClick={stop} />
                    )}
                    {!inProgress && hasElapsed() && (
                        <RoundedRect title='Reset' className='reset' onClick={reset} />
                    )}
                    {isReset() && (
                        <RoundedRect
                            title='Next'
                            className='next'
                            onClick={changeRoles}
                        />
                    )}
                </div>
            </div>

            <CurrentMobbers />

            <DragDropContext
                onDragEnd={isReset() || hasEnded() ? placeMobberInDroppedPosition : noop}>
                <Mobbers />
            </DragDropContext>
            {!inProgress && countdown <= 0 && <Audio />}
        </>
    );
};

export default MobbingSession;
