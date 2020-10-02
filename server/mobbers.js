import { shuffle } from './randomizer.js';
import prismaPkg from '@prisma/client';
const prisma = new prismaPkg.PrismaClient();

let mobbers = {};

const init = (mobId) => {
    if (!mobbers.hasOwnProperty(mobId)) {
        mobbers[mobId] = [];
    }
};

const getMobbersInMob = async (mobId) => {
    return await prisma.mobber.findMany({ where: { mob: { code: mobId } } });
}

const broadcastMobbersUpdate = async (mobId, broadcast) => {
    const mobbersInMob = await getMobbersInMob(mobId);
    broadcast('MOBBERS:UPDATE', mobbersInMob, mobId);
};

const mobberAlreadyExists = async (name, mobId) => {
    const existingUser = await prisma.mobber.findFirst({ where: { name, mob: { code: mobId } } })
    return existingUser !== null;
};

const addMobber = async (name, mobId, broadcast) => {
    if (await mobberAlreadyExists(name, mobId)) return;

    const role = await determineRole(mobId);

    await prisma.mobber.create({ data: { name, role, mob: { connect: { code: mobId } } } });

    await broadcastMobbersUpdate(mobId, broadcast);
};

const removeMobber = async (name, mobId, broadcast) => {
    await prisma.mobber.update({ data: { mobId: null }, where: { name, mob: { connect: { where: { code: mobId } } } } });

    await reassignAfterDeletion(mobId);
    await broadcastMobbersUpdate(mobId, broadcast);
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

const reassignAfterDeletion = async (mobId) => {
    const mobbersInMob = await getMobbersInMob(mobId);
    if (mobbersInMob.length === 0) {
        return mobbersInMob;
    } else if (mobbersInMob.length === 1) {
        mobbersInMob[0].role = 'driver';
        return mobbersInMob;
    } else if (mobbersInMob.length >= 2) {
        const navigatorIndex = getNavigatorIndex(mobbersInMob);
        if (navigatorIndex !== -1) {
            const driverIndex =
                navigatorIndex === 0 ? mobbersInMob.length - 1 : navigatorIndex - 1;
            mobbersInMob[driverIndex].role = 'driver';
        } else {
            const driverIndex = getDriverIndex(mobbersInMob);
            const navigatorIndex =
                driverIndex === mobbersInMob.length - 1 ? 0 : driverIndex + 1;
            mobbersInMob[navigatorIndex].role = 'navigator';
        }
    }
};

const getNavigatorIndex = (_mobbers) => {
    return _mobbers.findIndex((m) => m.role === 'navigator');
};

const getDriverIndex = (_mobbers) => {
    return _mobbers.findIndex((m) => m.role === 'driver');
};

const determineRole = async (mobId) => {
    const mobbersInMob = await getMobbersInMob(mobId);
    if (mobbersInMob.length === 0) return 'driver';
    else if (mobbersInMob.length === 1) return 'navigator';
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
