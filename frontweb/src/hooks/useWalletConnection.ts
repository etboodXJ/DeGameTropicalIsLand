import { useCurrentAccount } from '@mysten/dapp-kit';
import { useState, useEffect } from 'react';

export interface WalletConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  needsConnection: boolean;
}

export const useWalletConnection = (): WalletConnectionState & {
  checkConnection: () => void;
} => {
  const currentAccount = useCurrentAccount();
  const [isConnecting, setIsConnecting] = useState(false);
  const [checked, setChecked] = useState(false);

  const checkConnection = () => {
    setChecked(true);
  };

  useEffect(() => {
    // 组件挂载时检查连接状态
    const timer = setTimeout(() => {
      checkConnection();
    }, 100); // 给钱包连接一点时间
    return () => clearTimeout(timer);
  }, []);

  const isConnected = !!currentAccount;
  const address = currentAccount?.address || null;
  const needsConnection = checked && !isConnected;

  return {
    isConnected,
    isConnecting,
    address,
    needsConnection,
    checkConnection
  };
};
