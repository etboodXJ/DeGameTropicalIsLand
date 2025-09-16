import { ConnectButton } from '@mysten/dapp-kit';
import { Box, Flex, Text } from '@radix-ui/themes';

const Navbar = () => {
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
            <Text size="6" weight="bold" className="text-white">创意空间</Text>
            <Text size="3" className="text-gray-400">创意去中心化交易平台</Text>
          </Box>
          <Flex gap="6">
            <Text className="text-gray-300 font-medium cursor-pointer hover:text-white transition-colors">首页</Text>
            <Text className="text-gray-400 hover:text-gray-200 cursor-pointer transition-colors">资源市场</Text>
            <Text className="text-gray-400 hover:text-gray-200 cursor-pointer transition-colors">我的资产</Text>
          </Flex>
        </Flex>
        <Box>
          <ConnectButton />
        </Box>
      </Flex>
    </Box>
  );
};

export default Navbar;
