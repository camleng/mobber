import React from "react";
import { useMobbers } from "../context/MobbersContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./CurrentMobbers.scss";

const CurrentMobbers = () => {
    const { driver, navigator } = useMobbers();

    return (
        <div className="current-mobbers">
            {driver && (
                <div className="current-role">
                    <FontAwesomeIcon icon="car" className="role" />
                    {driver.name}
                </div>
            )}
            {navigator && (
                <div className="current-role">
                    <FontAwesomeIcon icon="map-signs" className="role" />
                    {navigator.name}
                </div>
            )}
        </div>
    );
};

export default CurrentMobbers;
