import React from 'react';
import { useHistory } from 'react-router-dom';

const Brand = () => {
    const history = useHistory();

    return (
        <div className='title-bar'>
            <div className='title' onClick={() => history.push('/')}>
                Mobber
            </div>
        </div>
    );
};

export default Brand;
