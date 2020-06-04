import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popover from './shared/Popover';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const Clipboard = ({ position = 'bottom' }) => {
    return (
        <Popover
            text='Copied!'
            className='share'
            position={position}
            render={() => (
                <CopyToClipboard text={window.location}>
                    <FontAwesomeIcon icon='copy' />
                </CopyToClipboard>
            )}
        />
    );
};

export default Clipboard;
