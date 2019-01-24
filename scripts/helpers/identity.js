async function deployIdentityContract({ web3, artifacts }, { from, newOwner } = {}) {

  from = from || web3.eth.accounts[0];

  const ClaimHolderContract = await artifacts.require('identity/ClaimHolder');

  const claimHolderContract = await ClaimHolderContract.new({ from });


  if (newOwner) {
    await claimHolderContract.addKey(web3.sha3(newOwner, { encoding: 'hex' }), 1, 1, { from });
    await claimHolderContract.removeKey(web3.sha3(from, { encoding: 'hex' }), { from });
  }

  return claimHolderContract;

}

module.exports = {
  deployIdentityContract,
};
