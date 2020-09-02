import React from 'react';
import { useMobbers } from '../context/MobbersContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './CurrentMobbers.scss';

const CurrentMobbers = () => {
    const { driver, navigator } = useMobbers();

    return (
        <div className='current-mobbers' data-private>
            {driver && (
                <div className='current-role'>
                    <FontAwesomeIcon icon='car' className='role' />
                    <div className='name'>{driver.name}</div>
                </div>
            )}
            {navigator && (
                <div className='current-role'>
                    <FontAwesomeIcon icon='map-signs' className='role' />
                    <div className='name'>{navigator.name}</div>
                </div>
            )}
        </div>
    );
};

export default CurrentMobbers;
