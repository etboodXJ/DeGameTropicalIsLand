import { Box, Text } from '@radix-ui/themes';
import { useNetworkAwareConfig } from '../hooks/useNetworkAwareConfig';

const NetworkStatus = () => {
  const { network, isMainnet } = useNetworkAwareConfig();

  return (
    <Box 
      style={{ 
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '8px 12px',
        background: isMainnet ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
        border: `1px solid ${isMainnet ? '#10B981' : '#F59E0B'}`,
        borderRadius: '6px',
        backdropFilter: 'blur(10px)',
        zIndex: 1000
      }}
    >
      <Text 
        size="1" 
        style={{ 
          color: isMainnet ? '#10B981' : '#F59E0B',
          fontWeight: 'medium'
        }}
      >
        {network.toUpperCase()}
      </Text>
    </Box>
  );
};

export default NetworkStatus;