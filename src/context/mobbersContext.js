import React, { useContext, createContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MobbersContext = createContext();

const MobbersProvider = (props) => {
    const [mobbers, setMobbers] = useLocalStorage("mobbers", [
        { name: "Cameron", role: "driver" },
    ]);

    const changeRoles = () => {
        let _mobbers = [...mobbers];
        let driverIndex = _mobbers.findIndex((m) => m.role === "driver");
        let navigatorIndex = driverIndex + 1;

        const [newDriverIndex, newNavigatorIndex] = incrementIndices(
            driverIndex,
            navigatorIndex
        );

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
        setMobbers(_mobbers);
    };

    const incrementIndices = (driverIndex, navigatorIndex) => {
        if (driverIsLastInSequence(driverIndex)) {
            driverIndex = 0;
            navigatorIndex = driverIndex + 1;
        } else if (navigatorIsLastInSequence(driverIndex)) {
            driverIndex = mobbers.length - 1;
            navigatorIndex = 0;
        } else {
            driverIndex++;
            navigatorIndex++;
        }

        return [driverIndex, navigatorIndex];
    };

    const navigatorIsLastInSequence = (driverIndex) => {
        return driverIndex + 1 === mobbers.length - 1;
    };

    const driverIsLastInSequence = (driverIndex) => {
        return driverIndex === mobbers.length - 1;
    };

    const clearRoles = (_mobbers) => {
        _mobbers.forEach((m) => (m.role = ""));
    };

    return (
        <MobbersContext.Provider
            value={{ mobbers, changeRoles, addMobber, removeMobber }}>
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
