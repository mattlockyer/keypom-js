"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeypomWallet = void 0;
var core_1 = require("@keypom/core");
var accounts_1 = require("@near-js/accounts");
var crypto_1 = require("@near-js/crypto");
var keystores_browser_1 = require("@near-js/keystores-browser");
var wallet_account_1 = require("@near-js/wallet-account");
var selector_utils_1 = require("../utils/selector-utils");
var ext_wallets_1 = require("./ext_wallets");
var ONE_CLICK_URL_REGEX = new RegExp("(.*)ACCOUNT_ID(.*)SECRET_KEY(.*)MODULE_ID");
var KeypomWallet = /** @class */ (function () {
    function KeypomWallet(_a) {
        var signInContractId = _a.signInContractId, networkId = _a.networkId, url = _a.url;
        var _this = this;
        this.checkValidOneClickParams = function () {
            var _a;
            console.log("CheckValidTrial");
            var oneClickData = ((_a = _this.oneClickConnectSpecs) === null || _a === void 0 ? void 0 : _a.baseUrl) !== undefined
                ? (0, selector_utils_1.parseOneClickSignInFromUrl)(_this.oneClickConnectSpecs)
                : undefined;
            return (oneClickData !== undefined || (0, selector_utils_1.getLocalStorageKeypomEnv)() !== null);
        };
        console.log("Initializing OneClick Connect");
        this.signInContractId = signInContractId;
        this.keyStore = new keystores_browser_1.BrowserLocalStorageKeyStore();
        this.near = new wallet_account_1.Near(__assign(__assign({}, core_1.networks[networkId]), { deps: { keyStore: this.keyStore } }));
        this.setSpecsFromKeypomParams(url);
    }
    KeypomWallet.prototype.getContractId = function () {
        return this.signInContractId;
    };
    KeypomWallet.prototype.getAccountId = function () {
        this.assertSignedIn();
        return this.accountId;
    };
    KeypomWallet.prototype.isSignedIn = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.accountId !== undefined && this.accountId !== null];
            });
        });
    };
    KeypomWallet.prototype.signInInstantAccount = function (accountId, secretKey, moduleId) {
        return __awaiter(this, void 0, void 0, function () {
            var account, allKeys, pk_1, keyInfoView, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        account = new accounts_1.Account(this.near.connection, accountId);
                        return [4 /*yield*/, account.getAccessKeys()];
                    case 1:
                        allKeys = _a.sent();
                        pk_1 = (0, core_1.getPubFromSecret)(secretKey);
                        keyInfoView = allKeys.find(function (_a) {
                            var public_key = _a.public_key;
                            return public_key === pk_1;
                        });
                        if (keyInfoView) {
                            return [2 /*return*/, this.internalSignIn(accountId, secretKey, moduleId)];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.log("e: ", e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, []];
                }
            });
        });
    };
    KeypomWallet.prototype.signIn = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var oneClickSignInData, curEnvData, _b, accountId, secretKey, moduleId;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, core_1.initKeypom)({
                            network: this.near.connection.networkId,
                        })];
                    case 1:
                        _c.sent();
                        oneClickSignInData = ((_a = this.oneClickConnectSpecs) === null || _a === void 0 ? void 0 : _a.baseUrl) !== undefined
                            ? (0, selector_utils_1.parseOneClickSignInFromUrl)(this.oneClickConnectSpecs)
                            : undefined;
                        if (oneClickSignInData !== undefined) {
                            if (ext_wallets_1.SUPPORTED_EXT_WALLET_DATA[this.near.connection.networkId][oneClickSignInData.moduleId] === undefined) {
                                console.warn("Module ID ".concat(oneClickSignInData.moduleId, " is not supported on ").concat(this.near.connection.networkId, "."));
                                return [2 /*return*/, []];
                            }
                            return [2 /*return*/, this.signInInstantAccount(oneClickSignInData.accountId, oneClickSignInData.secretKey, oneClickSignInData.moduleId)];
                        }
                        curEnvData = (0, selector_utils_1.getLocalStorageKeypomEnv)();
                        // If there is any data in local storage, default to that otherwise return empty array
                        if (curEnvData !== null) {
                            _b = JSON.parse(curEnvData), accountId = _b.accountId, secretKey = _b.secretKey, moduleId = _b.moduleId;
                            return [2 /*return*/, this.internalSignIn(accountId, secretKey, moduleId)];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    KeypomWallet.prototype.signOut = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.accountId === undefined || this.accountId === null) {
                            throw new Error("Wallet is already signed out");
                        }
                        this.accountId = this.secretKey = this.moduleId = undefined;
                        return [4 /*yield*/, this.keyStore.removeKey(this.near.connection.networkId, this.accountId)];
                    case 1:
                        _a.sent();
                        localStorage.removeItem("".concat(selector_utils_1.KEYPOM_LOCAL_STORAGE_KEY, ":envData"));
                        return [2 /*return*/];
                }
            });
        });
    };
    KeypomWallet.prototype.signAndSendTransaction = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var receiverId, actions, res, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.assertSignedIn();
                        console.log("sign and send txn params: ", params);
                        receiverId = params.receiverId, actions = params.actions;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.signAndSendTransactions({
                                transactions: [
                                    {
                                        signerId: this.accountId,
                                        receiverId: receiverId,
                                        actions: actions,
                                    },
                                ],
                            })];
                    case 2:
                        res = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        /// user cancelled or near network error
                        console.warn(e_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, res[0]];
                }
            });
        });
    };
    KeypomWallet.prototype.signAndSendTransactions = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var transactions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("sign and send txns params inner: ", params);
                        this.assertSignedIn();
                        transactions = params.transactions;
                        return [4 /*yield*/, (0, ext_wallets_1.extSignAndSendTransactions)({
                                transactions: transactions,
                                moduleId: this.moduleId,
                                accountId: this.accountId,
                                secretKey: this.secretKey,
                                near: this.near,
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    KeypomWallet.prototype.verifyOwner = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw Error("KeypomWallet:verifyOwner is deprecated");
            });
        });
    };
    KeypomWallet.prototype.getAvailableBalance = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: get access key allowance
                return [2 /*return*/, BigInt(0)];
            });
        });
    };
    KeypomWallet.prototype.getAccounts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var accountObj;
            return __generator(this, function (_a) {
                if (this.accountId != undefined && this.accountId != null) {
                    accountObj = new accounts_1.Account(this.near.connection, this.accountId);
                    return [2 /*return*/, [accountObj]];
                }
                return [2 /*return*/, []];
            });
        });
    };
    KeypomWallet.prototype.switchAccount = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    KeypomWallet.prototype.internalSignIn = function (accountId, secretKey, moduleId) {
        return __awaiter(this, void 0, void 0, function () {
            var dataToWrite, accountObj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("internalSignIn accountId ".concat(accountId, " secretKey ").concat(secretKey, " moduleId ").concat(moduleId));
                        this.accountId = accountId;
                        this.secretKey = secretKey;
                        this.moduleId = moduleId;
                        dataToWrite = {
                            accountId: accountId,
                            secretKey: secretKey,
                            moduleId: moduleId,
                        };
                        (0, selector_utils_1.setLocalStorageKeypomEnv)(dataToWrite);
                        return [4 /*yield*/, this.keyStore.setKey(this.near.connection.networkId, accountId, crypto_1.KeyPair.fromString(secretKey))];
                    case 1:
                        _a.sent();
                        accountObj = new accounts_1.Account(this.near.connection, accountId);
                        return [2 /*return*/, [accountObj]];
                }
            });
        });
    };
    KeypomWallet.prototype.assertSignedIn = function () {
        if (!this.accountId) {
            throw new Error("Wallet not signed in");
        }
    };
    KeypomWallet.prototype.setSpecsFromKeypomParams = function (url) {
        // Get the base URL and delimiter by splitting the URL using ACCOUNT_ID, SECRET_KEY, and MODULE_ID
        var matches = url.match(ONE_CLICK_URL_REGEX);
        var baseUrl = matches === null || matches === void 0 ? void 0 : matches[1];
        var delimiter = matches === null || matches === void 0 ? void 0 : matches[2];
        var moduleDelimiter = matches === null || matches === void 0 ? void 0 : matches[3];
        var oneClickSpecs = {
            url: url,
            baseUrl: baseUrl,
            delimiter: delimiter,
            moduleDelimiter: moduleDelimiter,
        };
        console.log("oneClickSpecs from URL: ", oneClickSpecs);
        this.oneClickConnectSpecs = oneClickSpecs;
    };
    return KeypomWallet;
}());
exports.KeypomWallet = KeypomWallet;
