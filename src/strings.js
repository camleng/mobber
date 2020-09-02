export const strings = {
    storageKeys: {
        mobberNameKey: 'mobber:name',
        audioFile: 'mobber:audioFile',
    },
    audioFiles: {
        yourTurn: { name: 'Your Turn', file: 'your-turn.mp3' },
        timesUp: { name: "Times's up", file: 'times-up.m4a' },
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
        },
    },
    roles: {
        driver: 'driver',
        navigator: 'navigator',
    },
};

// export default {
//     storageKeys: strings.storageKeys,
//     keyboardKeys: strings.keyboardKeys,
//     commands: strings.commands,
// };
