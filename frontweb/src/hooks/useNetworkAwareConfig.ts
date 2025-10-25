import { useSuiClientContext } from '@mysten/dapp-kit';
import { useMemo } from 'react';

// 网络相关配置
const NETWORK_CONFIGS = {
  mainnet: {
    rpcUrl: 'https://fullnode.mainnet.sui.io:443',
    explorerUrl: 'https://suiscan.xyz/mainnet',
    faucetUrl: null,
    packageId: '0x0', // 主网合约地址 (需要部署后填入)
    sharedCreativesId: '0x0' // 主网共享对象ID
  },
  testnet: {
    rpcUrl: 'https://fullnode.testnet.sui.io:443',
    explorerUrl: 'https://suiscan.xyz/testnet',
    faucetUrl: 'https://faucet.testnet.sui.io/',
    packageId: '0x099d2a1df65862d117963474d5ee839088111d53a8446845e59fff48f7e518ae', // 测试网合约地址 (最新部署)
    sharedCreativesId: '0xa67b88549ea4739a7a213f6fe809e0e027f9d3475c716f7e33890f56b75da2ae' // 测试网共享对象ID
  },
  devnet: {
    rpcUrl: 'https://fullnode.devnet.sui.io:443',
    explorerUrl: 'https://suiscan.xyz/devnet',
    faucetUrl: 'https://faucet.devnet.sui.io/',
    packageId: '0x0', // 开发网合约地址 (需要部署后填入)
    sharedCreativesId: '0x0' // 开发网共享对象ID
  }
} as const;

export const useNetworkAwareConfig = () => {
  const { network } = useSuiClientContext();
  
  const config = useMemo(() => {
    return NETWORK_CONFIGS[network as keyof typeof NETWORK_CONFIGS] || NETWORK_CONFIGS.devnet;
  }, [network]);

  return {
    network,
    packageId: config.packageId,
    sharedCreativesId: config.sharedCreativesId,
    explorerUrl: config.explorerUrl,
    faucetUrl: config.faucetUrl,
    isMainnet: network === 'mainnet',
    isTestnet: network === 'testnet',
    isDevnet: network === 'devnet',
    isContractDeployed: config.packageId !== '0x0'
  };
};

export default useNetworkAwareConfig;
