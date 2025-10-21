import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import CreativeSubmitForm from '../components/CreativeSubmitForm';
import CreativeList from '../components/CreativeList';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Box, Container, Flex, Heading, Text } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import { useNetworkAwareConfig } from '../hooks/useNetworkAwareConfig';

const HomePage = () => {
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const navigate = useNavigate();

  // 使用 dapp-kit hooks
  const currentAccount = useCurrentAccount();
  const { isContractDeployed, network } = useNetworkAwareConfig();

  // 处理创意作品点击
  const handleCreativeClick = (id: number) => {
    navigate(`/creative/${id}`);
  };

  // 处理创意提交成功
  const handleSubmitSuccess = () => {
    console.log('创意提交成功');
    // 可以在这里添加更多成功后的逻辑，比如刷新创意列表
  };

  function handeleGoto() {
    // alert('即将前往创意提交页面');
    window.location.href = 'http://localhost:30033/';
  }

  return (
    <Box className="min-h-screen">
      <Navbar />
      
      {/* 科技感装饰元素 */}
      <div className="tech-decoration top-10 left-10 opacity-20"></div>
      <div className="tech-decoration bottom-20 right-10 opacity-20" style={{ animationDelay: '3s' }}></div>
      
      <Container className="container mx-auto p-6 relative z-10">
        {/* 搜索区域 */}
        <Box className="mb-12">
          <Box className="relative max-w-2xl mx-auto">
            <Box className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"></Box>
            <Box className="relative">
              <input 
                placeholder="搜索创意资源..." 
                className="w-full p-4 pl-12 rounded-2xl border border-gray-700/30 bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-gray-400"
              />
              {/* <svg className="absolute left-4 top-4.5 h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg> */}
            </Box>
          </Box>
        </Box>

        {/* 创意创作系统 */}
        <Box className="mb-12">
          <Box className="text-center mb-8">
            <Heading as="h2" size="6" className="text-black mb-6 animate-pulse-slow">创意创作系统</Heading>
            <Text size="3" className="text-gray-500">释放您的创意潜能，构建去中心化未来</Text>
          </Box>
          
          <Flex className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 创意卡片示例 */}
            <Box className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 group">
              <Box className="h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mb-6 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-grid bg-[length:40px_40px] opacity-20"></div>
                <div className="relative z-10">
                  <svg className="w-12 h-12 text-blue-400 animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </Box>
              <Heading as="h3" size="3" className="text-gray-100 mb-2">创意游戏概念</Heading>
              <Text size="2" className="text-gray-500 mb-4">独特的游戏创意和概念设计，探索无限可能</Text>
              <Flex justify="between" align="center">
                <Text className="text-blue-400 font-medium">创意价值</Text>
                <button 
                  className="px-4 py-4 mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm glow disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setShowSubmitForm(true)}
                  disabled={!currentAccount || !isContractDeployed}
                  title={!currentAccount ? '请先连接钱包' : !isContractDeployed ? '合约未部署' : ''}
                >
                  创意提交
                </button>
              </Flex>
            </Box>
            
            {/* 更多创意卡片 */}
            <Box className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 group">
              <Box className="h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl mb-6 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-grid bg-[length:40px_40px] opacity-20"></div>
                <div className="relative z-10">
                  <svg className="w-12 h-12 text-purple-400 animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
              </Box>
              <Heading as="h3" size="3" className="text-gray-100 mb-2">数字艺术创作</Heading>
              <Text size="2" className="text-gray-500 mb-4">创新的数字艺术作品和视觉体验</Text>
              <Flex justify="between" align="center">
                <Text className="text-purple-400 font-medium">艺术价值</Text>
                <button 
                  className="px-4 py-4 mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-sm glow-purple disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setShowSubmitForm(true)}
                  disabled={!currentAccount || !isContractDeployed}
                  title={!currentAccount ? '请先连接钱包' : !isContractDeployed ? '合约未部署' : ''}
                >
                  创意提交
                </button>
              </Flex>
            </Box>
            
            <Box className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 group">
              <Box className="h-48 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl mb-6 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-grid bg-[length:40px_40px] opacity-20"></div>
                <div className="relative z-10">
                  <svg className="w-12 h-12 text-green-400 animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </Box>
              <Heading as="h3" size="3" className="text-gray-100 mb-2">技术创新方案</Heading>
              <Text size="2" className="text-gray-500 mb-4">突破性的技术创新和解决方案</Text>
              <Flex justify="between" align="center">
                <Text className="text-green-400 font-medium">技术价值</Text>
                <button 
                  className="px-4 py-4 mt-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 text-sm glow disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setShowSubmitForm(true)}
                  disabled={!currentAccount || !isContractDeployed}
                  title={!currentAccount ? '请先连接钱包' : !isContractDeployed ? '合约未部署' : ''}
                >
                  创意提交
                </button>
              </Flex>
            </Box>
          </Flex>
        </Box>

        {/* 创意作品展示 */}
        <Box className="mb-12">
          <Box className="text-center mb-8">
            <Heading as="h2" size="6" className="text-black mb-6 animate-pulse-slow">精选创意作品</Heading>
            <Text size="3" className="text-gray-500">发现精彩创意，探索无限可能</Text>
          </Box>
          
          <CreativeList limit={4} showFilters={false} />
          
          {/* 查看更多按钮 */}
          <Box className="text-center mt-8">
            <button 
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium"
              onClick={() => navigate('/explore')}
            >
              浏览创意分类
            </button>
          </Box>
        </Box>

        {/* 创意列表展示 */}
        <Box className="mb-12">
          <CreativeList limit={6} />
        </Box>
        
        {/* 网络状态提示 */}
        {!isContractDeployed && (
          <Box className="mb-8">
            <div className="glass rounded-lg p-4 border border-yellow-500/30 bg-yellow-500/10">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <Text className="text-yellow-300 font-medium">合约未部署</Text>
                  <Text size="2" className="text-yellow-400/80">
                    当前网络: {network} - 请先部署智能合约后再使用创意提交功能
                  </Text>
                </div>
              </div>
            </div>
          </Box>
        )}
      </Container>
      
      {/* 创意提交表单 */}
      <CreativeSubmitForm 
        isOpen={showSubmitForm}
        onClose={() => setShowSubmitForm(false)}
        onSuccess={handleSubmitSuccess}
      />
      
      <Box className="p-6 border-t border-gray-700/30">
        <Text className="text-center text-gray-400">© 2023 创意空间 - 构建去中心化未来</Text>
      </Box>
    </Box>
  );
};

export default HomePage;
