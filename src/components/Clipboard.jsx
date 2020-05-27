import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popover from './shared/Popover';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './Clipboard.scss';

const Clipboard = () => {
    return (
        <Popover
            text='Copied!'
            className='share'
            render={() => (
                <CopyToClipboard text={window.location}>
                    <FontAwesomeIcon icon='copy' />
                </CopyToClipboard>
            )}
        />
    );
};

export default Clipboard;
