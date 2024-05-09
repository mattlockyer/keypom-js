"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteKeys = exports.addKeys = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const utils_1 = require("@near-js/utils");
const checks_1 = require("./checks");
const keypom_1 = require("./keypom");
const keypom_utils_1 = require("./keypom-utils");
const views_1 = require("./views");
const transactions_1 = require("@near-js/transactions");
/**
 * Add keys that are manually generated and passed in, or automatically generated to an existing drop. If they're
 * automatically generated, they can be based off a set of entropy. For NFT and FT drops, assets can automatically be sent to Keypom to register keys as part of the payload.
 * The deposit is estimated based on parameters that are passed in and the transaction can be returned instead of signed and sent to the network. This can allow you to get the
 * required deposit from the return value and use that to fund the account's Keypom balance to avoid multiple transactions being signed in the case of a drop with many keys.
 *
 * @return {Promise<CreateOrAddReturn>} Object containing: the drop ID, the responses of the execution, as well as any auto generated keys (if any).
 *
 * @example
 * Create a basic empty simple drop and add 10 keys. Each key is completely random:
 * ```js
 * // Initialize the SDK for the given network and NEAR connection. No entropy passed in so any auto generated keys will
 * // be completely random unless otherwise overwritten.
 * await initKeypom({
 * 	network: "testnet",
 * 	funder: {
 * 		accountId: "benji_demo.testnet",
 * 		secretKey: "ed25519:5yARProkcALbxaSQ66aYZMSBPWL9uPBmkoQGjV3oi2ddQDMh1teMAbz7jqNV9oVyMy7kZNREjYvWPqjcA6LW9Jb1"
 * 	}
 * });
 *
 * // Create an empty simple drop with no keys.
 * const {dropId} = await createDrop({
 * 	depositPerUseNEAR: 1,
 * });
 *
 * // Add 10 completely random keys. The return value `keys` contains information about the generated keys
 * const {keys} = await addKeys({
 * 	dropId,
 * 	numKeys: 10
 * })
 *
 * console.log('public keys: ', keys.publicKeys);
 * console.log('private keys: ', keys.secretKeys);
 * ```
 *
 * @example
 * Init funder with root entropy, create empty drop and add generate deterministic keys. Compare with manually generated keys:
 * ```js
 * // Initialize the SDK for the given network and NEAR connection. Root entropy is passed into the funder account so any generated keys
 * // Will be based off that entropy.
 * await initKeypom({
 * 	network: "testnet",
 * 	funder: {
 * 		accountId: "benji_demo.testnet",
 * 		secretKey: "ed25519:5yARProkcALbxaSQ66aYZMSBPWL9uPBmkoQGjV3oi2ddQDMh1teMAbz7jqNV9oVyMy7kZNREjYvWPqjcA6LW9Jb1",
 * 		rootEntropy: "my-global-secret-password"
 * 	}
 * });
 *
 * // Create a simple drop with no keys
 * const { dropId } = await createDrop({
 * 	depositPerUseNEAR: 1,
 * });
 *
 * // Add 5 keys to the empty simple drop. Each key will be derived based on the rootEntropy of the funder, the drop ID, and key nonce.
 * const {keys: keysFromDrop} = await addKeys({
 * 	dropId,
 * 	numKeys: 5
 * })
 *
 * // Deterministically Generate the Private Keys:
 * const nonceDropIdMeta = Array.from({length: 5}, (_, i) => `${dropId}_${i}`);
 * const manualKeys = await generateKeys({
 * 	numKeys: 5,
 * 	rootEntropy: "my-global-secret-password",
 * 	metaEntropy: nonceDropIdMeta
 * })
 *
 * // Get the public and private keys from the keys generated by addKeys
 * const {publicKeys, secretKeys} = keysFromDrop;
 * // Get the public and private keys from the keys that were manually generated
 * const {publicKeys: pubKeysGenerated, secretKeys: secretKeysGenerated} = manualKeys;
 * // These should match!
 * console.log('secretKeys: ', secretKeys)
 * console.log('secretKeysGenerated: ', secretKeysGenerated)
 *
 * // These should match!
 * console.log('publicKeys: ', publicKeys)
 * console.log('pubKeysGenerated: ', pubKeysGenerated)
 * ```
 *
 * @example
 * Create an empty drop and add manually created keys:
 * ```js
 * // Initialize the SDK for the given network and NEAR connection. No entropy passed in so any auto generated keys will
 * // be completely random unless otherwise overwritten.
 * await initKeypom({
 * 	network: "testnet",
 * 	funder: {
 * 		accountId: "benji_demo.testnet",
 * 		secretKey: "ed25519:5yARProkcALbxaSQ66aYZMSBPWL9uPBmkoQGjV3oi2ddQDMh1teMAbz7jqNV9oVyMy7kZNREjYvWPqjcA6LW9Jb1"
 * 	}
 * });
 *
 * // Create an empty simple drop using the keys that were generated. Since keys are passed in, the return value won't contain information about the keys.
 * const {dropId} = await createDrop({
 * 	publicKeys,
 * 	depositPerUseNEAR: 1,
 * });
 *
 * // Generate 10 random keys
 * const {publicKeys} = await generateKeys({
 * 	numKeys: 10
 * });
 *
 * // Add keys to the drop using the keys that were generated. Since keys are passed in, the return value won't contain information about the keys.
 * await addKeys({
 * 	publicKeys,
 * 	dropId
 * })
 * ```
 * @group Creating, And Claiming Drops
 */
