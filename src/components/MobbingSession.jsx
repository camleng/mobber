import React, { useState, useEffect } from 'react';
import Countdown from './Countdown';
import Mobbers from './Mobbers';
import RoundedRect from './shared/RoundedRect';
import CurrentMobbers from './CurrentMobbers';
import Randomize from './Randomize';
import Clipboard from './Clipboard';
import Audio from './shared/Audio';
import AudioSelection from './AudioSelection';
import Menu from './Menu';
import NameEntry from './NameEntry';
import ChangeTimer from './ChangeTimer';
import { toast } from 'react-toastify';
import { useMobbers } from '../context/MobbersContext';
import { useSession } from '../context/SessionContext';
import { useHistory } from 'react-router-dom';
import { formatTime } from '../services/timeFormatter';
import { DragDropContext } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    determineScreenSizeCategory,
    addWindowResizeCallback,
} from '../services/screenSize';
import useStorage from '../hooks/useStorage';
import { strings } from '../strings';
import './MobbingSession.scss';
import { useTimer } from '../context/TimerContext';

const MobbingSession = () => {
    const { mobbers, driver, changeRoles } = useMobbers();
    const {
        sessionId,
        connect,
        randomizeMobbers,
        reassignMobbers,
        changeName,
    } = useSession();
    const {
        stop,
        reset,
        startModifyingTime,
        stopModifyingTime,
        inProgress,
        countdown,
        usernameEditingTimer,
        startTimer,
        isReset,
        isStopped,
        hasElapsed,
        hasEnded,
        incrementCountdown,
        decrementCountdown,
    } = useTimer();
    const [activating, setActivating] = useState(true);
    const history = useHistory();
    const [editing, setEditing] = useState(false);
    const category = determineScreenSizeCategory();
    const [isTablet, setIsTablet] = useState(category === 'tablet');
    const [name, setName] = useStorage(strings.storageKeys.mobberNameKey, '');
    const [isEditingName, setIsEditingName] = useState(false);

    useEffect(() => {
        connectToSessionIfActive();

        addWindowResizeCallback((category) => {
            setIsTablet(category === 'tablet');
        });
    }, []);

    const connectToSessionIfActive = async () => {
        const res = await fetch(`/session/${sessionId}/is-active`);
        const data = await res.json();

        if (data.isActive) {
            connect();
            setActivating(false);
        } else {
            toast.error(`Mob "${sessionId}" is not active`);
            history.push('/');
        }
    };

    useEffect(() => {
        let title = `Mobber - ${formatTime(countdown)}`;
        if (driver) title += ` | ${driver.name}`;
        document.title = title;
    }, [countdown]);

    const placeMobberInDroppedPosition = (result) => {
        const { destination, source } = result;

        if (!destination || destination.index === source.index) return;

        const _mobbers = [...mobbers];
        const movedMobber = _mobbers.splice(source.index, 1)[0];

        _mobbers.splice(destination.index, 0, movedMobber);

        reassignMobbers(_mobbers);
    };

    const hasName = () => {
        return name.trim() !== '' && !isEditingName;
    };

    const submitNameChange = (newName) => {
        if (name !== newName) {
            changeName(name, newName);
            setName(newName);
        }
        setIsEditingName(false);
    };

    const toggleEditing = () => {
        if (editing) stopModifyingTime();
        else startModifyingTime(name);
        setEditing(!editing);
    };

    const noop = () => {};

    const noOneIsEditingTheTimerOrCurrentUserIsEditingTheTimer = () => {
        return !usernameEditingTimer || usernameEditingTimer === name;
    };

    const getPopupPosition = () => (isTablet ? 'bottom' : 'left');

    return activating ? (
        <h1>Activating</h1>
    ) : !hasName() ? (
        <div>
            <NameEntry submitNameChange={submitNameChange} name={name} />
        </div>
    ) : (
        <>
            <Menu>
                {mobbers.length >= 2 && isReset() && (
                    <Randomize
                        randomize={randomizeMobbers}
                        position={getPopupPosition()}
                    />
                )}
                {isReset() && noOneIsEditingTheTimerOrCurrentUserIsEditingTheTimer() && (
                    <ChangeTimer
                        position={getPopupPosition()}
                        toggleEditing={toggleEditing}
                    />
                )}
                <AudioSelection position={getPopupPosition()} />
                <Clipboard position={getPopupPosition()} />
            </Menu>

            <div className='countdown-and-controls'>
                <Countdown countdown={countdown} inProgress={inProgress} />

                <div className='buttons'>
                    {editing && (
                        <RoundedRect className='start' onClick={incrementCountdown}>
                            <FontAwesomeIcon icon='chevron-up' />
                        </RoundedRect>
                    )}
                    {editing && (
                        <RoundedRect className='next' onClick={decrementCountdown}>
                            <FontAwesomeIcon icon='chevron-down' />
                        </RoundedRect>
                    )}
                    {!editing && isStopped() && (
                        <RoundedRect
                            title='Start'
                            className='start'
                            onClick={startTimer}
                        />
                    )}
                    {!editing && inProgress && (
                        <RoundedRect title='Stop' className='stop' onClick={stop} />
                    )}
                    {!editing && !inProgress && hasElapsed() && (
                        <RoundedRect title='Reset' className='reset' onClick={reset} />
                    )}
                    {!editing && isReset() && (
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
                <Mobbers name={name} setIsEditingName={setIsEditingName} />
            </DragDropContext>

            {!inProgress && countdown <= 0 && <Audio />}
        </>
    );
};

export default MobbingSession;
