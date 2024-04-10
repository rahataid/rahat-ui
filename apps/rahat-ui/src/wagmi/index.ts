'use server';

import { rahatChain } from './chain-custom';
import { config } from './wagmi.config';

const unsubscribe = config.subscribe(
  (state) => state.chainId,
  (chainId) => console.log(`Chain ID changed to ${chainId}`),
);
unsubscribe();

config.setState((x) => {
  console.log('x', x);
  return {
    ...x,
    chainId: x.current ? x.chainId : 5,
  };
});
