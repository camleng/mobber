import React, { useState, useContext, createContext } from 'react';
import { toast } from 'react-toastify';
import { useSession } from './SessionContext';

const MobbersContext = createContext();

const MobbersProvider = (props) => {
    const [mobbers, setMobbers] = useState([]);
    const { socket, sendMessage } = useSession();
    const [driver, setDriver] = useState();
    const [navigator, setNavigator] = useState();

    socket.on('MOBBERS:UPDATE', (mobbers) => {
        setMobbers(mobbers);
        setDriver(getDriver(mobbers));
        setNavigator(getNavigator(mobbers));
    });

    const changeRoles = () => {
        sendMessage('MOBBERS:CHANGE');
    };

    const addMobber = (name) => {
        if (name.trim() === '') return;

        if (mobbers.map((m) => m.name).includes(name)) {
            toast.error('This is getting out of hand -- now there are two of them!', {
                position: toast.POSITION.TOP_RIGHT,
            });
            return;
        }

        sendMessage('MOBBERS:ADD', { name });
    };

    const removeMobber = (name) => {
        sendMessage('MOBBERS:REMOVE', { name });
    };

    const getDriver = (mobbers) => {
        return mobbers.find((m) => m.role === 'driver');
    };

    const getNavigator = (mobbers) => {
        return mobbers.find((m) => m.role === 'navigator');
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
