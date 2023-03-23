export type Theme = "dark" | "light" | "auto";

export interface ModalOptions {
  modules: any[];
  accountId: string;
  secretKey: string;
  modulesTitle?: string;
  mainTitle?: string;
  mainBody?: string;
  headerOne?: any;
  headerTwo?: any;
  button?: any;
  delimiter: string;
  theme?: Theme;
  description?: string;
  onHide?: (hideReason: "user-triggered" | "wallet-navigation") => void;
}

export interface PostTrialModules {
  name: string;
  description: string;
  iconUrl: string;
  baseRedirectUrl: string;
  delimiter?: string;
}

export interface MainBodyHeaders {
  title?: string;
  description?: string;
}

export interface MainBodyButton {
  onClick?: any;
  text?: string;
}

export interface KeypomTrialModal {
  show(modalType?: string): void;
  hide(): void;
}

export const MODAL_TYPE = {
  CLAIM_TRIAL: "claim-trial",
  TRIAL_OVER: "trial-over",
  ERROR: "action-error"
}
export const MODAL_DEFAULTS = {
  claimTrial: {
    mainBody: {
      title: "Create An Account",
      body: "Enter a username to start using the app.",
    }
  },
  trialOver: {
    mainBody: {
      title: "Your Trial Has Ended",
      body: "To continue using NEAR, secure your account with a wallet.",
      headerOne: {
        title: "Secure & Manage Your Digital Assets",
        description: "No need to create new accounts or credentials. Connect your wallet and you are good to go!"
      },
      headerTwo: {
        title: "Log In to Any NEAR App",
        description: "No need to create new accounts or credentials. Connect your wallet and you are good to go!"
      },
    },
    moduleList: {
      modulesTitle: "Choose a Wallet",
    }
  },
  error: {
    title: "Invalid Action",
    body: "Your trial does not allow you to perform this action. For more information, please contact the site administrator."
  }
}
