require('dotenv').config();

const { NODE_ENV } = process.env;
const DEFAULT_SECONDS = NODE_ENV === 'production' ? 900 : 4;

let timers = {};

const init = (mobId) => {
    if (!timers.hasOwnProperty(mobId)) {
        timers[mobId] = {
            inProgress: false,
            initialSeconds: DEFAULT_SECONDS,
            remainingSeconds: DEFAULT_SECONDS,
            isEditing: false,
        };
    }
};

const broadcastTimerUpdate = (mobId, broadcast) => {
    const {
        inProgress,
        remainingSeconds,
        initialSeconds,
        isEditing,
        isEditingUsername,
    } = timers[mobId];
    broadcast(
        'TIMER:UPDATE',
        { inProgress, remainingSeconds, initialSeconds, isEditing, isEditingUsername },
        mobId
    );
};

const timer = (mobId, changeRoles, broadcast) => {
    timers[mobId].remainingSeconds -= 1;

    let { remainingSeconds } = timers[mobId];

    if (remainingSeconds === 0) {
        const timesUpMessage = "Time's up!";
        console.log(timesUpMessage);
        stop(mobId, broadcast);
        changeRoles(mobId, broadcast);
    } else {
        broadcastTimerUpdate(mobId, broadcast);
    }
};

const start = (mobId, changeRoles, broadcast) => {
    const { remainingSeconds } = timers[mobId];
    if (remainingSeconds < 0) return;

    const interval = setInterval(() => {
        timer(mobId, changeRoles, broadcast);
    }, 1000);

    timers[mobId] = {
        ...timers[mobId],
        inProgress: true,
        remainingSeconds,
        interval,
        isEditing: false,
        isEditingUsername: '',
    };
    broadcastTimerUpdate(mobId, broadcast);
};

const stop = (mobId, broadcast) => {
    clearInterval(timers[mobId].interval);
    timers[mobId].inProgress = false;
    broadcastTimerUpdate(mobId, broadcast);
};

const reset = (mobId, broadcast) => {
    const { initialSeconds } = timers[mobId];
    console.log(`Timer reset to ${initialSeconds} seconds`);

    timers[mobId] = {
        initialSeconds: initialSeconds,
        inProgress: false,
        remainingSeconds: initialSeconds,
        isEditing: false,
        isEditingUsername: '',
    };
    broadcastTimerUpdate(mobId, broadcast);
};

const startModify = (mobId, username, broadcast) => {
    timers[mobId].isEditing = true;
    timers[mobId].isEditingUsername = username;
    broadcastTimerUpdate(mobId, broadcast);
};

const stopModify = (mobId, broadcast) => {
    timers[mobId].isEditing = false;
    timers[mobId].isEditingUsername = '';
    broadcastTimerUpdate(mobId, broadcast);
};

const set = (mobId, initialSeconds, broadcast) => {
    console.log(`Timer set to ${initialSeconds}`);

    timers[mobId] = {
        ...timers[mobId],
        initialSeconds,
        remainingSeconds: initialSeconds,
    };
    broadcastTimerUpdate(mobId, broadcast);
};

module.exports = {
    init,
    broadcastTimerUpdate,
    timer,
    start,
    stop,
    reset,
    startModify,
    stopModify,
    set,
};
