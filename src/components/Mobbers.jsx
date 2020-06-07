import React, { useState, useEffect } from 'react';
import Mobber from './Mobber';
import { useMobbers } from '../context/MobbersContext';
import { Droppable } from 'react-beautiful-dnd';
import { determineScreenSizeCategory, addResizeCallback } from '../services/screenSize';
import { toast } from 'react-toastify';

import './Mobbers.scss';

const Mobbers = ({ name, sessionId }) => {
    const { mobbers, addMobber, removeMobber } = useMobbers();
    const [screenSize, setScreenSize] = useState(determineScreenSizeCategory());

    useEffect(() => {
        addResizeCallback((category) => {
            setScreenSize(category);
        });
    }, []);

    return (
        <div className='mobbers-container'>
            <Droppable
                droppableId='mobbers'
                direction={screenSize === 'tablet' ? 'horizontal' : 'vertical'}>
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
        </div>
    );
};

export default Mobbers;
