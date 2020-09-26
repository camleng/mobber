import React, { useState } from 'react';
import { useEffect } from 'react';
import './Stepper.scss';

const Stepper = ({ initialNumber = 0, onChange: callback, minimum, unit }) => {
    const [number, setNumber] = useState(initialNumber);

    useEffect(() => {
        if (callback) callback(number);
    }, [number, callback]);

    const isAboveMinimum = (num) => minimum === undefined || num >= minimum;

    const decrement = () => {
        if (isAboveMinimum(number - 1)) setNumber(number - 1);
    };

    const increment = () => setNumber(number + 1);

    return (
        <div className='stepper'>
            <div onClick={decrement}>
                <div>-</div>
            </div>
            <div>
                <div>
                    {number} {unit ? unit : ''}
                </div>
            </div>
            <div onClick={increment}>
                <div>+</div>
            </div>
        </div>
    );
};

export default Stepper;
