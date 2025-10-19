import { useEffect, useState } from 'react';
import { Box, Text } from '@radix-ui/themes';
import { useSuiClientContext } from '@mysten/dapp-kit';
import { useLanguage } from '../contexts/LanguageContext';

const NetworkSwitchNotification = () => {
  const { network } = useSuiClientContext();
  const { t } = useLanguage();
  const [showNotification, setShowNotification] = useState(false);
  const [previousNetwork, setPreviousNetwork] = useState(network);

  useEffect(() => {
    if (previousNetwork && previousNetwork !== network) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
    setPreviousNetwork(network);
  }, [network, previousNetwork]);

  if (!showNotification) return null;

  return (
    <Box
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 16px',
        background: 'rgba(16, 185, 129, 0.9)',
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 1001,
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      <Text size="2" weight="medium">
        {t('network.switched', { network: network.toUpperCase() })}
      </Text>
    </Box>
  );
};

export default NetworkSwitchNotification;