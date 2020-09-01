import React, { createContext, useContext } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { strings } from '../strings';

const SessionContext = createContext();

const SessionProvider = (props) => {
    const { sessionId } = useParams();
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

    const sendMessage = (event, payload) => {
        payload = payload || {};
        payload.sessionId = sessionId;
        socket.emit(event, payload);
    };

    const start = () => sendMessage(strings.commands.timer.start);

    const stop = () => sendMessage(strings.commands.timer.stop);

    const reset = () => sendMessage(strings.commands.timer.reset);

    const startModifyingTime = (username) =>
        sendMessage(strings.commands.timer.startModify, { username });

    const stopModifyingTime = () => sendMessage(strings.commands.timer.stopModify);

    const connect = () => sendMessage(strings.commands.session.connect);

    const randomizeMobbers = () => sendMessage(strings.commands.mobbers.randomize);

    const reassignMobbers = (mobbers) =>
        sendMessage(strings.commands.mobbers.reassign, { mobbers });

    const changeName = (oldName, newName) =>
        sendMessage(strings.commands.mobbers.changeName, { oldName, newName });

    return (
        <SessionContext.Provider
            value={{
                socket,
                sessionId,
                sendMessage,
                start,
                stop,
                reset,
                startModifyingTime,
                stopModifyingTime,
                connect,
                randomizeMobbers,
                reassignMobbers,
                changeName,
            }}>
            {props.children}
        </SessionContext.Provider>
    );
};

const useSession = () => {
    return useContext(SessionContext);
};

export { useSession, SessionProvider };
