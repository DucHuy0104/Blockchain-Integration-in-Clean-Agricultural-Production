require("@nomicfoundation/hardhat-toolbox");
require("@vechain/sdk-hardhat-plugin");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    vechain_solo: {
      url: "http://127.0.0.1:8669",
      accounts: {
        mnemonic: "denial kitchen pet squirrel other broom bar gas better priority spoil cross",
        count: 10,
        path: "m/44'/818'/0'/0",
      },
    }
  }
};
