export const strings = {
    title: 'Mobber',
    storageKeys: {
        mobberNameKey: 'mobber:name',
        audioFile: 'mobber:audioFile',
    },
    audioFiles: {
        yourTurn: { name: 'Your Turn', file: 'your-turn.mp3' },
        timesUp: { name: "Time's up", file: 'times-up.m4a' },
        noSound: { name: 'No sound', file: '' },
    },
    keyboardKeys: {
        enter: 'Enter',
    },
    commands: {
        timer: {
            start: 'TIMER:START',
            update: 'TIMER:UPDATE',
            reset: 'TIMER:RESET',
            set: 'TIMER:SET',
            stop: 'TIMER:STOP',
            startModify: 'TIMER:STARTMODIFY',
            stopModify: 'TIMER:STOPMODIFY',
        },
        mob: {
            connect: 'MOB:CONNECT',
        },
        mobbers: {
            randomize: 'MOBBERS:RANDOMIZE',
            reassign: 'MOBBERS:REASSIGN',
            change: 'MOBBERS:CHANGE',
            changeName: 'MOBBERS:CHANGENAME',
            add: 'MOBBERS:ADD',
            remove: 'MOBBERS:REMOVE',
            update: 'MOBBERS:UPDATE',
            nameUpdate: 'MOBBERS:NAME_UPDATE',
            create: 'MOBBERS:CREATE',
            creation: 'MOBBERS:CREATION',
        },
    },
    roles: {
        driver: 'driver',
        navigator: 'navigator',
    },
    errors: {
        nameLength: 'Please enter a name with fewer than 50 characters',
        duplicateMobberName:
            'A mobber with that name is already in this mob. Please choose a different name',
    },
};

// export default {
//     storageKeys: strings.storageKeys,
//     keyboardKeys: strings.keyboardKeys,
//     commands: strings.commands,
// };
