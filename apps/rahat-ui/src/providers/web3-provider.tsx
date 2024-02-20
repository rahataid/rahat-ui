'use client';

import { Web3ReactProvider } from '@rahat-ui/web3';

const Web3Provider = ({ children }) => {
  return <Web3ReactProvider>{children}</Web3ReactProvider>;
};

export default Web3Provider;
