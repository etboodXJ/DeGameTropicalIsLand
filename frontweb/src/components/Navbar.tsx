import { ConnectButton } from '@mysten/dapp-kit';
import { Box, Flex, Text } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import NetworkSelector from './NetworkSelector';
import WalletBalance from './WalletBalance';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <Box 
      className="glass backdrop-blur-sm border-b border-gray-700/30"
      style={{ 
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(15, 23, 42, 0.8)'
      }}
    >
      <Flex 
        justify="between" 
        align="center"
        px="6" 
        py="4"
        className="container mx-auto"
      >
        <Flex align="center" gap="8">
          <Box>
            <Text size="6" weight="bold" className="text-white mr-4">{t('nav.title')}</Text>
            <Text size="3" className="text-gray-400">{t('nav.subtitle')}</Text>
          </Box>
          <Flex gap="6">
            <Text 
              className="text-gray-300 font-medium cursor-pointer hover:text-white transition-colors"
              onClick={() => navigate('/')}
            >
              {t('nav.home')}
            </Text>
            <Text 
              className="text-gray-400 hover:text-gray-200 cursor-pointer transition-colors"
              onClick={() => navigate('/explore')}
            >
              创意分类
            </Text>
            <Text className="text-gray-400 hover:text-gray-200 cursor-pointer transition-colors">{t('nav.market')}</Text>
            <Text className="text-gray-400 hover:text-gray-200 cursor-pointer transition-colors">{t('nav.assets')}</Text>
          </Flex>
        </Flex>
        <Flex align="center" gap="3">
          <WalletBalance />
          <LanguageSelector />
          <NetworkSelector />
          <ConnectButton />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
