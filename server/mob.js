const socket = require('socket.io');
const timer = require('./timer');
const mobbers = require('./mobbers');

let clients = {};

const init = (server) => {
    const io = socket(server);
    addListeners(io);
};

const addListeners = (io) => {
    io.on('connection', (socket) => {
        socket.on('MOB:CONNECT', (data) => {
            connectToMob(data.mobId, socket);
        });

        socket.on('TIMER:START', (data) => {
            timer.start(data.mobId, mobbers.changeRoles, broadcast);
        });

        socket.on('TIMER:STOP', (data) => {
            timer.stop(data.mobId, broadcast);
        });

        socket.on('TIMER:SET', (data) => {
            timer.set(data.mobId, data.initialSeconds, broadcast);
        });

        socket.on('TIMER:RESET', (data) => {
            timer.reset(data.mobId, broadcast);
        });

        socket.on('TIMER:START_MODIFY', (data) => {
            timer.startModify(data.mobId, data.username, broadcast);
        });

        socket.on('TIMER:STOP_MODIFY', (data) => {
            timer.stopModify(data.mobId, broadcast);
        });

        socket.on('TIMER:SET_SESSIONS_PER_BREAK', (data) => {
            timer.setSessionsPerBreak(data.mobId, data.sessionsPerBreak, broadcast);
        });

        socket.on('TIMER:SET_MINUTES_PER_BREAK', (data) => {
            timer.setMinutesPerBreak(data.mobId, data.minutesPerBreak, broadcast);
        });

        socket.on('MOBBERS:ADD', (data) => {
            mobbers.addMobber(data.name, data.mobId, broadcast);
        });

        socket.on('MOBBERS:REMOVE', (data) => {
            mobbers.removeMobber(data.name, data.mobId, broadcast);
        });

        socket.on('MOBBERS:CHANGE', (data) => {
            mobbers.changeRoles(data.mobId, broadcast);
        });

        socket.on('MOBBERS:CHANGE_NAME', (data) => {
            mobbers.changeName(data.mobId, data.oldName, data.newName, broadcast);
        });

        socket.on('MOBBERS:REASSIGN', (data) => {
            mobbers.reassign(data.mobId, data.mobbers, broadcast);
        });

        socket.on('MOBBERS:RANDOMIZE', (data) => {
            mobbers.randomize(data.mobId, broadcast);
        });
    });
};

const broadcast = (event, message, mobId) => {
    console.log(`Sending: ${JSON.stringify(message)}`);

    if (clients[mobId]) {
        clients[mobId].forEach((client) => {
            client.emit(event, message);
        });
    } else {
        console.log('No clients found');
    }
};

const connectToMob = (mobId, socket) => {
    addClientToMob(mobId, socket);
    timer.broadcastTimerUpdate(mobId, broadcast);
    mobbers.broadcastMobbersUpdate(mobId, broadcast);
};

const addClientToMob = (mobId, socket) => {
    clients[mobId].push(socket);
};

const initializeMob = (mobId) => {
    if (!clients[mobId]) {
        clients[mobId] = [];
    }
    timer.init(mobId);
    mobbers.init(mobId);
};

const activateRandomMob = () => {
    let randomMobId;

    do {
        randomMobId = [1, 2, 3, 4, 5, 6]
            .map((_) => Math.floor(Math.random() * 10))
            .join('');
    } while (clients.hasOwnProperty(randomMobId));

    initializeMob(randomMobId);

    return randomMobId;
};

const isMobActive = (mobId) => {
    const isActive = clients[mobId] !== undefined;
    return isActive;
};

module.exports = {
    init,
    activateRandomMob,
    isMobActive,
};
