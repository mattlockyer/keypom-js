import React from "react";
import {
    MODAL_DEFAULTS,
    OffboardingWallet,
    OffboardingWalletCustomizations,
} from "../modal.types";

interface OffboardingWalletsProps {
    customizations?: OffboardingWalletCustomizations;
    wallets: OffboardingWallet[];
    accountId: string;
    secretKey: string;
}

export const OffboardingWallets: React.FC<OffboardingWalletsProps> = ({
    customizations,
    wallets,
    accountId,
    secretKey,
}) => {
    function renderOptionsList(walletsToRender: OffboardingWallet[]) {
        return walletsToRender.reduce<Array<JSX.Element>>(
            (result, wallet, index) => {
                const { name, description, iconUrl, redirectUrl } = wallet;

                const mapObj = {
                    ACCOUNT_ID: accountId,
                    SECRET_KEY: secretKey,
                };
                const url = redirectUrl.replace(
                    /\b(?:SECRET_KEY|ACCOUNT_ID)\b/gi,
                    (matched) => mapObj[matched]
                );

                result.push(
                    <li
                        tabIndex={0}
                        className={`single-wallet sidebar ${wallet.name}`}
                        key={wallet.name}
                        onClick={() => {
                            window.open(url, "_blank");
                        }}
                    >
                        <div className="icon">
                            <img src={iconUrl} alt={name} />
                        </div>
                        <div className="content">
                            <div className="title">{name}</div>
                            <div className="description">{description}</div>
                        </div>
                    </li>
                );

                return result;
            },
            []
        );
    }

    return (
        <div>
            <div className="modal-left-title">
                <h2>
                    {customizations?.title ||
                        MODAL_DEFAULTS.trialOver.offboardingOptions.title}
                </h2>
            </div>
            <div className="wallet-options-wrapper">
                <div className="options-list">{renderOptionsList(wallets)}</div>
            </div>
        </div>
    );
};
