const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const compression = require('compression');

const { NODE_ENV } = process.env;

app.use(
    '/.well-known/acme-challenge',
    express.static(path.join(__dirname, '.well-known', 'acme-challenge'))
);

app.use(compression());

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

module.exports = { app };
