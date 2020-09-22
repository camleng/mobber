const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('sqlite:mobber.sqlite3', { logging: false });

const buildModels = () => {
    const modelBuilders = [require('./models/mobber'), require('./models/mob')];
    modelBuilders.forEach((builder) => builder(sequelize));
};

const createAssociations = () => {
    const { mobber, mob } = sequelize.models;
    mobber.mob = mobber.belongsTo(mob);
    mob.mobbers = mob.hasMany(mobber);
};

buildModels();
createAssociations();

(async () => {
    await sequelize.authenticate();
    // const { mobber } = sequelize.models;

    // await mobber.create(
    //     { name: 'Austin', mob: { sessionId: '372957' } },
    //     { include: [{ association: mobber.mob }] }
    // );
    // const mobbers = await mobber.findAll({ include: mobber.mob });
    // console.log(JSON.stringify(mobbers, null, 2));
})();

module.exports = sequelize;
