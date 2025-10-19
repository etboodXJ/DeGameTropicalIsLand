import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { Box, Text } from '@radix-ui/themes';
import { MIST_PER_SUI } from '@mysten/sui/utils';

const WalletBalance = () => {
  const currentAccount = useCurrentAccount();
  
  const { data: balance } = useSuiClientQuery(
    'getBalance',
    {
      owner: currentAccount?.address || '',
      coinType: '0x2::sui::SUI'
    },
    {
      enabled: !!currentAccount?.address,
      refetchInterval: 5000 // 每5秒刷新一次
    }
  );

  if (!currentAccount) return null;

  const suiBalance = balance ? Number(balance.totalBalance) / Number(MIST_PER_SUI) : 0;

  return (
    <Box 
      style={{ 
        padding: '6px 12px',
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '6px',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Text size="2" style={{ color: 'white', fontWeight: 'medium' }}>
        {suiBalance.toFixed(4)} SUI
      </Text>
    </Box>
  );
};

export default WalletBalance;