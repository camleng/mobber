const registerRoutes = async (app, mob) => {
    app.get('/mob/generate', async (req, res) => {
        console.log('Generating random mob');
        const mobId = await mob.activateRandomMob();
        res.send({ mobId });
    });

    app.get('/mob/:mobId/is-active', (req, res) => {
        const isActive = mob.isMobActive(req.params.mobId);
        res.send({ isActive });
    });
};

module.exports = { registerRoutes };
