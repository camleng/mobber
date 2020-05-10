const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 3002 });

const db = require("./database");
db.init();

let intervals = {};
let currentIntervalIndex = 0;

let timers = {};

let clients = {};

wss.on("connection", (ws, req) => {
    const sessionId = parseInt(req.url.substr(1));

    if (!clients.hasOwnProperty(sessionId)) {
        clients[sessionId] = [];
    }
    clients[sessionId].push(ws);

    ws.on("message", (message) => {
        console.log(`Received message => ${message}`);
        const msg = JSON.parse(message);
        if (msg.command === "START") {
            start(msg.sessionId);
        } else if (msg.command === "STOP") {
            stop(msg.sessionId);
        } else if (msg.command === "RESET") {
            reset(msg.initialSeconds, msg.sessionId);
        } else if (msg.command === "INITIALIZE") {
            initialize(msg.initialSeconds, msg.sessionId);
        }
    });
});

const broadcast = (message, sessionId) => {
    const clientsInSession = clients[sessionId];
    if (!clientsInSession || clientsInSession.length === 0) {
        console.log("No clients found");
        return;
    }
    clientsInSession.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};

const timer = (sessionId) => {
    --timers[sessionId];
    let remainingSeconds = timers[sessionId];

    if (remainingSeconds === 0) {
        const timesUpMessage = "Time's up!";
        console.log(timesUpMessage);
        db.setRemainingSeconds(sessionId, false, 0);
        stop(sessionId);

        return;
    }
    db.setRemainingSeconds(sessionId, true, remainingSeconds);
    return { inProgress: true, remainingSeconds };
};

const start = (sessionId) => {
    db.getMobbingSession(sessionId, (session) => {
        const { remainingSeconds } = session;

        timers[sessionId] = remainingSeconds;

        if (timers[sessionId] < 0) return;

        const interval = setInterval(() => {
            broadcast(timer(sessionId), sessionId);
        }, 1000);

        intervals[++currentIntervalIndex] = interval;
        db.setIntervalId(sessionId, true, currentIntervalIndex);
        broadcast({ inProgress: true, remainingSeconds: remainingSeconds }, sessionId);
    });
};

const stop = (sessionId) => {
    db.getMobbingSession(sessionId, (session) => {
        const { intervalIndex, remainingSeconds } = session;
        clearInterval(intervals[intervalIndex]);
        db.setIntervalId(sessionId, false, null);
        broadcast({ inProgress: false, remainingSeconds }, sessionId);
    });
};

const reset = (initialSeconds, sessionId) => {
    timers[sessionId] = initialSeconds;
    db.resetSession(sessionId, initialSeconds);
    console.log(`Timer reset to ${initialSeconds} seconds`);
    broadcast({ inProgress: false, remainingSeconds: initialSeconds }, sessionId);
};

const initialize = (initialSeconds, sessionId) => {
    db.createMobbingSession(sessionId, false, initialSeconds);
    db.getMobbingSession(sessionId, (session) => {
        session.inProgress = session.inProgress === 1;
        broadcast(session, sessionId);
    });
};