const addKeys = ({ account, wallet, dropId, drop, numKeys, publicKeys, nftTokenIds, rootEntropy, basePassword, passwordProtectedUses, extraDepositNEAR, extraDepositYocto, useBalance = false, returnTransactions = false, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { near, gas, contractId, receiverId, getAccount, execute, fundingAccountDetails, } = (0, keypom_1.getEnv)();
    (0, checks_1.assert)((0, checks_1.isValidAccountObj)(account), "Passed in account is not a valid account object.");
    (0, checks_1.assert)(drop || dropId, "Either a dropId or drop object must be passed in.");
    (0, checks_1.assert)(numKeys || (publicKeys === null || publicKeys === void 0 ? void 0 : publicKeys.length), "Either pass in publicKeys or set numKeys to a positive non-zero value.");
    (0, checks_1.assert)((0, checks_1.isSupportedKeypomContract)(contractId) === true, "Only the latest Keypom contract can be used to call this methods. Please update the contract");
    account = yield getAccount({ account, wallet });
    const pubKey = yield account.connection.signer.getPublicKey(account.accountId, account.connection.networkId);
    const { drop_id, owner_id, required_gas, deposit_per_use, config, ft: ftData, nft: nftData, fc: fcData, next_key_id, } = drop || (yield (0, views_1.getDropInformation)({ dropId: dropId }));
    dropId = drop_id;
    const uses_per_key = (config === null || config === void 0 ? void 0 : config.uses_per_key) || 1;
    // If the contract is v1-3 or lower, just check if owner is the same as the calling account. If it's v1-4 or higher, check if the calling account has the permission to add keys.
    if (!contractId.includes("v1-4.keypom")) {
        (0, checks_1.assert)(owner_id === account.accountId, "Calling account is not the owner of this drop.");
    }
    else {
        const canAddKeys = yield (0, views_1.canUserAddKeys)({
            accountId: account.accountId,
            dropId,
        });
        (0, checks_1.assert)(canAddKeys == true, "Calling account does not have permission to add keys to this drop.");
    }
    // If there are no publicKeys being passed in, we should generate our own based on the number of keys
    let keys;
    if (!publicKeys) {
        // Default root entropy is what is passed in. If there wasn't any, we should check if the funding account contains some.
        const rootEntropyUsed = rootEntropy || (fundingAccountDetails === null || fundingAccountDetails === void 0 ? void 0 : fundingAccountDetails.rootEntropy);
        // If either root entropy was passed into the function or the funder has some set, we should use that.
        if (rootEntropyUsed) {
            // Create an array of size numKeys with increasing strings from next_key_id -> next_key_id + numKeys - 1. Each element should also contain the dropId infront of the string
            const nonceDropIdMeta = Array.from({ length: numKeys }, (_, i) => `${drop_id}_${next_key_id + i}`);
            keys = yield (0, keypom_utils_1.generateKeys)({
                numKeys,
                rootEntropy: rootEntropyUsed,
                metaEntropy: nonceDropIdMeta,
            });
        }
        else {
            // No entropy is provided so all keys should be fully random
            keys = yield (0, keypom_utils_1.generateKeys)({
                numKeys,
            });
        }
        publicKeys = keys.publicKeys;
    }
    numKeys = publicKeys.length;
    (0, checks_1.assert)(numKeys <= 100, "Cannot add more than 100 keys at once");
    let passwords;
    if (basePassword) {
        (0, checks_1.assert)(numKeys <= 50, "Cannot add more than 50 keys at once with passwords");
        // Generate the passwords with the base password and public keys. By default, each key will have a unique password for all of its uses unless passwordProtectedUses is passed in
        passwords = yield (0, keypom_utils_1.generatePerUsePasswords)({
            publicKeys: publicKeys,
            basePassword,
            uses: passwordProtectedUses ||
                Array.from({ length: uses_per_key }, (_, i) => i + 1),
        });
    }
    const camelFTData = (0, keypom_utils_1.toCamel)(ftData);
    const camelFCData = (0, keypom_utils_1.toCamel)(fcData);
    let requiredDeposit = yield (0, keypom_utils_1.estimateRequiredDeposit)({
        near: near,
        depositPerUse: deposit_per_use,
        numKeys,
        usesPerKey: uses_per_key,
        attachedGas: parseInt(required_gas),
        storage: (0, utils_1.parseNearAmount)("0.2"),
        fcData: camelFCData,
        ftData: camelFTData,
    });
    // If there is any extra deposit needed, add it to the required deposit
    extraDepositYocto = extraDepositYocto
        ? new bn_js_1.default(extraDepositYocto)
        : new bn_js_1.default("0");
    if (extraDepositNEAR) {
        extraDepositYocto = new bn_js_1.default((0, utils_1.parseNearAmount)(extraDepositNEAR.toString()));
    }
    requiredDeposit = new bn_js_1.default(requiredDeposit).add(extraDepositYocto).toString();
    let hasBalance = false;
    if (useBalance) {
        const userBal = new bn_js_1.default(yield (0, views_1.getUserBalance)({ accountId: account.accountId }));
        if (userBal.lt(new bn_js_1.default(requiredDeposit))) {
            throw new Error("Insufficient balance on Keypom to create drop. Use attached deposit instead.");
        }
        hasBalance = true;
    }
    let transactions = [];
    const txn = yield (0, keypom_utils_1.convertBasicTransaction)({
        txnInfo: {
            receiverId,
            signerId: account.accountId,
            actions: [
                {
                    enum: "FunctionCall",
                    functionCall: {
                        methodName: "add_keys",
                        args: (0, transactions_1.stringifyJsonOrBytes)({
                            drop_id,
                            public_keys: publicKeys,
                            passwords_per_use: passwords,
                        }),
                        gas: BigInt(gas),
                        deposit: !hasBalance
                            ? BigInt(requiredDeposit)
                            : undefined,
                    },
                },
            ],
        },
        signerId: account.accountId,
        signerPk: pubKey,
    });
    transactions.push(txn);
    if (ftData === null || ftData === void 0 ? void 0 : ftData.contract_id) {
        transactions.push((yield (0, keypom_utils_1.ftTransferCall)({
            account: account,
            contractId: ftData.contract_id,
            absoluteAmount: new bn_js_1.default(ftData.balance_per_use)
                .mul(new bn_js_1.default(numKeys))
                .mul(new bn_js_1.default(uses_per_key))
                .toString(),
            dropId: drop_id,
            returnTransaction: true,
        })));
    }
    const tokenIds = nftTokenIds;
    if (nftData && tokenIds && (tokenIds === null || tokenIds === void 0 ? void 0 : tokenIds.length) > 0) {
        if (tokenIds.length > 2) {
            throw new Error("You can only automatically register 2 NFTs with 'createDrop'. If you need to register more NFTs you can use the method 'nftTransferCall' after you create the drop.");
        }
        const nftTXs = (yield (0, keypom_utils_1.nftTransferCall)({
            account: account,
            contractId: nftData.contract_id,
            tokenIds,
            dropId: dropId.toString(),
            returnTransactions: true,
        }));
        transactions = transactions.concat(nftTXs);
    }
    if (returnTransactions) {
        return { keys, dropId: drop_id, transactions, requiredDeposit };
    }
    const responses = yield execute({ transactions, account, wallet });
    return { responses, dropId: drop_id, keys, requiredDeposit };
});
exports.addKeys = addKeys;
/**
 * Delete a set of keys from a drop and optionally withdraw any remaining balance you have on the Keypom contract.
 *
 * @example
 * Create a drop with 5 keys and delete the first one:
 * ```js
 * // Initialize the SDK for the given network and NEAR connection
 * await initKeypom({
 * 	network: "testnet",
 * 	funder: {
 * 		accountId: "benji_demo.testnet",
 * 		secretKey: "ed25519:5yARProkcALbxaSQ66aYZMSBPWL9uPBmkoQGjV3oi2ddQDMh1teMAbz7jqNV9oVyMy7kZNREjYvWPqjcA6LW9Jb1"
 * 	}
 * });
 *
 * // Create the simple drop with 5 random keys
 * const {keys, dropId} = await createDrop({
 * 	numKeys: 5,
 * 	depositPerUseNEAR: 1,
 * });
 *
 * await deleteKeys({
 * 	dropId,
 * 	publicKeys: keys.publicKeys[0] // Can be wrapped in an array as well
 * })
 * ```
 * @group Deleting State
 */
