const sequelize = require('..');
const { mobber, mob } = sequelize.models;
const { findMobBySessionId } = require('./mobService');

const createMobber = async (name) => {
    return await mobber.create({ name });
};

const alreadyInMob = (mobId, _mobber) => {
    return _mobber.mob.sessionId === mobId;
};

const addMobberToMob = async (id, name, mobId) => {
    console.log('Adding mobber to mob');
    let existingMobber = null;

    if (id !== undefined) {
        console.log('Getting mobber by id now: ', id);
        existingMobber = await mobber.findOne({
            where: { id },
            include: [{ association: mobber.mob }],
        });
    }

    if (existingMobber === null) return await createMobber(name, mobId);
    if (alreadyInMob(mobId, existingMobber)) return existingMobber;

    const mob = await findMobBySessionId(mobId);
    await existingMobber.setMob(mob);
    return existingMobber;
};

const removeMobberFromMob = async (id) => {
    await mobber.update({ mobId: null }, { where: { id } });
};

const getById = async (id) => {
    return await mobber.findOne({ where: { id } });
};

const getAllInMob = async (mobId) => {
    const mobbers = await mobber.findAll({
        attributes: ['id', 'name'],
        include: [{ model: mob, attributes: ['sessionId'], where: { sessionId: mobId } }],
    });
    console.log(JSON.stringify(mobbers, null, 2));
    return mobbers;
};

module.exports = {
    addMobberToMob,
    removeMobberFromMob,
    createMobber,
    getAllInMob,
    getById,
};
