import React, { useState, useContext, createContext } from 'react';
import { useSession } from './SessionContext';
import { strings } from '../strings';

const MobbersContext = createContext();

const MobbersProvider = (props) => {
    const [mobbers, setMobbers] = useState([]);
    const { socket, sendMessage } = useSession();
    const [driver, setDriver] = useState();
    const [navigator, setNavigator] = useState();

    socket.on(strings.commands.mobbers.update, (mobbers) => {
        setMobbers(mobbers);
        setDriver(getDriver(mobbers));
        setNavigator(getNavigator(mobbers));
    });

    const changeRoles = () => {
        sendMessage(strings.commands.mobbers.change);
    };

    const addMobber = (name) => {
        if (name.trim() === '') return;
        if (mobbers.map((m) => m.name).includes(name)) return;

        sendMessage(strings.commands.mobbers.add, { name });
    };

    const removeMobber = (name) => {
        sendMessage(strings.commands.mobbers.remove, { name });
    };

    const getDriver = (mobbers) => {
        return mobbers.find((m) => m.role === strings.roles.driver);
    };

    const getNavigator = (mobbers) => {
        return mobbers.find((m) => m.role === strings.roles.navigator);
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
    if (context === undefined) {
        throw new Error('useMobbers must be used within a MobberProvider');
    }
    return context;
};

export { MobbersProvider, useMobbers };
