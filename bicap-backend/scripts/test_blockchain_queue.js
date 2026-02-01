const blockchainQueue = require('../src/services/blockchainQueue');
require('dotenv').config();

async function testQueue() {
    console.log('--- 📨 Testing Blockchain Transaction Queueing (Bull + Redis) ---');

    // Simulate high volume (3 transactions at once)
    const items = [
        { id: 'QUEUE-001', data: { detail: 'Batch A' } },
        { id: 'QUEUE-002', data: { detail: 'Batch B' } },
        { id: 'QUEUE-003', data: { detail: 'Batch C' } }
    ];

    console.log(`[TEST] Adding ${items.length} items to queue...`);

    for (const item of items) {
        await blockchainQueue.addToQueue(item.id, item.data, 'test_concurrency');
        console.log(`[TEST] Added ${item.id} to queue.`);
    }

    console.log('--- ⏳ Waiting for processing (Check logs above) ---');
    console.log('Note: Processing might take 10-20s depending on block time.');
}

testQueue();
