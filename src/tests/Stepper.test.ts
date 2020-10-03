import React from 'react';
import { render, act } from '@testing-library/react';
import Stepper from '../components/shared/Stepper';

describe('Stepper', () => {
    it('should return a container', () => {
        const { container } = render(<Stepper />);
        expect(container).toBeDefined();
    });

    it('defaults to 0 for the initial number if not set', () => {
        const { getByText } = render(<Stepper />);
        const number = getByText('0');
        expect(number.textContent).toEqual('0');
    });

    it('should increment number when clicking on the increment button', () => {
        const { getByText } = render(<Stepper initialNumber={5} />);
        const incrementButton = getByText('+');
        incrementButton.click();
        const number = getByText('6');
        expect(number.textContent).toEqual('6');
    });

    it('should decrement number when clicking on the decrement button', () => {
        const { getByText } = render(<Stepper initialNumber={5} />);
        const decrement = getByText('-');
        decrement.click();
        const number = getByText('4');
        expect(number.textContent).toEqual('4');
    });

    it('should not decrement number when clicking on decrement number if the number were to fall below the minimum value', () => {
        const { getByText } = render(<Stepper initialNumber={5} minimum={5} />);
        const decrement = getByText('-');
        decrement.click();
        const number = getByText('5');
        expect(number.textContent).toEqual('5');
    });

    it('should call the callback when the number is changed', () => {
        const mockCallback = jest.fn();
        const { getByText } = render(
            <Stepper initialNumber={5} callback={mockCallback} />
        );
        const increment = getByText('+');

        act(() => increment.click());

        expect(mockCallback).toHaveBeenCalledWith(6);
    });
});
