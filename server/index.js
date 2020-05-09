const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3002 });
let intervalId = 0;

let seconds = 0;

wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        console.log(`Received message => ${message}`);
        const msg = JSON.parse(message);
        if (msg.command === "START") {
            start();
        } else if (msg.command === "STOP") {
            stop();
        } else if (msg.command === "RESET") {
            reset(msg.initialSeconds);
        } else if (msg.command === "INITIALIZE") {
            initialize(msg.initialSeconds);
        }
    });
});

const broadcast = (message) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};

const timer = () => {
    --seconds;
    if (seconds === 0) {
        stop();

        const timesUpMessage = "Time's up!";
        console.log(timesUpMessage);
        return { inProgress: false, remainingSeconds: 0 };
    }
    return { inProgress: true, remainingSeconds: seconds };
};

const start = () => {
    if (seconds < 0) return;
    intervalId = setInterval(() => broadcast(timer()), 1000);
};

const stop = () => {
    clearInterval(intervalId);
    intervalId = 0;
};

const reset = (initialSeconds) => {
    stop();
    seconds = initialSeconds;
    console.log(`Timer reset to ${seconds} seconds`);
    broadcast({ inProgress: false, remainingSeconds: seconds });
};

const initialize = (initialSeconds) => {
    if (!timerIsRunning()) {
        reset(initialSeconds);
    } else {
        console.log("Timer's already running. Won't reset.");
    }
};

const timerIsRunning = () => {
    return intervalId !== 0;
};
