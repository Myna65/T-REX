async function deployDefaultComplianceContract({ web3, artifacts }, { from } = {}) {

  from = from || web3.eth.accounts[0];

  const DefaultComplianceContract = await artifacts.require('compliance/DefaultCompliance');

  const defaultComplianceContract = await DefaultComplianceContract.new({ from });

  return defaultComplianceContract;

}

module.exports = {
  deployDefaultComplianceContract,
};
