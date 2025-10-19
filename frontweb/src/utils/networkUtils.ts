// 网络切换工具函数
export const getExplorerUrl = (network: string, txHash?: string, address?: string) => {
  const baseUrls = {
    mainnet: 'https://suiscan.xyz/mainnet',
    testnet: 'https://suiscan.xyz/testnet'
  };
  
  const baseUrl = baseUrls[network as keyof typeof baseUrls] || baseUrls.testnet;
  
  if (txHash) {
    return `${baseUrl}/tx/${txHash}`;
  }
  
  if (address) {
    return `${baseUrl}/account/${address}`;
  }
  
  return baseUrl;
};

export const getFaucetUrl = (network: string) => {
  if (network === 'testnet') {
    return 'https://faucet.testnet.sui.io/';
  }
  return null;
};

export const formatNetwork = (network: string) => {
  return network.charAt(0).toUpperCase() + network.slice(1);
};

export const isValidNetwork = (network: string) => {
  return ['mainnet', 'testnet'].includes(network);
};