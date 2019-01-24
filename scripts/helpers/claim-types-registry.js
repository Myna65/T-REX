async function deployClaimTypeRegistryContract({ web3, artifacts }, { from, newOwner } = {}) {

  from = from || web3.eth.accounts[0];

  const ClaimTypeRegistryContract = await artifacts.require('registry/ClaimTypesRegistry');

  const claimTypeRegistryContract = await ClaimTypeRegistryContract.new({ from });


  if (newOwner) {
    await claimTypeRegistryContract.transferOwnership(newOwner, { from });
  }

  return claimTypeRegistryContract;

}

module.exports = {
  deployClaimTypeRegistryContract,
};
