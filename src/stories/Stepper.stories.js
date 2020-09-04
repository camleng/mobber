import React from 'react';
import Stepper from '../components/shared/Stepper';
import { action } from '@storybook/addon-actions';

export default {
    title: 'Stepper',
    component: Stepper,
};

export const Default = () => <Stepper />;

export const InitialNumber = () => <Stepper initialNumber={15} />;

export const MinimumNumber = () => <Stepper initialNumber={10} minimum={7} />;

export const Callback = () => <Stepper callback={action('callback')} />;
