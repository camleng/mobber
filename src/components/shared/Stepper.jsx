import React, { useState } from 'react';
import './Stepper.scss';
import { useEffect } from 'react';

const Stepper = ({ initialNumber = 0, callback }) => {
    const [number, setNumber] = useState(initialNumber);

    useEffect(() => {
        if (callback) callback(number);
    }, [number]);

    const decrement = () => setNumber(number - 1);
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
