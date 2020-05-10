import React, { useState, useEffect, useRef } from "react";
import Countdown from "./Countdown";
import Mobbers from "./Mobbers";
import RoundedRect from "./RoundedRect";
import { useMobbers } from "../context/mobbersContext";
import "./MobbingSession.scss";
import { toast } from "react-toastify";

const MobbingSession = () => {
    let initialSeconds = 1 * 10;
    const [countdown, setCountdown] = useState(initialSeconds);
    const [inProgress, setInProgress] = useState(false);
    const ws = useRef(new WebSocket(`ws://${window.location.hostname}:3002`));
    const { mobbers, changeRoles } = useMobbers();

    useEffect(() => {
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

    return (
        <div>
            <div className="countdown-and-controls">
                <Countdown countdown={countdown} />

                <div className="buttons">
                    {!inProgress && countdown > 0 && (
                        <RoundedRect title="Start" className="start" onClick={start} />
                    )}
                    {inProgress && (
                        <RoundedRect title="Stop" className="stop" onClick={stop} />
                    )}
                    {!inProgress && (
                        <RoundedRect title="Reset" className="reset" onClick={reset} />
                    )}
                </div>
            </div>
            <Mobbers />
        </div>
    );
};

export default MobbingSession;
