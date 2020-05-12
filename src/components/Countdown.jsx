import React, { useEffect } from "react";
import "./Countdown.scss";

const Countdown = ({ countdown, inProgress }) => {
    useEffect(() => {
        document.title = `Mobber - ${formatTime(countdown)}`;
    }, [countdown]);

    const formatTime = (seconds) => {
        if (seconds === undefined || seconds === null) return "00:00";
        const min = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");
        const sec = (seconds % 60).toString().padStart(2, "0");
        return `${min}:${sec}`;
    };

    return (
        <div className="countdown">
            {countdown > 0 && <div className="timer">{formatTime(countdown)}</div>}
            {!inProgress && countdown <= 0 && <div className="timer">Time's up!</div>}
        </div>
    );
};

export default Countdown;
