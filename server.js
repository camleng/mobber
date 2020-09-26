import express from 'express';
const app = express();
import { createServer } from 'https';
import { readFileSync } from 'fs';
import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
import cors from 'cors';
import mob from './server/mob.js';
import compression from 'compression';
import dotenv from 'dotenv';
dotenv.config();

const { NODE_ENV, PORT, SSL_KEY_FILE, SSL_CRT_FILE } = process.env;

app.use(
    '/.well-known/acme-challenge',
    express.static(path.join(__dirname, '.well-known', 'acme-challenge'))
);

app.use(compression());

app.get('/mob/generate', (req, res) => {
    console.log('Generating random mob');
    const mobId = mob.activateRandomMob();
    res.send({ mobId });
});

app.get('/mob/:mobId/is-active', (req, res) => {
    const isActive = mob.isMobActive(req.params.mobId);
    res.send({ isActive });
});

if (NODE_ENV === 'production') {
    var corsOptions = {
        origin: 'https://mobber.dev',
        optionsSuccessStatus: 200,
        credentials: true,
    };
    app.use(cors(corsOptions));

    app.use(express.static(path.join(__dirname, 'prod')));

    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'prod', 'index.html'));
    });
}

const server = createServer(
    {
        key: readFileSync(SSL_KEY_FILE),
        cert: readFileSync(SSL_CRT_FILE),
    },
    app
);

server.listen(PORT, () => {
    console.log(`HTTPS server running on port ${PORT}`);
});

mob.init(server);
