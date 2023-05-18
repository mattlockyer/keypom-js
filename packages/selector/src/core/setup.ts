import type {
    Transaction,
    WalletBehaviourFactory, WalletModuleFactory
} from '@near-wallet-selector/core';
import { MODAL_TYPE_IDS } from '../modal/src/lib/modal.types';
import { KEYPOM_MODULE_ID, KeypomParams, KeypomWalletInstant } from './types';
import { KeypomWallet } from './wallet';

interface KeypomInitializeOptions {
	keypomWallet: KeypomWallet;
}

const Keypom: WalletBehaviourFactory<
	KeypomWalletInstant,
	KeypomInitializeOptions
> = async ({ store, logger, keypomWallet }) => {
    // return the wallet interface for wallet-selector
    return {
        get networkId() {
            return keypomWallet.near.connection.networkId;
        },
        getContractId() {
            return keypomWallet.getContractId();
        },

        // async getAccount() {
        // 	return keypomWallet.getAccount();
        // },

        showModal(modalType = {id: MODAL_TYPE_IDS.TRIAL_OVER}) {
            keypomWallet.showModal(modalType);
        },

        async getAccounts() {
            logger.log('Keypom:account');
            return keypomWallet.getAccounts();
        },

        async switchAccount(id: string) {
            return await keypomWallet.switchAccount(id);
        },

        getAccountId() {
            logger.log('Keypom:getAccountId');
            return keypomWallet.getAccountId();
        },

        async isSignedIn() {
            logger.log('Keypom:isSignedIn');
            return await keypomWallet.isSignedIn();
        },

        async getAvailableBalance() {
            logger.log('Keypom:isSignedIn');
            return await keypomWallet.getAvailableBalance();
        },

        async verifyOwner() {
            throw Error('KeypomWallet:verifyOwner is deprecated');
        },

        async signIn() {
            logger.log('Keypom:signIn');
            return await keypomWallet.signIn();
        },

        async signOut() {
            logger.log('Keypom:signOut');
            return await keypomWallet.signOut();
        },

        async signAndSendTransaction(params) {
            return await keypomWallet.signAndSendTransaction(params);
        },

        async signAndSendTransactions(params) {
            // Convert the params to Array<Transaction>

            const transactions: Transaction[] = params.transactions.map((tx) => {
                return {
                    ...tx,
                    signerId: tx.signerId || keypomWallet.getAccountId(),
                };
            });

            logger.log('Keypom:signAndSendTransactions', params);
            return await keypomWallet.signAndSendTransactions({transactions});
        },
    };
};

export function setupKeypom({
    trialAccountSpecs,
    instantSignInSpecs,
    networkId,
    signInContractId
}: KeypomParams): WalletModuleFactory<KeypomWalletInstant> {
    return async () => {
        if (!signInContractId || !networkId || !(instantSignInSpecs || trialAccountSpecs)) {
            console.warn('KeypomWallet: signInContractId, networkId and either instant sign in specs or trial account specs are required to use the KeypomWallet.');
            return null;
        }
		
        const keypomWallet = new KeypomWallet({
            signInContractId,
            networkId,
            trialAccountSpecs,
            instantSignInSpecs
        });

        // CHECK URL / LOCAL STORAGE TO SEE IF A TRIAL ACCOUNT SHOULD BE SIGNED IN
        const shouldSignIn = keypomWallet.checkValidTrialInfo();
        console.log('shouldSignIn: ', shouldSignIn);

        return {
            id: KEYPOM_MODULE_ID,
            type: 'instant-link',
            metadata: {
                name: 'Keypom Account',
                description: null,
                iconUrl: '',
                deprecated: false,
                available: true,
                contractId: signInContractId,
                runOnStartup: shouldSignIn,
            },
            init: async (config) =>
                Keypom({
                    ...config,
                    keypomWallet,
                }),
        };
    };
}
