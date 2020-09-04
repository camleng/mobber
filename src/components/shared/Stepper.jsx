import React, { useState } from 'react';
import { useEffect } from 'react';
import './Stepper.scss';

const Stepper = ({ initialNumber = 0, callback, minimum }) => {
    const [number, setNumber] = useState(initialNumber);

    useEffect(() => {
        if (callback && number !== initialNumber) callback(number);
    }, [number]);

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
                <div>{number}</div>
            </div>
            <div onClick={increment}>
                <div>+</div>
            </div>
        </div>
    );
};

export default Stepper;
