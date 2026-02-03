const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    const balance = await hre.ethers.provider.getBalance(deployer.address);

    // VTHO in VeChain is at a specific address (0x0000000000000000000000000000456e65726779)
    const VTHO_ADDRESS = "0x0000000000000000000000000000456e65726779";
    const vthoAbi = ["function balanceOf(address) view returns (uint256)"];
    const vthoContract = new hre.ethers.Contract(VTHO_ADDRESS, vthoAbi, hre.ethers.provider);
    const energy = await vthoContract.balanceOf(deployer.address);

    console.log("Account address:", deployer.address);
    console.log("Account balance (VET):", hre.ethers.formatEther(balance));
    console.log("Account balance (VTHO):", hre.ethers.formatEther(energy));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
