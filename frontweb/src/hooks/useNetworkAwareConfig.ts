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
    packageId: '0xcafba38c8bf232964ca2849d02a97729c054b8a6dc4c7f43298dc4ec6a76c45f', // 测试网合约地址 (需要部署后填入)
    sharedCreativesId: '0x779f3ef091c7a9c7b8c069c12bd404eb4f8eab7082f029c6205a5c937e6ef188' // 测试网共享对象ID
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