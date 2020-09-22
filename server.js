const https = require('https');
const fs = require('fs');
const mob = require('./server/mob');
const { app } = require('./server/app');
const { registerRoutes } = require('./server/routes');
const dotenv = require('dotenv');
const sequelize = require('./server/database');

dotenv.config();
const { PORT, SSL_KEY_FILE, SSL_CRT_FILE } = process.env;

const server = https.createServer(
    {
        key: fs.readFileSync(SSL_KEY_FILE),
        cert: fs.readFileSync(SSL_CRT_FILE),
    },
    app
);

const init = async () => {
    await registerRoutes(app, mob);
    await sequelize.authenticate();

    server.listen(PORT, () => {
        console.log(`HTTPS server running on port ${PORT}`);
    });

    mob.init(server);
};

init();
