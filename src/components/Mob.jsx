import React, { useState, useEffect, useCallback } from 'react';
import Countdown from './Countdown';
import Mobbers from './Mobbers';
import RoundedRect from './shared/RoundedRect';
import CurrentMobbers from './CurrentMobbers';
import Randomize from './Randomize';
import Volume from './Volume';
import Clipboard from './Clipboard';
import Audio from './shared/Audio';
import Menu from './Menu';
import NameEntry from './NameEntry';
import Settings from './Settings';
import { toast } from 'react-toastify';
import { useMobbers } from '../context/MobbersContext';
import { useMob } from '../context/MobContext';
import { useHistory } from 'react-router-dom';
import { formatTime } from '../services/timeFormatter';
import { DragDropContext } from 'react-beautiful-dnd';
import {
    determineScreenSizeCategory,
    addWindowResizeCallback,
} from '../services/screenSize';
import useStorage from '../hooks/useStorage';
import { strings } from '../strings';
import { useTimer } from '../context/TimerContext';
import './Mob.scss';

const Mob = () => {
    const { mobbers, driver, changeRoles } = useMobbers();
    const { mobId, connect, randomizeMobbers, reassignMobbers, changeName } = useMob();
    const {
        stop,
        reset,
        inProgress,
        countdown,
        startTimer,
        isReset,
        isStopped,
        hasElapsed,
        hasEnded,
    } = useTimer();
    const [activating, setActivating] = useState(true);
    const history = useHistory();
    const category = determineScreenSizeCategory();
    const [isTablet, setIsTablet] = useState(category === 'tablet');
    const [name, setName] = useStorage(strings.storageKeys.mobberNameKey, '');
    const [isEditingName, setIsEditingName] = useState(false);

    const connectToMobIfActive = useCallback(async () => {
        const res = await fetch(`/mob/${mobId}/is-active`);
        const data = await res.json();

        if (data.isActive) {
            connect();
            setActivating(false);
        } else {
            toast.error(`Mob "${mobId}" is not active`);
            history.push('/');
        }
    }, [connect, history, mobId]);

    useEffect(() => {
        connectToMobIfActive();

        addWindowResizeCallback((category) => {
            setIsTablet(category === 'tablet');
        });
    }, [connectToMobIfActive]);

    useEffect(() => {
        if (name.length > 50) {
            toast.error(strings.errors.nameLength);
            setIsEditingName(true);
        }
    }, [name.length]);

    useEffect(() => {
        let title = `Mobber - ${formatTime(countdown)}`;
        if (driver) title += ` | ${driver.name}`;
        document.title = title;

        return () => {
            document.title = strings.title;
        };
    }, [countdown, driver]);

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

    const noop = () => {};

    const getPopupPosition = () => (isTablet ? 'bottom' : 'left');

    return activating ? (
        <h1>Activating</h1>
    ) : !hasName() ? (
        <div>
            <NameEntry name={name} submitNameChange={submitNameChange} />
        </div>
    ) : (
        <>
            <Menu>
                <Randomize
                    randomize={randomizeMobbers}
                    position={getPopupPosition()}
                    disabled={mobbers.length < 2 || !isReset()}
                />
                <Volume />
                <Clipboard position={getPopupPosition()} />
                <Settings position={getPopupPosition()} isReset={isReset} />
            </Menu>

            <div className='countdown-and-controls'>
                <Countdown countdown={countdown} inProgress={inProgress} />

                <div className='buttons'>
                    {isStopped() && (
                        <RoundedRect
                            title='Start'
                            className='start'
                            onClick={startTimer}
                        />
                    )}

                    {isReset() && mobbers.length > 1 && (
                        <RoundedRect
                            title='Next'
                            className='next'
                            onClick={changeRoles}
                        />
                    )}

                    {inProgress && (
                        <RoundedRect title='Stop' className='stop' onClick={stop} />
                    )}

                    {!inProgress && hasElapsed() && (
                        <RoundedRect title='Reset' className='reset' onClick={reset} />
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

export default Mob;
