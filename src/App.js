import React from "react";
import "./App.scss";
import Mobbers from "./components/Mobbers";
import Countdown from "./components/Countdown";
import { MobbersProvider } from "./context/mobbersContext";

function App() {
    return (
        <div className="App">
            <MobbersProvider>
                <Countdown />
                <Mobbers />
            </MobbersProvider>
        </div>
    );
}

export default App;
