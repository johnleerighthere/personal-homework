import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { EmailShareButton, TelegramShareButton, WhatsappShareButton } from 'react-share';
import { EmailIcon, TelegramIcon, WhatsappIcon } from "react-share";

class Share extends React.Component {
    render() {
        return (
            <div>

                <EmailShareButton>
                    <FontAwesomeIcon
                        icon={faEnvelope}
                    />
                </EmailShareButton>
                <TelegramShareButton>
                    <TelegramIcon size={32} round={true} />
                </TelegramShareButton>
                <WhatsappShareButton title="test msg" url="https://github.com">
                    <WhatsappIcon size={32} round={true} />
                </WhatsappShareButton>

            </div>
        )
    }
}

export default Share