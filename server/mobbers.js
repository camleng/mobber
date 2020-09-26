import { shuffle } from './randomizer.js';

let mobbers = {};

const init = (mobId) => {
    if (!mobbers.hasOwnProperty(mobId)) {
        mobbers[mobId] = [];
    }
};

const broadcastMobbersUpdate = (mobId, broadcast) => {
    broadcast('MOBBERS:UPDATE', mobbers[mobId], mobId);
};

const mobberAlreadyExits = (name, mobId) => {
    return mobbers[mobId].map((m) => m.name).includes(name);
};

const addMobber = (name, mobId, broadcast) => {
    if (mobberAlreadyExits(name, mobId)) return;

    const role = determineRole(mobId);

    mobbers[mobId].push({ name, role });

    broadcastMobbersUpdate(mobId, broadcast);
};

const removeMobber = (name, mobId, broadcast) => {
    if (mobbers[mobId] === null) return;
    const _mobbers = mobbers[mobId].filter((m) => m.name !== name);
    reassignAfterDeletion(_mobbers);
    mobbers[mobId] = _mobbers;
    broadcastMobbersUpdate(mobId, broadcast);
};

const changeRoles = (mobId, broadcast) => {
    let _mobbers = mobbers[mobId];

    const [newDriverIndex, newNavigatorIndex] = incrementIndices(_mobbers);

    if (_mobbers.length > 1) {
        clearRoles(_mobbers);
        _mobbers[newDriverIndex].role = 'driver';
        _mobbers[newNavigatorIndex].role = 'navigator';
    }

    mobbers[mobId] = _mobbers;
    broadcastMobbersUpdate(mobId, broadcast);
};

const changeName = (mobId, oldName, newName, broadcast) => {
    let _mobbers = mobbers[mobId];
    let index = _mobbers.findIndex((m) => m.name === oldName);
    if (index === -1) return;

    _mobbers[index].name = newName;
    broadcastMobbersUpdate(mobId, broadcast);
};

const reassign = (mobId, _mobbers, broadcast) => {
    reassignAfterDragAndDrop(_mobbers);

    mobbers[mobId] = _mobbers;
    broadcastMobbersUpdate(mobId, broadcast);
};

const randomize = (mobId, broadcast) => {
    let _mobbers = mobbers[mobId];

    clearRoles(_mobbers);

    _mobbers = shuffle(_mobbers);

    _mobbers[0].role = 'driver';
    _mobbers[1].role = 'navigator';

    mobbers[mobId] = _mobbers;
    broadcastMobbersUpdate(mobId, broadcast);
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

const determineRole = (mobIdId) => {
    if (mobbers[mobIdId].length === 0) return 'driver';
    else if (mobbers[mobIdId].length === 1) return 'navigator';
    else return '';
};

export default {
    init,
    addMobber,
    removeMobber,
    changeRoles,
    changeName,
    reassign,
    randomize,
    broadcastMobbersUpdate,
};
