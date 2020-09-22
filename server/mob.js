const socket = require('socket.io');
const timer = require('./timer');
const mobbers = require('./mobbers');
const { createMob } = require('./database/services/mobService');
const { createMobber } = require('./database/services/mobberService');

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

        socket.on('TIMER:STARTMODIFY', (data) => {
            timer.startModify(data.mobId, data.username, broadcast);
        });

        socket.on('TIMER:STOPMODIFY', (data) => {
            timer.stopModify(data.mobId, broadcast);
        });

        socket.on('MOBBERS:CREATE', async (data) => {
            await mobbers.createNewMobber(data.name, broadcast);
        });

        socket.on('MOBBERS:ADD', async (data) => {
            await mobbers.addMobber(data.id, data.name, data.mobId, broadcast);
        });

        socket.on('MOBBERS:REMOVE', async (data) => {
            await mobbers.removeMobber(data.id, broadcast);
        });

        socket.on('MOBBERS:CHANGE', async (data) => {
            await mobbers.changeRoles(data.mobId, broadcast);
        });

        socket.on('MOBBERS:CHANGENAME', async (data) => {
            await mobbers.changeName(data.mobId, data.newName, data.id, broadcast);
        });

        socket.on('MOBBERS:REASSIGN', async (data) => {
            await mobbers.reassign(data.mobId, data.mobbers, broadcast);
        });

        socket.on('MOBBERS:RANDOMIZE', async (data) => {
            await mobbers.randomize(data.mobId, broadcast);
        });
    });
};

const broadcast = (event, message, mobId) => {
    if (clients[mobId]) {
        console.log(`Sending: ${JSON.stringify(message)}`);
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

const initializeMob = async (mobId) => {
    await createMob(mobId);

    if (!clients[mobId]) {
        clients[mobId] = [];
    }
    timer.init(mobId);
    mobbers.init(mobId);
};

const activateRandomMob = async () => {
    let randomMobId;

    do {
        randomMobId = [1, 2, 3, 4, 5, 6]
            .map((_) => Math.floor(Math.random() * 10))
            .join('');
    } while (clients.hasOwnProperty(randomMobId));

    await initializeMob(randomMobId);

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
