import React from 'react';
import './App.scss';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Brand from './components/Brand';
import { MobbersProvider } from './context/MobbersContext';
import { MobProvider } from './context/MobContext';
import { AudioProvider } from './context/AudioContext';
import Mob from './components/Mob';
import { TimerProvider } from './context/TimerContext';

function App() {
    return (
        <Router>
            <div className='App'>
                <Switch>
                    <Route exact path='/mob/:mobId'>
                        <Brand />
                    </Route>
                    <Route>
                        <Brand />
                    </Route>
                </Switch>
                <Switch>
                    <Route exact path='/'>
                        <Home />
                    </Route>
                    <Route exact path='/mob/:mobId'>
                        <MobProvider>
                            <TimerProvider>
                                <AudioProvider>
                                    <MobbersProvider>
                                        <Mob />
                                    </MobbersProvider>
                                </AudioProvider>
                            </TimerProvider>
                        </MobProvider>
                    </Route>
                    <Route path='*'>
                        <Redirect to='/' />
                    </Route>
                </Switch>
                <div></div>
            </div>
        </Router>
    );
}

export default App;
