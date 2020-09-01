const randomizer = require('./randomizer');

let mobbers = {};

const init = (sessionId) => {
    if (!mobbers.hasOwnProperty(sessionId)) {
        mobbers[sessionId] = [];
    }
};

const broadcastMobbersUpdate = (sessionId, broadcast) => {
    broadcast('MOBBERS:UPDATE', mobbers[sessionId], sessionId);
};

const mobberAlreadyExits = (name, sessionId) => {
    return mobbers[sessionId].map((m) => m.name).includes(name);
};

const addMobber = (name, sessionId, broadcast) => {
    if (mobberAlreadyExits(name, sessionId)) return;

    const role = determineRole(sessionId);

    mobbers[sessionId].push({ name, role });

    broadcastMobbersUpdate(sessionId, broadcast);
};

const removeMobber = (name, sessionId, broadcast) => {
    if (mobbers[sessionId] === null) return;
    const _mobbers = mobbers[sessionId].filter((m) => m.name !== name);
    reassignAfterDeletion(_mobbers);
    mobbers[sessionId] = _mobbers;
    broadcastMobbersUpdate(sessionId, broadcast);
};

const changeRoles = (sessionId, broadcast) => {
    let _mobbers = mobbers[sessionId];

    const [newDriverIndex, newNavigatorIndex] = incrementIndices(_mobbers);

    if (_mobbers.length > 1) {
        clearRoles(_mobbers);
        _mobbers[newDriverIndex].role = 'driver';
        _mobbers[newNavigatorIndex].role = 'navigator';
    }

    mobbers[sessionId] = _mobbers;
    broadcastMobbersUpdate(sessionId, broadcast);
};

const changeName = (sessionId, oldName, newName, broadcast) => {
    let _mobbers = mobbers[sessionId];
    let index = _mobbers.findIndex((m) => m.name === oldName);
    if (index === -1) return;

    _mobbers[index].name = newName;
    broadcastMobbersUpdate(sessionId, broadcast);
};

const reassign = (sessionId, _mobbers, broadcast) => {
    reassignAfterDragAndDrop(_mobbers);

    mobbers[sessionId] = _mobbers;
    broadcastMobbersUpdate(sessionId, broadcast);
};

const randomize = (sessionId, broadcast) => {
    let _mobbers = mobbers[sessionId];

    clearRoles(_mobbers);

    _mobbers = randomizer.shuffle(_mobbers);

    _mobbers[0].role = 'driver';
    _mobbers[1].role = 'navigator';

    mobbers[sessionId] = _mobbers;
    broadcastMobbersUpdate(sessionId, broadcast);
};

const incrementIndices = (_mobbers) => {
    let driverIndex = getDriverIndex(_mobbers);
    let navigatorIndex = getNavigatorIndex(_mobbers);

    if (driverIsLastInSequence(_mobbers)) {
        driverIndex = 0;
        navigatorIndex = driverIndex + 1;
    } else if (navigatorIsLastInSequence(_mobbers)) {
        driverIndex = _mobbers.length - 1;
        navigatorIndex = 0;
    } else {
        driverIndex++;
        navigatorIndex++;
    }

    return [driverIndex, navigatorIndex];
};

const navigatorIsLastInSequence = (_mobbers) => {
    const navigatorIndex = _mobbers.findIndex((m) => m.role === 'navigator');
    return navigatorIndex === _mobbers.length - 1;
};

const driverIsLastInSequence = (_mobbers) => {
    const driverIndex = _mobbers.findIndex((m) => m.role === 'driver');
    return driverIndex === _mobbers.length - 1;
};

const clearRoles = (_mobbers) => {
    _mobbers.forEach((m) => (m.role = ''));
};

const reassignAfterDragAndDrop = (_mobbers) => {
    if (_mobbers.length < 2) return _mobbers;

    let driverIndex, navigatorIndex;

    driverIndex = getDriverIndex(_mobbers);
    navigatorIndex = determineNewNavigatorIndex(_mobbers, driverIndex);

    clearRoles(_mobbers);
    _mobbers[driverIndex].role = 'driver';
    _mobbers[navigatorIndex].role = 'navigator';
};

const determineNewNavigatorIndex = (_mobbers, driverIndex) => {
    return driverIndex === _mobbers.length - 1 ? 0 : driverIndex + 1;
};

const reassignAfterDeletion = (_mobbers) => {
    if (_mobbers.length === 0) {
        return _mobbers;
    } else if (_mobbers.length === 1) {
        _mobbers[0].role = 'driver';
        return _mobbers;
    } else if (_mobbers.length >= 2) {
        const navigatorIndex = getNavigatorIndex(_mobbers);
        if (navigatorIndex !== -1) {
            const driverIndex =
                navigatorIndex === 0 ? _mobbers.length - 1 : navigatorIndex - 1;
            _mobbers[driverIndex].role = 'driver';
        } else {
            const driverIndex = getDriverIndex(_mobbers);
            const navigatorIndex =
                driverIndex === _mobbers.length - 1 ? 0 : driverIndex + 1;
            _mobbers[navigatorIndex].role = 'navigator';
        }
    }
};

const getNavigatorIndex = (_mobbers) => {
    return _mobbers.findIndex((m) => m.role === 'navigator');
};

const getDriverIndex = (_mobbers) => {
    return _mobbers.findIndex((m) => m.role === 'driver');
};

const determineRole = (sessionId) => {
    if (mobbers[sessionId].length === 0) return 'driver';
    else if (mobbers[sessionId].length === 1) return 'navigator';
    else return '';
};

module.exports = {
    init,
    addMobber,
    removeMobber,
    changeRoles,
    changeName,
    reassign,
    randomize,
    broadcastMobbersUpdate,
};
