import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMobbers } from '../context/MobbersContext';
import { Draggable } from 'react-beautiful-dnd';

const Mobber = ({ mobber, index }) => {
    const { removeMobber } = useMobbers();

    const isDriver = () => {
        return mobber.role === 'driver';
    };

    const isNavigator = () => {
        return mobber.role === 'navigator';
    };

    return (
        <Draggable draggableId={mobber.name} index={index}>
            {(provided) => (
                <div
                    className={`mobber ${mobber.role}`}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}>
                    {isDriver() && <FontAwesomeIcon icon='car' className='role' />}
                    {isNavigator() && (
                        <FontAwesomeIcon icon='map-signs' className='role' />
                    )}
                    {!isDriver() && !isNavigator() && <div className='role'></div>}
                    <div className='name'>{mobber.name}</div>
                    <FontAwesomeIcon
                        icon='times'
                        className='close'
                        onClick={() => removeMobber(mobber.name)}
                    />
                </div>
            )}
        </Draggable>
    );
};

export default Mobber;
