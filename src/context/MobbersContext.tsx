import React, { useState, useContext, createContext } from 'react';
import { useMob } from './MobContext';
import { strings } from '../strings';
import { Mobber }  from '../models/Mobber';

const MobbersContext = createContext<MobbersContextValue>({} as MobbersContextValue);

const MobbersProvider = (props: Props) => {
    const [mobbers, setMobbers] = useState<Mobber[]>([]);
    const {socket, sendMessage} = useMob();
    const [driver, setDriver] = useState<Mobber>();
    const [navigator, setNavigator] = useState<Mobber>();

    socket.on(strings.commands.mobbers.update, (newMobbers: Mobber[]) => {
        setMobbers(newMobbers);
        setDriver(getDriver(newMobbers));
        setNavigator(getNavigator(newMobbers));
    });

    const changeRoles = () => {
        sendMessage(strings.commands.mobbers.change);
    };

    const addMobber = (name: string) => {
        if (name.trim() === '') return;
        if (mobbers.map((m) => m.name).includes(name)) return;

        sendMessage(strings.commands.mobbers.add, { name });
    };

    const removeMobber = (name: string) => {
        sendMessage(strings.commands.mobbers.remove, { name });
    };

    const getDriver = (mobbers: Mobber[]): Mobber | undefined => {
        return mobbers.find((m: Mobber) => m.role === strings.roles.driver);
    };

    const getNavigator = (mobbers: Mobber[]): Mobber | undefined => {
        return mobbers.find((m: Mobber) => m.role === strings.roles.navigator);
    };

    return (
        <MobbersContext.Provider
            value={{
                mobbers,
                changeRoles,
                addMobber,
                removeMobber,
                driver,
                navigator,
            }}>
            {props.children}
        </MobbersContext.Provider>
    );
};

const useMobbers = () => {
    const context = useContext(MobbersContext);
    if (context === {} as MobbersContextValue) {
        throw new Error('useMobbers must be used within a MobberProvider');
    }
    return context;
};

export { MobbersProvider, useMobbers };

export type MobbersContextValue = {
    mobbers: Mobber[],
    changeRoles: () => void,
    addMobber: (name: string) => void,
    removeMobber: (name: string) => void,
    driver: Mobber | undefined,
    navigator: Mobber | undefined
};

export type Props = {
    children: JSX.Element
}