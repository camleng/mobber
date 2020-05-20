import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMobbers } from '../context/MobbersContext';

const Mobber = ({ mobber }) => {
    const { removeMobber } = useMobbers();

    const isDriver = () => {
        return mobber.role === 'driver';
    };

    const isNavigator = () => {
        return mobber.role === 'navigator';
    };

    return (
        <div className={`mobber ${mobber.role}`}>
            {isDriver() && <FontAwesomeIcon icon='car' className='role' />}
            {isNavigator() && <FontAwesomeIcon icon='map-signs' className='role' />}
            {!isDriver() && !isNavigator() && <div className='role'></div>}
            <div className='name'>{mobber.name}</div>
            <FontAwesomeIcon
                icon='times'
                className='close'
                onClick={() => removeMobber(mobber)}
            />
        </div>
    );
};

export default Mobber;
