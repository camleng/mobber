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
        socket.on('SESSION:INITIALIZE', (data) => {
            initializeSession(data.initialSeconds, data.sessionId, socket);
        });

        socket.on('TIMER:START', (data) => {
            timer.start(data.sessionId, mobbers.changeRoles, broadcast);
        });

        socket.on('TIMER:STOP', (data) => {
            timer.stop(data.sessionId, broadcast);
        });

        socket.on('TIMER:RESET', (data) => {
            timer.reset(data.initialSeconds, data.sessionId, broadcast);
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

const initializeSession = (initialSeconds, sessionId, socket) => {
    if (!clients[sessionId]) {
        clients[sessionId] = [];
    }
    clients[sessionId].push(socket);

    timer.init(sessionId, initialSeconds);
    mobbers.init(sessionId);

    timer.broadcastTimerUpdate(sessionId, broadcast);
    mobbers.broadcastMobbersUpdate(sessionId, broadcast);
};

module.exports = { init };
