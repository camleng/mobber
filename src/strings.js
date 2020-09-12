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
            startModify: 'TIMER:START_MODIFY',
            stopModify: 'TIMER:STOP_MODIFY',
            setSessionsPerBreak: 'TIMER:SET_SESSIONS_PER_BREAK',
            setMinutesPerBreak: 'TIMER:SET_MINUTES_PER_BREAK',
        },
        mob: {
            connect: 'MOB:CONNECT',
        },
        mobbers: {
            randomize: 'MOBBERS:RANDOMIZE',
            reassign: 'MOBBERS:REASSIGN',
            change: 'MOBBERS:CHANGE',
            changeName: 'MOBBERS:CHANGE_NAME',
            add: 'MOBBERS:ADD',
            remove: 'MOBBERS:REMOVE',
            update: 'MOBBERS:UPDATE',
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
