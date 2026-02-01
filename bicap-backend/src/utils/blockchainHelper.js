const { mnemonic, HDNode, Transaction, abi, secp256k1 } = require('thor-devkit');
const crypto = require('crypto');
const axios = require('axios');

// Load ABI
const BicapAbi = require('../config/abi.json');

/**
 * Real VeChain Blockchain Helper
 * Supports both Mock and Real modes via BLOCKCHAIN_MODE env
 */

const blockchainHelper = {
    /**
     * Write data to blockchain
     * @param {string} identifier - unique ID (e.g. BATCH-001)
     * @param {Object} data - Data to hash
     * @returns {Promise<string>} - Transaction Hash
     */
    writeToBlockchain: async (identifier, data) => {
        // If mode is NOT real, use mock
        if (process.env.BLOCKCHAIN_MODE !== 'real') {
            return blockchainHelper.mockWrite(identifier, data);
        }

        try {
            console.log(`[BLOCKCHAIN] Preparing real transaction for ${identifier}...`);

            // 1. Setup Wallet
            const worldMnemonic = process.env.BLOCKCHAIN_MNEMONIC.split(' ');
            const hdnode = HDNode.fromMnemonic(worldMnemonic);
            const wall = hdnode.derive(0); // Account 0

            // 2. Hash data
            const dataString = JSON.stringify(data);
            const dataHash = crypto.createHash('sha256').update(dataString).digest('hex');

            // 3. Encode Contract Call
            const contract = new abi.Function(BicapAbi.find(f => f.name === 'addRecord'));
            const clause = {
                to: process.env.BLOCKCHAIN_CONTRACT_ADDRESS,
                value: 0,
                data: contract.encode(identifier, dataHash)
            };

            // 4. Get Network Info (Block Ref & Gen Hash)
            const nodeUrl = process.env.BLOCKCHAIN_NODE_URL || 'https://testnet.veblocks.net';
            const bestBlock = (await axios.get(`${nodeUrl}/blocks/best`)).data;
            const blockRef = bestBlock.id.slice(0, 18); // 8 bytes block ref

            // 5. Build Transaction
            const tx = new Transaction({
                chainTag: parseInt(process.env.BLOCKCHAIN_CHAIN_TAG || '39'), // 39 for TestNet, 74 for MainNet
                blockRef: blockRef,
                expiration: 32, // 32 blocks
                clauses: [clause],
                gasPriceCoef: 0,
                gas: 200000, // estimated
                dependsOn: null,
                nonce: crypto.randomInt(0, 99999999)
            });

            // 6. Sign and Send
            const raw = tx.encode();
            const signature = secp256k1.sign(tx.signingHash(), wall.privateKey);
            tx.signature = signature;

            const response = await axios.post(`${nodeUrl}/transactions`, {
                raw: `0x${tx.encode().toString('hex')}`
            });

            const txHash = response.data.id;
            console.log(`[BLOCKCHAIN] Real transaction sent! TxHash: ${txHash}`);
            return txHash;

        } catch (error) {
            console.error('[BLOCKCHAIN] Error in real transaction:', error.response?.data || error.message);
            // Fallback to mock if real fails (optional, based on requirement)
            return blockchainHelper.mockWrite(identifier, data);
        }
    },

    /**
     * Mock writing data to blockchain (for development/fallback)
     */
    mockWrite: async (identifier, data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const dataString = JSON.stringify(data);
                const randomNonce = crypto.randomBytes(4).toString('hex');
                const hash = crypto.createHash('sha256').update(dataString + randomNonce).digest('hex');
                const mockTxHash = `0x${hash}`;
                console.log(`[MOCK BLOCKCHAIN] Simulated transaction for ${identifier}. TxHash: ${mockTxHash}`);
                resolve(mockTxHash);
            }, 300);
        });
    },

    /**
     * Verify data
     */
    getTransaction: async (txHash) => {
        if (process.env.BLOCKCHAIN_MODE !== 'real' || txHash.startsWith('0xmock')) {
            return { status: 'mocked', id: txHash };
        }

        try {
            const nodeUrl = process.env.BLOCKCHAIN_NODE_URL || 'https://testnet.veblocks.net';
            const response = await axios.get(`${nodeUrl}/transactions/${txHash}`);
            return response.data;
        } catch (error) {
            return null;
        }
    }
};

module.exports = blockchainHelper;
