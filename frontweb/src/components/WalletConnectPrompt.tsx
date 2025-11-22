import React, { useEffect } from 'react';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { Box, Container, Heading, Text } from '@radix-ui/themes';

interface WalletConnectPromptProps {
  onConnect?: () => void;
}

const WalletConnectPrompt: React.FC<WalletConnectPromptProps> = ({ onConnect }) => {
  const currentAccount = useCurrentAccount();

  // 监听钱包连接状态变化
  useEffect(() => {
    if (currentAccount) {
      console.log('钱包已连接，触发回调');
      onConnect?.();
    }
  }, [currentAccount, onConnect]);
  return (
    <Box className="min-h-screen bg-gray-50">
      <Container className="container mx-auto p-6">
        <Box className="max-w-2xl mx-auto">
          {/* 页面标题 */}
          <Box className="text-center mb-12">
            <Heading as="h1" size="8" className="text-gray-800 mb-4">连接钱包</Heading>
            <Text size="4" className="text-gray-600">
              请先连接您的钱包以提交创意
            </Text>
          </Box>

          {/* 连接钱包卡片 */}
          <Box className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
            <Box className="text-center space-y-6">
              {/* 图标 */}
              <Box className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <svg 
                  className="w-12 h-12 text-blue-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
                  />
                </svg>
              </Box>

              {/* 说明文字 */}
              <Box className="space-y-4">
                <Heading as="h2" size="5" className="text-gray-800">
                  为什么需要连接钱包？
                </Heading>
                <Text size="3" className="text-gray-600 leading-relaxed">
                  连接钱包可以：
                </Text>
                <Box className="text-left space-y-2 max-w-md mx-auto">
                  <Text size="2" className="text-gray-600 flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    安全地管理您的数字资产
                  </Text>
                  <Text size="2" className="text-gray-600 flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    在区块链上记录您的创意
                  </Text>
                  <Text size="2" className="text-gray-600 flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    参与社区投票和治理
                  </Text>
                </Box>
              </Box>

              {/* 连接按钮 */}
              <Box className="pt-6">
                <ConnectButton connectText="连接钱包" />
              </Box>

              {/* 安全提示 */}
              <Box className="pt-4 border-t border-gray-200">
                <Text size="1" className="text-gray-500">
                  🔒 您的钱包数据将安全存储在本地，我们不会收集或分享您的个人信息
                </Text>
              </Box>
            </Box>
          </Box>

          {/* 帮助信息 */}
          <Box className="mt-8 text-center">
            <Text size="2" className="text-gray-500">
              需要帮助？请查看我们的 
              <a href="#" className="text-blue-600 hover:text-blue-800 ml-1">
                钱包连接指南
              </a>
            </Text>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default WalletConnectPrompt;
