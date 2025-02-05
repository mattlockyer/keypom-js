"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOneClickParams = exports.FAILED_EXECUTION_OUTCOME = void 0;
exports.FAILED_EXECUTION_OUTCOME = {
    final_execution_status: "NONE",
    status: {
        Failure: {
            error_message: "Invalid Trial Action",
            error_type: "keypom-trial-error",
        },
    },
    transaction: {},
    transaction_outcome: {
        id: "",
        outcome: {
            logs: [],
            receipt_ids: [],
            tokens_burnt: "0",
            executor_id: "",
            gas_burnt: 0,
            status: {
                Failure: {
                    error_message: "Invalid Trial Action",
                    error_type: "keypom-trial-error",
                },
            },
        },
    },
    receipts_outcome: [
        {
            id: "",
            outcome: {
                logs: [],
                receipt_ids: [],
                gas_burnt: 0,
                tokens_burnt: "0",
                executor_id: "",
                status: {
                    Failure: {
                        error_message: "Invalid Trial Action",
                        error_type: "keypom-trial-error",
                    },
                },
            },
        },
    ],
};
const isOneClickParams = (params) => typeof params.networkId === "string" &&
    (params.networkId === "testnet" || params.networkId === "mainnet");
exports.isOneClickParams = isOneClickParams;
