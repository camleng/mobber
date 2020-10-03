import React, { createContext, useContext, useCallback } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { strings } from '../strings';
import { Mobber } from '../models/Mobber';

const MobContext = createContext<MobContextValue>({} as MobContextValue);

const MobProvider = (props: Props) => {
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
        (event: string, payload: any = {}) => {
            payload.mobId = mobId;
            socket.emit(event, payload);
        },
        [mobId, socket]
    );

    const connect = () => sendMessage(strings.commands.mob.connect);

    const randomizeMobbers = () => sendMessage(strings.commands.mobbers.randomize);

    const reassignMobbers = (mobbers: Mobber[]) =>
        sendMessage(strings.commands.mobbers.reassign, { mobbers });

    const changeName = (oldName: string, newName: string) =>
        sendMessage(strings.commands.mobbers.changeName, { oldName, newName });

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

type Props = {
    children: JSX.Element
}

export type MobContextValue = {
    socket: SocketIOClient.Socket,
    mobId: string,
    sendMessage: (event: string, payload?: any) => void,
    connect: () => void,
    randomizeMobbers: () => void,
    reassignMobbers: (mobbers: Mobber[]) => void,
    changeName: (oldName: string, newName: string) => void,
};