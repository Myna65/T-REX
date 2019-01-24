async function deployTrustedIssuersRegistry({ web3, artifacts }, { from, newOwner } = {}) {

  from = from || web3.eth.accounts[0];

  const TrustedIssuersRegistryContract = await artifacts.require('registry/TrustedIssuersRegistry');

  const trustedIssuersRegistryContract = await TrustedIssuersRegistryContract.new({ from });


  if (newOwner) {
    await trustedIssuersRegistryContract.transferOwnership(newOwner, { from });
  }

  return trustedIssuersRegistryContract;

}

module.exports = {
  deployTrustedIssuersRegistry,
};
