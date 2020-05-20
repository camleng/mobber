let timers = {};

const init = (sessionId, initialSeconds) => {
    if (!timers.hasOwnProperty(sessionId)) {
        timers[sessionId] = { inProgress: false, remainingSeconds: initialSeconds };
        console.log('Created timer for this session');
    }
};

const broadcastTimerUpdate = (sessionId, broadcast) => {
    console.log(broadcast);
    const { inProgress, remainingSeconds } = timers[sessionId];
    broadcast('TIMER:UPDATE', { inProgress, remainingSeconds }, sessionId);
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

    timers[sessionId] = { inProgress: true, remainingSeconds, interval };
    broadcastTimerUpdate(sessionId, broadcast);
};

const stop = (sessionId, broadcast) => {
    clearInterval(timers[sessionId].interval);
    timers[sessionId].inProgress = false;
    broadcastTimerUpdate(sessionId, broadcast);
};

const reset = (initialSeconds, sessionId, broadcast) => {
    console.log(`Timer reset to ${initialSeconds} seconds`);
    timers[sessionId] = { inProgress: false, remainingSeconds: initialSeconds };
    broadcastTimerUpdate(sessionId, broadcast);
};

module.exports = { init, broadcastTimerUpdate, timer, start, stop, reset };
