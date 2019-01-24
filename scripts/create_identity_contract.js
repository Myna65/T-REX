const { deployIdentityContract } = require('./helpers/identity');

module.exports = async (callback) => {
  try {
    if (process.argv.find(arg => arg === '--help')) {
      console.log(`Usage: truffle exec scripts/create_identity_contract.js [--network networkName] [--help] [--from fromAddress] [--transferOwnership newOwnerAddress]`);
      callback();
    }

    let from = null;
    let newOwner = null;

    {
      const fromOptionLocation = process.argv.findIndex(arg => arg === '--from');

      if (fromOptionLocation !== -1) {
        from = process.argv[fromOptionLocation + 1];
        if (!from || !from.startsWith('0x')) {
          callback('Error: From Address not found');
        }
      }
    }

    {
      const newOwnerOptionLocation = process.argv.findIndex(arg => arg === '--transferOwnership');

      if (newOwnerOptionLocation !== -1) {
        newOwner = process.argv[newOwnerOptionLocation + 1];
        if (!newOwner || !newOwner.startsWith('0x')) {
          callback('Error: New Owner Address not found');
        }
      }
    }

    const contract = await deployIdentityContract({ web3, artifacts }, { from, newOwner });

    callback();
  } catch (e) {
    callback(e);
  }
};
