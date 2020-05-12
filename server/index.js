const app = require("http").createServer(handler);
const io = require("socket.io")(app);

app.listen(3002);

function handler() {
    return "<h1>Welcome</h1>";
}

const db = require("./database");
db.init();

let timers = {};

let clients = {};

io.on("connection", (socket) => {
    socket.on("TIMER:INITIALIZE", (data) => {
        initializeTimer(data.initialSeconds, data.sessionId, socket);
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

const timer = (sessionId) => {
    timers[sessionId].remainingSeconds -= 1;

    let { remainingSeconds } = timers[sessionId];

    if (remainingSeconds === 0) {
        const timesUpMessage = "Time's up!";
        console.log(timesUpMessage);
        stop(sessionId);
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

const initializeTimer = (initialSeconds, sessionId, socket) => {
    if (!clients[sessionId]) {
        clients[sessionId] = [];
    }
    clients[sessionId].push(socket);

    if (!timers.hasOwnProperty(sessionId)) {
        timers[sessionId] = { inProgress: false, remainingSeconds: initialSeconds };
    }

    broadcastTimerUpdate(sessionId);
    console.log("Timer initialized");
};
