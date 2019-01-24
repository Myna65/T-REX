const util = require('util');


const { deployIdentityContract } = require('./helpers/identity');
const { deployClaimTypeRegistryContract } = require('./helpers/claim-types-registry');
const { deployTrustedIssuersRegistry } = require('./helpers/trusted-issuers-registry');
const { deployIdentityRegistryContract } = require('./helpers/identity-registry');
const { deployTokenContract, updateTokenCompliance } = require('./helpers/token');
const { deployLimitHolderComplianceContract } = require('./helpers/limit-holder-compliance');
const { deployDefaultComplianceContract } = require('./helpers/default-compliance');

module.exports = async (callback) => {
  try {
    const dummyCompliancePromise = deployDefaultComplianceContract({ web3, artifacts });
    // Tokeny is account 0
    // Account 1, 2, 3 will be issuers account.

    // Account 4, 5, 6 self-deployed an identity, will be used as claim issuers
    const identity4Promise = deployIdentityContract({ web3, artifacts }, { from: web3.eth.accounts[4] });
    const identity5Promise = deployIdentityContract({ web3, artifacts }, { from: web3.eth.accounts[5] });
    const identity6Promise = deployIdentityContract({ web3, artifacts }, { from: web3.eth.accounts[6] });

    // Tokeny deploys two identities and switch ownership for accounts 7 and 8, will be used as investors
    const identity7Promise = deployIdentityContract({ web3, artifacts }, { newOwner: web3.eth.accounts[7] });
    const identity8Promise = deployIdentityContract({ web3, artifacts }, { newOwner: web3.eth.accounts[8] });

    // Account 9 self-deployed an identity, will be used as an investor
    const identity9Promise = deployIdentityContract({ web3, artifacts }, { from: web3.eth.accounts[9] });

    const token1 = async () => {
      // Account 1 will deploy a token without claim verification and no compliance mechanism
      const token11Promise = deployTokenContract({ web3, artifacts }, { from: web3.eth.accounts[1] });
      // Account 1 have also a token without claim verification but with a limit holder compliance mechanism
      const token12 = async () => {
        const token12Promise = deployTokenContract({ web3, artifacts }, {
          newOwner: web3.eth.accounts[1],
          compliance: await dummyCompliancePromise,
        });
        const limitCompliance12Promise = deployLimitHolderComplianceContract({
          web3,
          artifacts,
        }, (await token12Promise).token, { from: web3.eth.accounts[1] });
        return updateTokenCompliance({
          web3,
          artifacts,
        }, (await token12Promise).token, await limitCompliance12Promise);
      };
      return Promise.all([token11Promise, token12()]);
    };

    // Account 3 has 2 tokens sharing the same identity registry
    const token3 = async () => {
      const identityRegistry3Promise = deployIdentityRegistryContract({
        web3,
        artifacts,
      }, { from: web3.eth.accounts[3] });

      const token31 = async () => {
        return deployTokenContract({ web3, artifacts }, {
          from: web3.eth.accounts[3],
          identityRegistry: (await identityRegistry3Promise).identityRegistry,
        });
      };

      const token32 = async () => {
        const token32Promise = deployTokenContract({ web3, artifacts }, {
          from: web3.eth.accounts[3],
          identityRegistry: (await identityRegistry3Promise).identityRegistry,
          compliance: await dummyCompliancePromise,
        });
        const limitCompliance32Promise = deployLimitHolderComplianceContract({
          web3,
          artifacts,
        }, (await token32Promise).token, { from: web3.eth.accounts[1] });
        return updateTokenCompliance({
          web3,
          artifacts,
        }, (await token32Promise).token, await limitCompliance32Promise);
      };

      return Promise.all([token31(), token32()])
    };

    await Promise.all([
      identity4Promise,
      identity5Promise,
      identity6Promise,
      identity7Promise,
      identity8Promise,
      identity9Promise,
      token1(),
      token3(),
    ]);

    callback();
  } catch (e) {
    callback(e);
  }
};

