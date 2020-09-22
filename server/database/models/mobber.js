const { DataTypes } = require('sequelize');

const buildMobber = (sequelize) => {
    const Mobber = sequelize.define(
        'mobber',
        { name: DataTypes.STRING, mobId: DataTypes.INTEGER },
        // { role: DataTypes.STRING}
        { timestamps: false }
    );

    Mobber.sync();
    // Mobber.sync({ force: true });
};

module.exports = buildMobber;
