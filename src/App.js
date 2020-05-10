import React from "react";
import "./App.scss";
import { MobbersProvider } from "./context/mobbersContext";
import Home from "./components/Home";
import { BrowserRouter as Router, Route } from "react-router-dom";
import MobbingSession from "./components/MobbingSession";
import Brand from "./components/Brand";

function App() {
    return (
        <Router>
            <div className="App">
                <Brand />
                <Route exact={true} path="/">
                    <Home />
                </Route>
                <Route path="/session/:sessionId">
                    <MobbersProvider>
                        <MobbingSession />
                    </MobbersProvider>
                </Route>
            </div>
        </Router>
    );
}

export default App;
