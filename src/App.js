import React from 'react';
import './App.scss';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Brand from './components/Brand';
import { MobbersProvider } from './context/MobbersContext';
import { SessionProvider } from './context/SessionContext';
import { AudioProvider } from './context/AudioContext';
import MobbingSession from './components/MobbingSession';

function App() {
    return (
        <Router>
            <div className='App'>
                <Brand />
                <Switch>
                    <Route exact path='/'>
                        <Home />
                    </Route>
                    <Route exact path='/session/:sessionId'>
                        <SessionProvider>
                            <AudioProvider>
                                <MobbersProvider>
                                    <MobbingSession />
                                </MobbersProvider>
                            </AudioProvider>
                        </SessionProvider>
                    </Route>
                    <Route path='*'>
                        <Redirect to='/' />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
