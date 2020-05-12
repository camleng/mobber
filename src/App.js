import React from "react";
import "./App.scss";
import { MobbersProvider } from "./context/MobbersContext";
import Home from "./components/Home";
import { BrowserRouter as Router, Route } from "react-router-dom";
import MobbingSession from "./components/MobbingSession";
import Brand from "./components/Brand";
import { SessionProvider } from "./context/SessionContext";

function App() {
    return (
        <Router>
            <div className="App">
                <Brand />
                <Route exact={true} path="/">
                    <Home />
                </Route>
                <Route path="/session/:sessionId">
                    <SessionProvider>
                        <MobbersProvider>
                            <MobbingSession />
                        </MobbersProvider>
                    </SessionProvider>
                </Route>
            </div>
        </Router>
    );
}

export default App;
