import React, { useState, useEffect, useRef } from "react";
import Countdown from "./Countdown";
import Mobbers from "./Mobbers";
import RoundedRect from "./RoundedRect";
import { useMobbers } from "../context/mobbersContext";
import "./MobbingSession.scss";
import { toast } from "react-toastify";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const MobbingSession = () => {
    let initialSeconds = 10 * 1;
    const [countdown, setCountdown] = useState(null);
    const [inProgress, setInProgress] = useState(false);
    const { mobbers, changeRoles } = useMobbers();
    const { sessionId } = useParams();
    const socket = io("http://localhost:3002");

    // const ws = useRef(
    //     new WebSocket(`ws://${window.location.hostname}:3002/${sessionId}`)
    // );

    useEffect(() => {
        initialize();
    }, []);

    // ws.current.onopen = () => {
    //     initialize(initialSeconds);
    // };

    useEffect(() => {
        if (countdown === 0 && !inProgress) {
            changeRoles();
        }
    }, [countdown, inProgress]);

    socket.on("TIMER:UPDATE", (update) => {
        setInProgress(update.inProgress);
        setCountdown(update.remainingSeconds);
    });

    const sendMessage = (event, payload) => {
        payload = payload || {};
        payload.sessionId = sessionId;
        socket.emit(event, payload);
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
        sendMessage("TIMER:START");
    };

    const stop = () => {
        const event = "TIMER:STOP";
        sendMessage(event);
    };

    const reset = () => {
        const event = "TIMER:RESET";
        const payload = { initialSeconds: initialSeconds };
        sendMessage(event, payload);
    };

    const initialize = () => {
        const event = "TIMER:INITIALIZE";
        const payload = {
            initialSeconds: initialSeconds,
        };
        sendMessage(event, payload);
    };

    return (
        <div>
            <div className="countdown-and-controls">
                <Countdown countdown={countdown} inProgress={inProgress} />

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
                    {/* <RoundedRect title="Next" className="next" onClick={changeRoles} /> */}
                </div>
            </div>
            <Mobbers />
        </div>
    );
};

export default MobbingSession;
