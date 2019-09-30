import Robonomics, { MessageProviderIpfs } from 'robonomics-js';

let robonomics = null;
export const init = (config, web3, ipfs) => {
  robonomics = new Robonomics({
    web3,
    messageProvider: new MessageProviderIpfs(ipfs),
    account: {
      address: web3.eth.accounts[0]
    },
    ...config
  });
  return robonomics;
};

export default () => {
  if (robonomics === null) {
    throw new Error('Robonomics not init');
  }
  return robonomics;
};
