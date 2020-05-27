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
        socket.on('SESSION:CONNECT', (data) => {
            connectToSession(data.sessionId, socket);
        });

        socket.on('TIMER:START', (data) => {
            timer.start(data.sessionId, mobbers.changeRoles, broadcast);
        });

        socket.on('TIMER:STOP', (data) => {
            timer.stop(data.sessionId, broadcast);
        });

        socket.on('TIMER:RESET', (data) => {
            timer.reset(data.sessionId, broadcast);
        });

        socket.on('MOBBERS:ADD', (data) => {
            mobbers.addMobber(data.name, data.sessionId, broadcast);
        });

        socket.on('MOBBERS:REMOVE', (data) => {
            mobbers.removeMobber(data.mobber, data.sessionId, broadcast);
        });

        socket.on('MOBBERS:CHANGE', (data) => {
            mobbers.changeRoles(data.sessionId, broadcast);
        });

        socket.on('MOBBERS:REASSIGN', (data) => {
            mobbers.reassign(data.sessionId, data.mobbers, broadcast);
        });

        socket.on('MOBBERS:RANDOMIZE', (data) => {
            mobbers.randomize(data.sessionId, broadcast);
        });
    });
};

const broadcast = (event, message, sessionId) => {
    console.log(`Sending: ${JSON.stringify(message)}`);

    if (clients[sessionId]) {
        clients[sessionId].forEach((client) => {
            client.emit(event, message);
        });
    } else {
        console.log('No clients found');
    }
};

const connectToSession = (sessionId, socket) => {
    addClientToSession(sessionId, socket);
    timer.broadcastTimerUpdate(sessionId, broadcast);
    mobbers.broadcastMobbersUpdate(sessionId, broadcast);
};

const addClientToSession = (sessionId, socket) => {
    clients[sessionId].push(socket);
};

const initializeSession = (sessionId) => {
    if (!clients[sessionId]) {
        clients[sessionId] = [];
    }
    timer.init(sessionId);
    mobbers.init(sessionId);
};

const activateRandomSession = () => {
    let randomSessionId;

    do {
        randomSessionId = Math.floor(Math.random() * 1000000);
    } while (clients.hasOwnProperty(randomSessionId));

    initializeSession(randomSessionId);

    return randomSessionId;
};

const isSessionActive = (sessionId) => {
    const isActive = clients[sessionId] !== undefined;
    return isActive;
};

module.exports = { init, activateRandomSession, isSessionActive };
