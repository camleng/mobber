import React, { useState } from 'react';
import { useEffect } from 'react';
import './Stepper.scss';

const Stepper = ({ initialNumber = 0, onChange, minimum, unit }: Props) => {
    const [number, setNumber] = useState(initialNumber);

    useEffect(() => {
        if (onChange) onChange(number);
    }, [number, onChange]);

    const isAboveMinimum = (num: number) => minimum === undefined || num >= minimum;

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

type Props = {
    initialNumber: number,
    onChange?: (event: any) => void,
    minimum: number,
    unit?: string
}
