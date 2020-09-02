import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import './Brand.scss';

const Brand = () => {
    const history = useHistory();
    const { mobId } = useParams();

    return (
        <div className='title-bar'>
            <div>
                <div className='title' onClick={() => history.push('/')}>
                    Mobber
                </div>
                {mobId && <div className='mob-id'>Mob ID: {mobId}</div>}
            </div>
        </div>
    );
};

export default Brand;
