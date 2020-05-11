const WebSocket = require("ws");
const app = require("http").createServer((req, res) => "<h1>Welcome</h1>");
// const wss = new WebSocket.Server({ port: 3002 });
const io = require("socket.io")(app);

app.listen(3002);

const db = require("./database");
db.init();

let intervals = {};
let currentIntervalIndex = 0;

let timers = {};

let clients = {};

io.on("connection", (socket) => {
    socket.emit("news", { hello: "world" });
    socket.on("my other event", (data) => {
        console.log(data);
    });
});

// wss.on("connection", (ws, req) => {
//     const sessionId = parseInt(req.url.substr(1));

//     if (!clients.hasOwnProperty(sessionId)) {
//         clients[sessionId] = [];
//     }
//     if (!clients[sessionId].includes(ws)) {
//         clients[sessionId].push(ws);
//     } else {
//         console.log("Already in there");
//     }

//     ws.on("message", (message) => {
//         console.log(`Received message => ${message}`);
//         const msg = JSON.parse(message);
//         if (msg.command === "START") {
//             start(msg.sessionId);
//         } else if (msg.command === "STOP") {
//             stop(msg.sessionId);
//         } else if (msg.command === "RESET") {
//             reset(msg.initialSeconds, msg.sessionId);
//         } else if (msg.command === "INITIALIZE") {
//             initialize(msg.initialSeconds, msg.sessionId);
//         }
//     });

//     ws.on("close", () => {
//         console.log("Connection closed");
//     });
// });

const broadcast = (message, sessionId) => {
    console.log(`Sending: ${JSON.stringify(message)}`);

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
    } else {
        db.setRemainingSeconds(sessionId, true, remainingSeconds);
        return { inProgress: true, remainingSeconds };
    }
};

const start = (sessionId) => {
    db.getMobbingSession(sessionId, (session) => {
        const { remainingSeconds } = session;

        timers[sessionId] = remainingSeconds;

        if (timers[sessionId] < 0) return;

        const interval = setInterval(() => {
            const progress = timer(sessionId);
            if (progress) broadcast(progress, sessionId);
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
        broadcast(
            {
                remainingSeconds: session.remainingSeconds,
                inProgress: session.inProgress === 1,
            },
            sessionId
        );
    });
};
