const express = require('express');
const app = express();
const http = require('http').createServer(app);
const https = require('https');
const socket = require("socket.io")
const fs = require('fs')
const path = require('path');
const cors = require('cors')

var corsOptions = {
   origin: 'https://mobber.dev',
   optionsSuccessStatus: 200,
   credentials: true
}
app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
   res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const httpsServer = https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/mobber.dev/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/mobber.dev/fullchain.pem'),
}, app);

httpsServer.listen(3002, () => {
    console.log('HTTPS Server running on port 3002');
});

let timers = {};
let clients = {};
let mobbers = {}; 

const io = socket(httpsServer);

io.on("connection", (socket) => {
    socket.on("SESSION:INITIALIZE", (data) => {
        initializeSession(data.initialSeconds, data.sessionId, socket);
    });

    socket.on("TIMER:START", (data) => {
        start(data.sessionId);
    });

    socket.on("TIMER:STOP", (data) => {
        stop(data.sessionId);
    });

    socket.on("TIMER:RESET", (data) => {
        reset(data.initialSeconds, data.sessionId);
    });

    socket.on("MOBBERS:ADD", (data) => {
        addMobber(data.name, data.sessionId);
    });

    socket.on("MOBBERS:REMOVE", (data) => {
        removeMobber(data.mobber, data.sessionId);
    });

    socket.on("MOBBERS:CHANGE", (data) => {
        changeRoles(data.sessionId);
    });
});

const broadcast = (event, message, sessionId) => {
    console.log(`Sending: ${JSON.stringify(message)}`);

    if (clients[sessionId]) {
        clients[sessionId].forEach((client) => {
            client.emit(event, message);
        });
    } else {
        console.log("No clients found");
    }
};

const broadcastTimerUpdate = (sessionId) => {
    const { inProgress, remainingSeconds } = timers[sessionId];
    broadcast("TIMER:UPDATE", { inProgress, remainingSeconds }, sessionId);
};

const broadcastMobbersUpdate = (sessionId) => {
    broadcast("MOBBERS:UPDATE", mobbers[sessionId], sessionId);
};

const timer = (sessionId) => {
    timers[sessionId].remainingSeconds -= 1;

    let { remainingSeconds } = timers[sessionId];

    if (remainingSeconds === 0) {
        const timesUpMessage = "Time's up!";
        console.log(timesUpMessage);
        stop(sessionId);
        changeRoles(sessionId);
    } else {
        broadcastTimerUpdate(sessionId);
    }
};

const start = (sessionId) => {
    const { remainingSeconds } = timers[sessionId];
    if (remainingSeconds < 0) return;

    const interval = setInterval(() => {
        timer(sessionId);
    }, 1000);

    timers[sessionId] = { inProgress: true, remainingSeconds, interval };
    broadcastTimerUpdate(sessionId);
};

const stop = (sessionId) => {
    clearInterval(timers[sessionId].interval);
    timers[sessionId].inProgress = false;
    broadcastTimerUpdate(sessionId);
};

const reset = (initialSeconds, sessionId) => {
    console.log(`Timer reset to ${initialSeconds} seconds`);
    timers[sessionId] = { inProgress: false, remainingSeconds: initialSeconds };
    broadcastTimerUpdate(sessionId);
};

const initializeSession = (initialSeconds, sessionId, socket) => {
    if (!clients[sessionId]) {
        clients[sessionId] = [];
    }
    clients[sessionId].push(socket);

    if (!mobbers.hasOwnProperty(sessionId)) {
        mobbers[sessionId] = [];
    }

    if (!timers.hasOwnProperty(sessionId)) {
        timers[sessionId] = { inProgress: false, remainingSeconds: initialSeconds };
    }

    broadcastTimerUpdate(sessionId);
    broadcastMobbersUpdate(sessionId);
};

const addMobber = (name, sessionId) => {
    const role = determineRole(sessionId);

    mobbers[sessionId].push({ name, role });

    broadcastMobbersUpdate(sessionId);
};

const removeMobber = (mobber, sessionId) => {
    const _mobbers = mobbers[sessionId];
    const mobberIndex = _mobbers.findIndex((m) => m.name === mobber.name);
    if (mobberIndex === -1) {
        console.log("Couldn't find the mobber");
        return;
    }

    _mobbers.splice(mobberIndex, 1);
    reassignRoles(_mobbers);
    mobbers[sessionId] = _mobbers;
    broadcastMobbersUpdate(sessionId);
};

const changeRoles = (sessionId) => {
    let _mobbers = mobbers[sessionId];

    const [newDriverIndex, newNavigatorIndex] = incrementIndices(_mobbers);

    clearRoles(_mobbers);
    _mobbers[newDriverIndex].role = "driver";
    _mobbers[newNavigatorIndex].role = "navigator";

    mobbers[sessionId] = _mobbers;
    broadcastMobbersUpdate(sessionId);
};

const incrementIndices = (_mobbers) => {
    let driverIndex = getDriverIndex(_mobbers);
    let navigatorIndex = getNavigatorIndex(_mobbers);

    if (driverIsLastInSequence(_mobbers)) {
        driverIndex = 0;
        navigatorIndex = driverIndex + 1;
    } else if (navigatorIsLastInSequence(_mobbers)) {
        driverIndex = _mobbers.length - 1;
        navigatorIndex = 0;
    } else {
        driverIndex++;
        navigatorIndex++;
    }

    return [driverIndex, navigatorIndex];
};

const navigatorIsLastInSequence = (_mobbers) => {
    const navigatorIndex = _mobbers.findIndex((m) => m.role === "navigator");
    return navigatorIndex === _mobbers.length - 1;
};

const driverIsLastInSequence = (_mobbers) => {
    const driverIndex = _mobbers.findIndex((m) => m.role === "driver");
    return driverIndex === _mobbers.length - 1;
};

const clearRoles = (_mobbers) => {
    _mobbers.forEach((m) => (m.role = ""));
};

const reassignRoles = (_mobbers) => {
    if (_mobbers.length === 0) {
        return _mobbers;
    } else if (_mobbers.length === 1) {
        _mobbers[0].role = "driver";
        return _mobbers;
    } else if (_mobbers.length >= 2) {
        const navigatorIndex = getNavigatorIndex(_mobbers);
        if (navigatorIndex !== -1) {
            const driverIndex =
                navigatorIndex === 0 ? _mobbers.length - 1 : navigatorIndex - 1;
            _mobbers[driverIndex].role = "driver";
        } else {
            const driverIndex = getDriverIndex(_mobbers);
            const navigatorIndex =
                driverIndex === _mobbers.length - 1 ? 0 : driverIndex + 1;
            _mobbers[navigatorIndex].role = "navigator";
        }
    }
};

const getNavigatorIndex = (_mobbers) => {
    return _mobbers.findIndex((m) => m.role === "navigator");
};

const getDriverIndex = (_mobbers) => {
    return _mobbers.findIndex((m) => m.role === "driver");
};

const determineRole = (sessionId) => {
    if (mobbers[sessionId].length === 0) return "driver";
    else if (mobbers[sessionId].length === 1) return "navigator";
    else return "";
};