const deleteKeys = ({ account, wallet, publicKeys, dropId, withdrawBalance = false, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiverId, execute, getAccount, contractId } = (0, keypom_1.getEnv)();
    (0, checks_1.assert)((0, checks_1.isSupportedKeypomContract)(contractId) === true, "Only the latest Keypom contract can be used to call this methods. Please update the contract");
    const { owner_id, drop_id, registered_uses, ft, nft } = yield (0, views_1.getDropInformation)({ dropId });
    (0, checks_1.assert)((0, checks_1.isValidAccountObj)(account), "Passed in account is not a valid account object.");
    account = yield getAccount({ account, wallet });
    (0, checks_1.assert)(owner_id == account.accountId, "Only the owner of the drop can delete keys.");
    const actions = [];
    if ((ft || nft) && registered_uses > 0) {
        actions.push({
            enum: "FunctionCall",
            functionCall: {
                methodName: "refund_assets",
                args: (0, transactions_1.stringifyJsonOrBytes)({
                    drop_id,
                }),
                gas: BigInt("100000000000000"),
                deposit: BigInt("0"),
            },
        });
    }
    // If the publicKeys provided is not an array (simply the string for 1 key), we convert it to an array of size 1 so that we can use the same logic for both cases
    if (publicKeys && !Array.isArray(publicKeys)) {
        publicKeys = [publicKeys];
    }
    actions.push({
        enum: "FunctionCall",
        functionCall: {
            methodName: "delete_keys",
            args: (0, transactions_1.stringifyJsonOrBytes)({
                drop_id,
                public_keys: publicKeys.map(keypom_utils_1.key2str),
            }),
            gas: BigInt("100000000000000"),
            deposit: BigInt("0"),
        },
    });
    if (withdrawBalance) {
        actions.push({
            enum: "FunctionCall",
            functionCall: {
                methodName: "withdraw_from_balance",
                args: (0, transactions_1.stringifyJsonOrBytes)({}),
                gas: BigInt("100000000000000"),
                deposit: BigInt("0"),
            },
        });
    }
    const transactions = [
        {
            receiverId,
            actions,
        },
    ];
    return execute({ transactions, account, wallet });
});
exports.deleteKeys = deleteKeys;
