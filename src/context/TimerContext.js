import React, { useState, createContext, useContext } from 'react';
import { useSession } from './SessionContext';
import { strings } from '../strings';
import { toast } from 'react-toastify';

const TimerContext = createContext();

const TimerProvider = (props) => {
    const [inProgress, setInProgress] = useState(false);
    const [initialSeconds, setInitialSeconds] = useState(0);
    const [countdown, setCountdown] = useState(0);
    const [userIsEditingTimer, setUserIsEditingTimer] = useState(false);
    const [usernameEditingTimer, setUsernameEditingTimer] = useState('');
    const { socket, sendMessage } = useSession();

    socket.on(strings.commands.timer.update, (update) => {
        setInProgress(update.inProgress);
        setCountdown(update.remainingSeconds);
        setInitialSeconds(update.initialSeconds);
        setUserIsEditingTimer(update.isEditing);
        setUsernameEditingTimer(update.isEditingUsername);
    });

    const updateCountdown = (newCountdown) => {
        setInitialSeconds(newCountdown);
        setCountdown(newCountdown);
        sendMessage(strings.commands.timer.set, { initialSeconds: newCountdown });
    };

    const incrementCountdown = () => {
        const newCountdown = countdown + 60;
        updateCountdown(newCountdown);
    };

    const decrementCountdown = () => {
        const newCountdown = countdown - 60;
        if (newCountdown <= 0) return;
        updateCountdown(newCountdown);
    };

    const start = () => sendMessage(strings.commands.timer.start);

    const stop = () => sendMessage(strings.commands.timer.stop);

    const reset = () => sendMessage(strings.commands.timer.reset);

    const startModifyingTime = (username) =>
        sendMessage(strings.commands.timer.startModify, { username });

    const stopModifyingTime = () => sendMessage(strings.commands.timer.stopModify);

    const isReset = () => !inProgress && !hasElapsed();

    const isStopped = () => !inProgress && countdown > 0;

    const hasElapsed = () => countdown !== initialSeconds;

    const hasEnded = () => countdown === 0;

    const startTimer = () => {
        if (userIsEditingTimer) {
            toast.error(`Timer is being modified by ${usernameEditingTimer}`);
            return;
        }

        start();
    };

    return (
        <TimerContext.Provider
            value={{
                stop,
                reset,
                startModifyingTime,
                stopModifyingTime,
                inProgress,
                countdown,
                setCountdown,
                usernameEditingTimer,
                startTimer,
                isReset,
                isStopped,
                hasElapsed,
                hasEnded,
                incrementCountdown,
                decrementCountdown,
            }}>
            {props.children}
        </TimerContext.Provider>
    );
};

const useTimer = () => {
    return useContext(TimerContext);
};

export { useTimer, TimerProvider };
