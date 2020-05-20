import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popover from 'react-tiny-popover';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './Clipboard.scss';

const Clipboard = () => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    return (
        <Popover
            isOpen={isPopoverOpen}
            position={['left', 'bottom']}
            onClickOutside={() => setIsPopoverOpen(false)}
            content={<div className='popover'>Copied!</div>}>
            <div className='share' onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
                <CopyToClipboard text={window.location}>
                    <FontAwesomeIcon icon='copy' />
                </CopyToClipboard>
            </div>
        </Popover>
    );
};

export default Clipboard;
