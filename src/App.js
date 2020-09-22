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
                    <MobProvider>
                        <MobbersProvider>
                            <Route exact path='/'>
                                <Home />
                            </Route>
                            <Route exact path='/mob/:mobId'>
                                <TimerProvider>
                                    <AudioProvider>
                                        <Mob />
                                    </AudioProvider>
                                </TimerProvider>
                            </Route>
                        </MobbersProvider>
                    </MobProvider>
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
