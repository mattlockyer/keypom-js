const { initKeypom, createDrop, createNFTSeries, addToBalance, getEnv, claim, getKeyInformation, hashPassword, formatLinkdropUrl } = require("keypom-js");
const { KeyPair, keyStores, connect } = require("near-api-js");
const { parseNearAmount } = require("near-api-js/lib/utils/format");
const path = require("path");
const homedir = require("os").homedir();
var assert = require('assert');

async function createTickDrop(){
    // STEP 1: Initiate a NEAR connection.

    // STEP 2: Create the drop with funciton call data.

    // STEP 3: Make NFT series for POAPs.
}

async function main(){
    createTickDrop()
    // Test drop logic here
}


main()

