import React from 'react';
import './App.scss';
import { MobbersProvider } from './context/MobbersContext';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import MobbingSession from './components/MobbingSession';
import Brand from './components/Brand';
import { SessionProvider } from './context/SessionContext';

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
                            <MobbersProvider>
                                <MobbingSession />
                            </MobbersProvider>
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
