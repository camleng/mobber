const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const session = require('./server/session');
require('dotenv').config();

const { NODE_ENV, PORT, SSL_KEY_FILE, SSL_CRT_FILE } = process.env;

app.get('/session/generate', (req, res) => {
    const sessionId = session.activateRandomSession();
    res.send({ sessionId });
});

app.get('/session/:sessionId/is-active', (req, res) => {
    const isActive = session.isSessionActive(req.params.sessionId);
    res.send({ isActive });
});

if (NODE_ENV === 'production') {
    var corsOptions = {
        origin: 'https://mobber.dev',
        optionsSuccessStatus: 200,
        credentials: true,
    };
    app.use(cors(corsOptions));

    app.use(express.static(path.join(__dirname, 'build')));

    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
}

const server = https.createServer(
    {
        key: fs.readFileSync(SSL_KEY_FILE),
        cert: fs.readFileSync(SSL_CRT_FILE),
    },
    app
);

server.listen(PORT, () => {
    console.log(`HTTPS server running on port ${PORT}`);
});

session.init(server);
