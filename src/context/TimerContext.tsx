import React, { useState, createContext, useContext, useCallback } from 'react';
import { useMob } from './MobContext';
import { strings } from '../strings';
import { toast } from 'react-toastify';
import { TimerUpdate } from '../models/TimerUpdate';

const TimerContext = createContext<TimerContextValue>({} as TimerContextValue);

const TimerProvider = (props: Props) => {
    const [inProgress, setInProgress] = useState(false);
    const [initialSeconds, setInitialSeconds] = useState(0);
    const [countdown, setCountdown] = useState(0);
    const [userIsEditingTimer, setUserIsEditingTimer] = useState(false);
    const [usernameEditingTimer, setUsernameEditingTimer] = useState('');
    const { socket, sendMessage } = useMob();

    socket.on(strings.commands.timer.update, (update: TimerUpdate) => {
        setInProgress(update.inProgress);
        setCountdown(update.remainingSeconds);
        setInitialSeconds(update.initialSeconds);
        setUserIsEditingTimer(update.isEditing);
        setUsernameEditingTimer(update.isEditingUsername);
    });

    const updateCountdown = useCallback(
        (newCountdown: number) => {
            if (newCountdown <= 0) return;
            setInitialSeconds(newCountdown);
            setCountdown(newCountdown);
            sendMessage(strings.commands.timer.set, { initialSeconds: newCountdown });
        },
        [sendMessage]
    );

    const start = () => sendMessage(strings.commands.timer.start);

    const stop = () => sendMessage(strings.commands.timer.stop);

    const reset = () => sendMessage(strings.commands.timer.reset);

    const startModifyingTime = (username: string) =>
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
                usernameEditingTimer,
                startTimer,
                isReset,
                isStopped,
                hasElapsed,
                hasEnded,
                updateCountdown,
            }}>
            {props.children}
        </TimerContext.Provider>
    );
};

const useTimer = () => {
    return useContext(TimerContext);
};

export { useTimer, TimerProvider };

export type TimerContextValue = {
    startTimer: () => void,
    stop: () => void,
    reset: () => void,
    startModifyingTime: (username: string) => void,
    stopModifyingTime: () => void,
    inProgress: boolean,
    countdown: number,
    usernameEditingTimer: string,
    isReset: () => boolean,
    isStopped: () => boolean,
    hasElapsed: () => boolean,
    hasEnded: () => boolean,
    updateCountdown: (newCountdown: number) => void,
}

export type Props = {
    children: JSX.Element
}