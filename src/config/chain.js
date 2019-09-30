const chains = {
  1: {
    ROBONOMICS: {
      lighthouse: 'stable.lighthouse.5.robonomics.eth'
    }
  }
};

export default networkId => {
  return chains[networkId];
};
