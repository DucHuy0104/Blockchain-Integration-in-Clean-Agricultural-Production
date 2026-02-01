const hre = require("hardhat");

async function main() {
    console.log("🚀 Bắt đầu deploy BicapTraceability lên VeChain TestNet...");

    // Lấy Contract Factory
    // Lưu ý: Tên phải khớp với tên class trong file .sol
    const BicapTraceability = await hre.ethers.getContractFactory("BicapTraceability");

    // Deploy contract
    const traceability = await BicapTraceability.deploy();

    // Chờ đợi deployment hoàn tất
    await traceability.waitForDeployment();

    console.log("✅ BicapTraceability đã được deploy thành công!");
    console.log(`📍 Địa chỉ Contract: ${traceability.target}`);
    console.log("--------------------------------------------------");
    console.log("Vui lòng lưu lại địa chỉ contract này để cấu hình cho Backend.");
}

// Xử lý lỗi
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
