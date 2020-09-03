import React from 'react';
import { render, createEvent } from '@testing-library/react';
import Stepper from '../components/shared/Stepper';

describe('Stepper', () => {
    it('should return a container', () => {
        const { container } = render(<Stepper />);
        expect(container).toBeDefined();
    });

    it('defaults to 0 for the initial number if not set', () => {
        const { getByText } = render(<Stepper />);
        const el = getByText('0');
        expect(el.textContent).toEqual('0');
    });
});
