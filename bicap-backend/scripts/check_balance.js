const axios = require('axios');

async function checkBalance() {
    // Genesis address of Solo Node (rich account)
    const address = "0xf077b491b355e64048ce21e3a6fc4751eeea77fa";
    const nodeUrl = "http://localhost:8669";

    console.log(`🔍 Đang kiểm tra số dư cho: ${address}...`);

    try {
        const response = await axios.get(`${nodeUrl}/accounts/${address}`);
        const { balance, energy } = response.data;

        // Convert from Hex to Decimal (VeChain uses 18 decimals)
        const vet = parseInt(balance, 16) / 1e18;
        const vtho = parseInt(energy, 16) / 1e18;

        console.log('------------------------------------------');
        console.log(`💎 VET (TestNet): ${vet}`);
        console.log(`🔥 VTHO (Gas): ${vtho}`);
        console.log('------------------------------------------');

        if (vet > 0 && vtho > 0) {
            console.log('✅ Ví đã có tiền! Sẵn sàng Deploy.');
        } else {
            console.log('❌ Ví vẫn đang trống (0). Bạn hãy nạp thêm nhé.');
        }
    } catch (error) {
        console.error('Lỗi khi kiểm tra số dư:', error.message);
    }
}

checkBalance();
