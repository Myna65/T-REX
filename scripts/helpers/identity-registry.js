const { deployClaimTypeRegistryContract } = require('./claim-types-registry');
const { deployTrustedIssuersRegistry } = require('./trusted-issuers-registry');

async function deployIdentityRegistryContract({ web3, artifacts }, { from, newOwner, claimTypesRegistry, trustedIssuerRegistry } = {}) {

  from = from || web3.eth.accounts[0];

  const IdentityRegistryContract = await artifacts.require('registry/IdentityRegistry');

  let claimTypesRegistryPromise, trustedIssuerRegistryPromise;

  if (!claimTypesRegistry) {
    claimTypesRegistryPromise = deployClaimTypeRegistryContract({ web3, artifacts }, { from, newOwner });
  }

  if (!trustedIssuerRegistry) {
    trustedIssuerRegistryPromise = deployTrustedIssuersRegistry({ web3, artifacts }, { from, newOwner });
  }

  if (!claimTypesRegistry) {
    claimTypesRegistry = await claimTypesRegistryPromise;
  }

  if (!trustedIssuerRegistry) {
    trustedIssuerRegistry = await trustedIssuerRegistryPromise;
  }

  const identityRegistryContract = await IdentityRegistryContract.new(trustedIssuerRegistry.address, claimTypesRegistry.address, { from });


  if (newOwner) {
    await identityRegistryContract.transferOwnership(newOwner, { from });
  }

  return { identityRegistry: identityRegistryContract, claimTypesRegistry, trustedIssuerRegistry };

}

module.exports = {
  deployIdentityRegistryContract,
};
