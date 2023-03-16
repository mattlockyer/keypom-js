import type {
	WalletModuleFactory,
	WalletBehaviourFactory,
	InstantLinkWallet,
	NetworkId,
  } from "@near-wallet-selector/core";
  import type BN from "bn.js";
import { KeypomParams, KeypomWalletInstant } from "./types";
import { KeypomWallet } from "./wallet";
  
  interface KeypomInitializeOptions {
	keypomWallet: KeypomWallet;
  }
  
  const Keypom: WalletBehaviourFactory<
	KeypomWalletInstant,
	KeypomInitializeOptions
  > = async ({ logger, keypomWallet }) => {
	// return the wallet interface for wallet-selector
	return {
	  get networkId() {
		return keypomWallet.networkId;
	  },
	  getContractId() {
		return keypomWallet.getContractId();
	  },
  
	  // async getAccount() {
	  // 	return keypomWallet.getAccount();
	  // },

	  showModal() {
		keypomWallet.showModal();
	  },
  
	  async getAccounts() {
		logger.log("Keypom:account");
		return keypomWallet.getAccounts();
	  },
  
	  async switchAccount(id: string) {
		return await keypomWallet.switchAccount(id);
	  },
  
	  getAccountId() {
		logger.log("Keypom:getAccountId");
		return keypomWallet.getAccountId();
	  },
  
	  async isSignedIn() {
		logger.log("Keypom:isSignedIn");
		return await keypomWallet.isSignedIn();
	  },
  
	  async getAvailableBalance() {
		logger.log("Keypom:isSignedIn");
		return await keypomWallet.getAvailableBalance();
	  },
  
	  async verifyOwner() {
		throw Error("KeypomWallet:verifyOwner is deprecated");
	  },
  
	  async signIn() {
		logger.log("Keypom:signIn");
		return await keypomWallet.signIn();
	  },
  
	  async signOut() {
		logger.log("Keypom:signOut");
		return await keypomWallet.signOut();
	  },
  
	  async signAndSendTransaction(params) {
		return await keypomWallet.signAndSendTransaction(params);
	  },
  
	  async signAndSendTransactions({ transactions }) {
		logger.log("Keypom:signAndSendTransactions", { transactions });
		return await keypomWallet.signAndSendTransactions(transactions);
	  },
	};
  };
  
  export function setupKeypom({
	iconUrl = "",
	delimiter = "/",
	deprecated = false,
	desiredUrl = "/keypom-trial#",
	networkId,
	contractId,
	modalOptions
  }: KeypomParams): WalletModuleFactory<KeypomWalletInstant> {
	return async () => {
	  const keypomWallet = new KeypomWallet({
		contractId,
		networkId,
		desiredUrl,
		delimiter,
		modalOptions
	  });

	  // CHECK URL / LOCAL STORAGE TO SEE IF A TRIAL ACCOUNT SHOULD BE SIGNED IN
	  const shouldSignIn = keypomWallet.checkValidTrialInfo();
	  console.log('shouldSignIn: ', shouldSignIn)
  
	  return {
		id: "keypom",
		type: "instant-link",
		metadata: {
		  name: "Keypom Account",
		  description: null,
		  iconUrl,
		  deprecated,
		  available: true,
		  contractId,
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
  