import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import CreativeList from '../components/CreativeList';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Box, Container, Flex, Heading, Text } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import { useNetworkAwareConfig } from '../hooks/useNetworkAwareConfig';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  // 使用 dapp-kit hooks
  const currentAccount = useCurrentAccount();
  const { isContractDeployed, network } = useNetworkAwareConfig();

  // 处理创意作品点击
  const handleCreativeClick = (id: number) => {
    navigate(`/creative/${id}`);
  };



  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // 处理搜索输入
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

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
              <form onSubmit={handleSearch}>
                <input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  placeholder="搜索创意资源..." 
                  className="w-full p-4 pl-12 pr-12 rounded-2xl border border-gray-300 bg-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 placeholder-gray-500"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </form>
            </Box>
          </Box>
        </Box>

        {/* 创意提交区域 */}
        <Box className="mb-12">
          <Box className="glass rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <Box className="mb-6">
              <svg className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <Heading as="h2" size="6" className="text-gray-800 mb-4">发布您的创意</Heading>
              <Text size="3" className="text-gray-600 mb-6">
                分享您的创意想法，让社区为您的项目投票，获得真实的市场验证
              </Text>
            </Box>
            <button 
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => navigate('/submit')}
              disabled={!currentAccount || !isContractDeployed}
              title={!currentAccount ? '请先连接钱包' : !isContractDeployed ? '合约未部署' : ''}
            >
              {!currentAccount ? '请先连接钱包' : !isContractDeployed ? '合约未部署' : '创意提交'}
            </button>
          </Box>
        </Box>

        {/* 创意作品展示 */}
        <Box className="mb-12">
          <Box className="text-center mb-8">
            <Heading as="h2" size="6" className="text-gray-800 mb-4">精选创意作品</Heading>
            <Text size="3" className="text-gray-600">发现精彩创意，探索无限可能</Text>
          </Box>
          
          <CreativeList key={refreshKey} limit={8} showFilters={false} />
          
          {/* 查看更多按钮 */}
          <Box className="text-center mt-8">
            <button 
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium"
              onClick={() => navigate('/explore')}
            >
              浏览更多创意
            </button>
          </Box>
        </Box>
        
        {/* 网络状态提示 */}
        {!isContractDeployed && (
          <Box className="mb-8">
            <div className="glass rounded-lg p-4 border border-yellow-500/30 bg-yellow-500/10">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <Text className="text-yellow-700 font-medium">合约未部署</Text>
                  <Text size="2" className="text-yellow-600">
                    当前网络: {network} - 请先部署智能合约后再使用创意提交功能
                  </Text>
                </div>
              </div>
            </div>
          </Box>
        )}
      </Container>

      
      <Box className="p-6 border-t border-gray-300">
        <Text className="text-center text-gray-600">© 2025 创意空间 - 构建去中心化未来</Text>
      </Box>
    </Box>
  );
};

export default HomePage;
