import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popover from './shared/Popover';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const Clipboard = ({ position = 'bottom' }: Props) => {
    return (
        <Popover
            text='Invite link copied to clipboard'
            className='share'
            position={position}
            render={() => (
                <CopyToClipboard text={window.location}>
                    <FontAwesomeIcon icon='user-plus' title='Invite user to Mob' />
                </CopyToClipboard>
            )}
        />
    );
};

export default Clipboard;

type Props = {
    position?: "left" | "bottom" | "right" | "top",
}