import React, { useState, useEffect } from "react";
import Countdown from "./Countdown";
import Mobbers from "./Mobbers";
import RoundedRect from "./RoundedRect";
import CurrentMobbers from "./CurrentMobbers";
import { toast } from "react-toastify";
import { useMobbers } from "../context/MobbersContext";
import { useSession } from "../context/SessionContext";
import "./MobbingSession.scss";

const MobbingSession = () => {
    let initialSeconds = 60 * 15;
    // let initialSeconds = 3;
    const [countdown, setCountdown] = useState(null);
    const [inProgress, setInProgress] = useState(false);
    const { mobbers } = useMobbers();
    const { socket, sessionId } = useSession();

    useEffect(() => {
        initialize();
    }, []);

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
        const event = "SESSION:INITIALIZE";
        const payload = {
            initialSeconds: initialSeconds,
        };
        sendMessage(event, payload);
    };

    return (
        <>
            <div className="countdown-and-controls">
                <Countdown countdown={countdown} inProgress={inProgress} />

                <div className="buttons">
                    {!inProgress && countdown > 0 && (
                        <RoundedRect title="Start" className="start" onClick={start} />
                    )}
                    {inProgress && (
                        <RoundedRect title="Stop" className="stop" onClick={stop} />
                    )}
                    {!inProgress && countdown !== initialSeconds && (
                        <RoundedRect title="Reset" className="reset" onClick={reset} />
                    )}
                </div>
            </div>
            <CurrentMobbers />
            <Mobbers />
        </>
    );
};

export default MobbingSession;
