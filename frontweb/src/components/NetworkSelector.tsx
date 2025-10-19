import { useState } from 'react';
import { useSuiClientContext } from '@mysten/dapp-kit';
import { Box, Button, DropdownMenu, Text } from '@radix-ui/themes';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useLanguage } from '../contexts/LanguageContext';

const NetworkSelector = () => {
  const { network, selectNetwork } = useSuiClientContext();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const networks = [
    { key: 'mainnet', label: t('network.mainnet'), color: '#10B981' },
    { key: 'testnet', label: t('network.testnet'), color: '#F59E0B' }
  ];

  const currentNetwork = networks.find(n => n.key === network) || networks[1];

  const handleNetworkChange = (networkKey: string) => {
    selectNetwork(networkKey);
    setIsOpen(false);
  };

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger>
        <Button 
          variant="outline" 
          size="2"
          style={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white'
          }}
        >
          <Box 
            style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: currentNetwork?.color,
              marginRight: '8px'
            }} 
          />
          <Text size="2">{currentNetwork?.label}</Text>
          <ChevronDownIcon />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content 
        style={{ 
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {networks.map((net) => (
          <DropdownMenu.Item
            key={net.key}
            onClick={() => handleNetworkChange(net.key)}
            style={{
              color: network === net.key ? net.color : 'white',
              cursor: 'pointer'
            }}
          >
            <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Box 
                style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: net.color
                }} 
              />
              <Text size="2">{net.label}</Text>
              {network === net.key && <Text size="1" style={{ color: '#10B981' }}>✓</Text>}
            </Box>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default NetworkSelector;