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
    packageId: '0x9567b360fac52796a737b38e901d62155d62dec1e82fe0c19ee56e70de417d01', // 测试网合约地址 (需要部署后填入)
    sharedCreativesId: '0x9a9db36aeb8ae59567a6aadfc85034168dbf0597056b10e57592669b3ad56e18' // 测试网共享对象ID
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