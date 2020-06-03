require('dotenv').config();

const { NODE_ENV } = process.env;
const DEFAULT_SECONDS = NODE_ENV === 'production' ? 900 : 4;

let timers = {};

const init = (sessionId) => {
    if (!timers.hasOwnProperty(sessionId)) {
        timers[sessionId] = {
            inProgress: false,
            initialSeconds: DEFAULT_SECONDS,
            remainingSeconds: DEFAULT_SECONDS,
        };
    }
};

const broadcastTimerUpdate = (sessionId, broadcast) => {
    const { inProgress, remainingSeconds, initialSeconds } = timers[sessionId];
    broadcast(
        'TIMER:UPDATE',
        { inProgress, remainingSeconds, initialSeconds },
        sessionId
    );
};

const timer = (sessionId, changeRoles, broadcast) => {
    timers[sessionId].remainingSeconds -= 1;

    let { remainingSeconds } = timers[sessionId];

    if (remainingSeconds === 0) {
        const timesUpMessage = "Time's up!";
        console.log(timesUpMessage);
        stop(sessionId, broadcast);
        changeRoles(sessionId, broadcast);
    } else {
        broadcastTimerUpdate(sessionId, broadcast);
    }
};

const start = (sessionId, changeRoles, broadcast) => {
    const { remainingSeconds } = timers[sessionId];
    if (remainingSeconds < 0) return;

    const interval = setInterval(() => {
        timer(sessionId, changeRoles, broadcast);
    }, 1000);

    timers[sessionId] = {
        ...timers[sessionId],
        inProgress: true,
        remainingSeconds,
        interval,
    };
    broadcastTimerUpdate(sessionId, broadcast);
};

const stop = (sessionId, broadcast) => {
    clearInterval(timers[sessionId].interval);
    timers[sessionId].inProgress = false;
    broadcastTimerUpdate(sessionId, broadcast);
};

const reset = (sessionId, broadcast) => {
    const { initialSeconds } = timers[sessionId];
    console.log(`Timer reset to ${initialSeconds} seconds`);

    timers[sessionId] = {
        initialSeconds: initialSeconds,
        inProgress: false,
        remainingSeconds: initialSeconds,
    };
    broadcastTimerUpdate(sessionId, broadcast);
};

const set = (sessionId, initialSeconds, broadcast) => {
    console.log(`Timer set to ${initialSeconds}`);

    timers[sessionId] = {
        ...timers[sessionId],
        initialSeconds,
        remainingSeconds: initialSeconds,
    };
    broadcastTimerUpdate(sessionId, broadcast);
};

module.exports = { init, broadcastTimerUpdate, timer, start, stop, reset, set };
