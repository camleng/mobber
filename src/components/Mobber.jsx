import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Draggable } from 'react-beautiful-dnd';
import { strings } from '../strings';

const Mobber = ({ mobber, index, setIsEditingName }) => {
    const isCurrentUser = (name) => {
        return localStorage.getItem(strings.storageKeys.mobberNameKey) === name;
    };

    const isDriver = () => {
        return mobber.role === strings.roles.driver;
    };

    const isNavigator = () => {
        return mobber.role === strings.roles.navigator;
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
                    <div>
                        {isCurrentUser(mobber.name) && (
                            <FontAwesomeIcon
                                icon='pencil-alt'
                                onClick={() => setIsEditingName(true)}
                            />
                        )}
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default Mobber;
