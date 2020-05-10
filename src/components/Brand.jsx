import React from "react";
import { useHistory } from "react-router-dom";

const Brand = () => {
    const history = useHistory();

    return (
        <div className="title" onClick={() => history.push("/")}>
            Mobber
        </div>
    );
};

export default Brand;
