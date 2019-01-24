const { deployIdentityRegistryContract } = require('./identity-registry');
const { deployDefaultComplianceContract } = require('./default-compliance');

async function deployTokenContract({ web3, artifacts }, { from, newOwner, identityRegistry: identityRegistry_, compliance } = {}) {

  from = from || web3.eth.accounts[0];

  let identityRegistry;

  if (identityRegistry_) {
    identityRegistry = { identityRegistry: identityRegistry_ };
  }

  const TokenContract = await artifacts.require('token/Token');

  let identityRegistryPromise, compliancePromise;

  if (!identityRegistry) {
    identityRegistryPromise = deployIdentityRegistryContract({ web3, artifacts }, { from, newOwner });
  }

  if (!compliance) {
    compliancePromise = deployDefaultComplianceContract({ web3, artifacts }, { from });
  }

  if (!identityRegistry) {
    identityRegistry = await identityRegistryPromise;
  }

  if (!compliance) {
    compliance = await compliancePromise;
  }

  const tokenContract = await TokenContract.new(identityRegistry.identityRegistry.address, compliance.address, { from });


  if (newOwner) {
    await tokenContract.transferOwnership(newOwner, { from });
  }

  return { token: tokenContract, compliance, identityRegistry };

}

async function updateTokenCompliance({ web3, artifacts }, token, compliance, { from } = {}) {

  from = from || web3.eth.accounts[0];

  token.setCompliance(compliance.address, { from });

}

module.exports = {
  deployTokenContract,
  updateTokenCompliance,
};
