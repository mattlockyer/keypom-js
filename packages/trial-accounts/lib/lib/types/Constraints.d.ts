/**
 * Specifies usage constraints like max contracts and methods.
 */
export interface UsageConstraints {
    maxContracts?: number;
    maxMethods?: number;
    maxTokenTransfer?: string;
    rateLimitPerMinute?: number;
    blacklistedAddresses: string[];
}
/**
 * Defines interaction limits for trial accounts.
 */
export interface InteractionLimits {
    maxInteractionsPerDay?: number;
    totalInteractions?: number;
}
/**
 * Represents a function success condition based on output.
 */
export interface FunctionSuccessCondition {
    contractId: string;
    methodName: string;
    expectedReturn: string;
}
/**
 * Conditions under which the trial account will exit.
 */
export interface ExitConditions {
    transactionLimit?: number;
    successCondition?: FunctionSuccessCondition;
    timeLimit?: number;
}
