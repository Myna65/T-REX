async function deployLimitHolderComplianceContract({ web3, artifacts }, token, { from, holdersLimit } = {}) {

  from = from || web3.eth.accounts[0];
  holdersLimit = holdersLimit || 2;

  const LimitHolderComplianceContract = await artifacts.require('compliance/LimitHolder');

  return await LimitHolderComplianceContract.new(token.address, holdersLimit, { from });

}

module.exports = {
  deployLimitHolderComplianceContract,
};
