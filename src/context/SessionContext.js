import React, { createContext, useContext } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';

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

    return (
        <SessionContext.Provider value={{ socket, sessionId, sendMessage }}>
            {props.children}
        </SessionContext.Provider>
    );
};

const useSession = () => {
    return useContext(SessionContext);
};

export { useSession, SessionProvider };
