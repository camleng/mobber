import React, { createContext, useContext, useCallback } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { strings } from '../strings';

const MobContext = createContext();

const MobProvider = (props) => {
    const { mobId } = useParams();
    var connectionOptions = {
        'force new connection': true,
        reconnectionAttempts: 6,
        timeout: 5000,
        transports: ['websocket'],
    };

    const socket = io(
        `https://${window.location.hostname}:${process.env.REACT_APP_PORT || 3002}`,
        connectionOptions
    );

    const sendMessage = useCallback(
        (event, payload) => {
            payload = payload || {};
            payload.mobId = mobId;
            socket.emit(event, payload);
        },
        [mobId, socket]
    );

    const connect = () => sendMessage(strings.commands.mob.connect);

    const randomizeMobbers = () => sendMessage(strings.commands.mobbers.randomize);

    const reassignMobbers = (mobbers) =>
        sendMessage(strings.commands.mobbers.reassign, { mobbers });

    const changeName = (newName, id) =>
        sendMessage(strings.commands.mobbers.changeName, { newName, id });

    return (
        <MobContext.Provider
            value={{
                socket,
                mobId,
                sendMessage,
                connect,
                randomizeMobbers,
                reassignMobbers,
                changeName,
            }}>
            {props.children}
        </MobContext.Provider>
    );
};

const useMob = () => {
    return useContext(MobContext);
};

export { useMob, MobProvider };
