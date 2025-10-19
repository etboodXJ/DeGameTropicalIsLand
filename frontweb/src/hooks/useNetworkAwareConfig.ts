import { useSuiClientContext } from '@mysten/dapp-kit';
import { useMemo } from 'react';

// 网络相关配置
const NETWORK_CONFIGS = {
  mainnet: {
    rpcUrl: 'https://fullnode.mainnet.sui.io:443',
    explorerUrl: 'https://suiscan.xyz/mainnet',
    faucetUrl: null,
    packageIds: {
      // 主网合约地址 (需要部署后填入)
      creative: '0x...',
      points: '0x...',
      dgti: '0x...'
    }
  },
  testnet: {
    rpcUrl: 'https://fullnode.testnet.sui.io:443',
    explorerUrl: 'https://suiscan.xyz/testnet',
    faucetUrl: 'https://faucet.testnet.sui.io/',
    packageIds: {
      // 测试网合约地址
      creative: '0x...',
      points: '0x...',
      dgti: '0x...'
    }
  }
} as const;

export const useNetworkAwareConfig = () => {
  const { network } = useSuiClientContext();
  
  const config = useMemo(() => {
    return NETWORK_CONFIGS[network as keyof typeof NETWORK_CONFIGS] || NETWORK_CONFIGS.testnet;
  }, [network]);

  return {
    network,
    config,
    isMainnet: network === 'mainnet',
    isTestnet: network === 'testnet'
  };
};

export default useNetworkAwareConfig;