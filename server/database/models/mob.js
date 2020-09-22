const { DataTypes } = require('sequelize');

const buildMob = (sequelize) => {
    const Mob = sequelize.define(
        'mob',
        { sessionId: DataTypes.STRING },
        { timestamps: false }
    );

    Mob.sync();
    // Mob.sync({ force: true });
};

module.exports = buildMob;
