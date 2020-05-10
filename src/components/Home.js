import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import RoundedRect from "./RoundedRect";
import "./Home.scss";

const Home = () => {
    const [sessionId, setSessionId] = useState();
    const history = useHistory();

    return (
        <div>
            <div className="connect-to-session">
                <label>Connect to an existing session</label>
                <div>
                    <input
                        onChange={(e) => setSessionId(e.target.value)}
                        value={sessionId}></input>
                    <RoundedRect
                        title="Connect"
                        className="connect"
                        onClick={() => history.push(`/session/${sessionId}`)}
                    />
                </div>
            </div>
            <p className="or">or</p>
            <div className="create-session">
                <label>Create a new session</label>
                <div>
                    <RoundedRect
                        title="Create"
                        className="create"
                        onClick={() => history.push("/session/1234")}
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
