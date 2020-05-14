import React from "react";
import "./Countdown.scss";
import { formatTime } from "../services/timeFormatter";

const Countdown = ({ countdown, inProgress }) => {
    return (
        <div className="countdown">
            {countdown > 0 && <div className="timer">{formatTime(countdown)}</div>}
            {!inProgress && countdown <= 0 && <div className="times-up">Time's up!</div>}
        </div>
    );
};

export default Countdown;
