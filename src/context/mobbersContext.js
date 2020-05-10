import React, { useContext, createContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

const MobbersContext = createContext();

const MobbersProvider = (props) => {
    const { sessionId } = useParams();
    const [mobbers, setMobbers] = useLocalStorage(`mobbers:${sessionId}`, []);

    const changeRoles = () => {
        let _mobbers = [...mobbers];

        const [newDriverIndex, newNavigatorIndex] = incrementIndices(_mobbers);

        clearRoles(_mobbers);
        _mobbers[newDriverIndex].role = "driver";
        _mobbers[newNavigatorIndex].role = "navigator";

        setMobbers(_mobbers);
    };

    const addMobber = (name) => {
        if (name.trim() === "") return;

        if (mobbers.find((m) => m.name === name)) {
            toast.error("This is getting out of hand -- now there are two of them!", {
                position: toast.POSITION.BOTTOM_CENTER,
            });
            return;
        }

        const role = determineRole();

        setMobbers([...mobbers, { name, role }]);
    };

    const determineRole = () => {
        if (mobbers.length === 0) return "driver";
        else if (mobbers.length === 1) return "navigator";
        else return "";
    };

    const removeMobber = (mobber) => {
        let _mobbers = [...mobbers];
        const mobberIndex = _mobbers.findIndex((m) => m === mobber);
        if (mobberIndex === -1) {
            console.log("Couldn't find the mobber");
            return;
        }
        _mobbers.splice(mobberIndex, 1);
        reassignRoles(_mobbers);
        setMobbers(_mobbers);
    };

    const reassignRoles = (_mobbers) => {
        if (_mobbers.length === 0) {
            return _mobbers;
        } else if (_mobbers.length === 1) {
            _mobbers[0].role = "driver";
            return _mobbers;
        } else if (_mobbers.length >= 2) {
            const navigatorIndex = getNavigatorIndex(_mobbers);
            if (navigatorIndex !== -1) {
                const driverIndex =
                    navigatorIndex === 0 ? _mobbers.length - 1 : navigatorIndex - 1;
                _mobbers[driverIndex].role = "driver";
            } else {
                const driverIndex = getDriverIndex(_mobbers);
                const navigatorIndex =
                    driverIndex === _mobbers.length - 1 ? 0 : driverIndex + 1;
                _mobbers[navigatorIndex].role = "navigator";
            }
        }
    };

    const incrementIndices = (_mobbers) => {
        let driverIndex = getDriverIndex(_mobbers);
        let navigatorIndex = getNavigatorIndex(_mobbers);

        if (driverIsLastInSequence(_mobbers)) {
            driverIndex = 0;
            navigatorIndex = driverIndex + 1;
        } else if (navigatorIsLastInSequence(_mobbers)) {
            driverIndex = mobbers.length - 1;
            navigatorIndex = 0;
        } else {
            driverIndex++;
            navigatorIndex++;
        }

        return [driverIndex, navigatorIndex];
    };

    const getDriverIndex = (_mobbers) => {
        return _mobbers.findIndex((m) => m.role === "driver");
    };

    const getNavigatorIndex = (_mobbers) => {
        return _mobbers.findIndex((m) => m.role === "navigator");
    };

    const navigatorIsLastInSequence = (_mobbers) => {
        const navigatorIndex = _mobbers.findIndex((m) => m.role === "navigator");
        return navigatorIndex === _mobbers.length - 1;
    };

    const driverIsLastInSequence = (_mobbers) => {
        const driverIndex = _mobbers.findIndex((m) => m.role === "driver");
        return driverIndex === _mobbers.length - 1;
    };

    const clearRoles = (_mobbers) => {
        _mobbers.forEach((m) => (m.role = ""));
    };

    return (
        <MobbersContext.Provider
            value={{ mobbers, changeRoles, addMobber, removeMobber, sessionId }}>
            {props.children}
        </MobbersContext.Provider>
    );
};

const useMobbers = () => {
    const context = useContext(MobbersContext);
    if (context === undefined) {
        throw new Error("useMobbers must be used within a MobberProvider");
    }
    return context;
};

export { MobbersProvider, useMobbers };
