import { Box, Text } from '@radix-ui/themes';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { usePoints } from '../hooks/usePoints';

const PointsBalance = () => {
  const currentAccount = useCurrentAccount();
  const { points } = usePoints();

  if (!currentAccount) return null;

  return (
    <Box 
      style={{ 
        padding: '6px 12px',
        background: 'rgba(255, 215, 0, 0.1)',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        borderRadius: '6px',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Text size="2" style={{ color: '#FFD700', fontWeight: 'medium' }}>
        {points.toLocaleString()} CYKJ
      </Text>
    </Box>
  );
};

export default PointsBalance;