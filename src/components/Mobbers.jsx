import React, { useState } from "react";
import Mobber from "./Mobber";
import "./Mobbers.scss";
import { useMobbers } from "../context/mobbersContext";

const Mobbers = () => {
    const { mobbers, addMobber } = useMobbers();
    const [newMobberName, setNewMobberName] = useState("");

    const addMobberToMob = () => {
        addMobber(newMobberName);
        setNewMobberName("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") addMobberToMob();
    };

    return (
        <div className="mobbers">
            {mobbers.map((mobber, index) => (
                <Mobber mobber={mobber} key={index} />
            ))}

            <input
                onChange={(e) => setNewMobberName(e.target.value)}
                value={newMobberName}
                onKeyUp={handleKeyPress}></input>
            <div className="add" onClick={addMobberToMob}>
                Add
            </div>
        </div>
    );
};

export default Mobbers;
