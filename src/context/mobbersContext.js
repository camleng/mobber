import React, { useState, useContext, createContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "./SessionContext";

const MobbersContext = createContext();

const MobbersProvider = (props) => {
    const [mobbers, setMobbers] = useState([]);
    const { socket, sendMessage } = useSession();

    socket.on("MOBBERS:UPDATE", (data) => {
        setMobbers(data);
    });

    const changeRoles = () => {
        sendMessage("MOBBERS:CHANGE");
    };

    const addMobber = (name) => {
        if (name.trim() === "") return;

        if (mobbers.find((m) => m.name === name)) {
            toast.error("This is getting out of hand -- now there are two of them!", {
                position: toast.POSITION.BOTTOM_CENTER,
            });
            return;
        }

        sendMessage("MOBBERS:ADD", { name });
    };

    const removeMobber = (mobber) => {
        sendMessage("MOBBERS:REMOVE", { mobber });
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
