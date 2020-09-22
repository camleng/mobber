const sequelize = require('..');
const { mob } = sequelize.models;

const createMob = async (sessionId) => {
    return await mob.create({ sessionId });
};

const findMobBySessionId = async (sessionId) => {
    return await mob.findOne({ where: { sessionId } });
};

module.exports = { createMob, findMobBySessionId };
