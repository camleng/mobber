import React, { useState } from 'react';
import Mobber from './Mobber';
import RoundedRect from './shared/RoundedRect';
import { useMobbers } from '../context/MobbersContext';
import { Droppable } from 'react-beautiful-dnd';
import './Mobbers.scss';

const Mobbers = () => {
    const { mobbers, addMobber } = useMobbers();
    const [newMobberName, setNewMobberName] = useState('');

    const addMobberToMob = () => {
        addMobber(newMobberName);
        setNewMobberName('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') addMobberToMob();
    };

    return (
        <div className='mobbers-container'>
            <Droppable droppableId='mobbers'>
                {(provided) => (
                    <div
                        className='mobbers'
                        ref={provided.innerRef}
                        {...provided.droppableProps}>
                        {mobbers.map((mobber, index) => (
                            <Mobber mobber={mobber} key={mobber.name} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

            <div className='add-mobber'>
                <input
                    onChange={(e) => setNewMobberName(e.target.value)}
                    value={newMobberName}
                    onKeyUp={handleKeyPress}></input>
                <RoundedRect title='Add' className='add' onClick={addMobberToMob} />
            </div>
        </div>
    );
};

export default Mobbers;
