import React, { useState, useRef, useEffect } from "react";
import "./Countdown.scss";
import { useMobbers } from "../context/mobbersContext";
import { toast } from "react-toastify";

const Countdown = () => {
    let initialSeconds = 1 * 10;
    const [countdown, setCountdown] = useState(initialSeconds);
    const [inProgress, setInProgress] = useState(false);
    const ws = useRef(new WebSocket(`ws://${window.location.hostname}:3002`));
    const { mobbers, changeRoles } = useMobbers();

    useEffect(() => {
        document.title = `Mobber - ${formatTime(countdown)}`;

        if (countdown === 0 && !inProgress) {
            changeRoles();
        }
    }, [countdown, inProgress]);

    ws.current.onopen = () => {
        initialize(initialSeconds);
    };

    ws.current.onmessage = (message) => {
        const payload = JSON.parse(message.data);
        setInProgress(payload.inProgress);
        setCountdown(payload.remainingSeconds);
    };

    const sendMessage = (payload) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(payload));
        }
    };

    const start = () => {
        if (mobbers.length < 2) {
            toast.error(
                "You're gonna need at least two mobbers to call this a mob. Add some more!",
                {
                    position: toast.POSITION.BOTTOM_CENTER,
                }
            );
            return;
        }
        setInProgress(true);
        const payload = { command: "START" };
        sendMessage(payload);
    };

    const stop = () => {
        setInProgress(false);
        const payload = { command: "STOP" };
        sendMessage(payload);
    };

    const reset = () => {
        setInProgress(false);
        setCountdown(initialSeconds);
        const payload = { command: "RESET", initialSeconds: initialSeconds };
        sendMessage(payload);
    };

    const initialize = () => {
        setCountdown(initialSeconds);
        const payload = { command: "INITIALIZE", initialSeconds: initialSeconds };
        sendMessage(payload);
    };

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");
        const sec = (seconds % 60).toString().padStart(2, "0");
        return `${min}:${sec}`;
    };

    return (
        <div className="countdown">
            {countdown > 0 && <h1>{formatTime(countdown)}</h1>}
            {countdown <= 0 && <h1>Time's up!</h1>}

            <div className="buttons">
                {!inProgress && countdown > 0 && (
                    <div className="start" onClick={start}>
                        Start
                    </div>
                )}
                {inProgress && (
                    <div className="stop" onClick={stop}>
                        Stop
                    </div>
                )}
                {!inProgress && (
                    <div className="reset" onClick={reset}>
                        Reset
                    </div>
                )}
            </div>
        </div>
    );
};

export default Countdown;
