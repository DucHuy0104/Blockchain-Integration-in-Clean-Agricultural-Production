const Queue = require('bull');
const blockchainHelper = require('../utils/blockchainHelper');

/**
 * Blockchain Queue Service
 * Handles high-concurrency transactions by processing them in the background
 */

const blockchainQueue = new Queue('blockchain-transactions', {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined
    }
});

// Process jobs
blockchainQueue.process(async (job) => {
    const { identifier, data, type } = job.data;
    console.log(`[QUEUE] Processing transaction for ${identifier} (${type})...`);

    try {
        const txHash = await blockchainHelper.writeToBlockchain(identifier, data);
        console.log(`[QUEUE] Success: ${identifier}. TxHash: ${txHash}`);

        // You could update the database here with the real TxHash if needed
        return { txHash };
    } catch (error) {
        console.error(`[QUEUE] Failed: ${identifier}. Error: ${error.message}`);
        throw error; // Will trigger retry based on Bull config
    }
});

// Event listeners
blockchainQueue.on('completed', (job, result) => {
    console.log(`[QUEUE] Job ${job.id} completed with TxHash: ${result.txHash}`);
});

blockchainQueue.on('failed', (job, err) => {
    console.error(`[QUEUE] Job ${job.id} failed after ${job.attemptsMade} attempts: ${err.message}`);
});

module.exports = {
    /**
     * Add a transaction to the queue
     */
    addToQueue: async (identifier, data, type = 'generic') => {
        return await blockchainQueue.add({
            identifier,
            data,
            type,
            timestamp: new Date().toISOString()
        }, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000
            },
            removeOnComplete: true
        });
    }
};
