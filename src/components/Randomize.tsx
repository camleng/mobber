import React from 'react';
import Popover from './shared/Popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Randomize = ({ randomize, position = 'bottom', disabled = false }: Props) => {
    return (
        <Popover
            text={disabled ? '' : 'Randomized'}
            className='randomize'
            position={position}
            render={() => (
                <div onClick={disabled ? undefined : randomize}>
                    <FontAwesomeIcon
                        icon='dice'
                        title='Randomize Mobbers'
                        className={disabled ? 'disabled' : ''}
                    />
                </div>
            )}
        />
    );
};

export default Randomize;

type Props = {
    randomize: () => void,
    position?: "left" | "bottom" | "right" | "top",
    disabled?: boolean
}