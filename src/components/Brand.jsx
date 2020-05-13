import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Popover from "react-tiny-popover";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "./Brand.scss";

const Brand = () => {
    const history = useHistory();
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    return (
        <div className="title-bar">
            <div></div>
            <div className="title" onClick={() => history.push("/")}>
                Mobber
            </div>
            <Popover
                isOpen={isPopoverOpen}
                position={["left", "bottom"]}
                onClickOutside={() => setIsPopoverOpen(false)}
                content={<div className="popover">Copied!</div>}>
                <div className="share" onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
                    <CopyToClipboard text={window.location}>
                        <FontAwesomeIcon icon="copy" />
                    </CopyToClipboard>
                </div>
            </Popover>
        </div>
    );
};

export default Brand;
