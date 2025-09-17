import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Box, Container, Flex, Heading, Text } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 使用 dapp-kit hooks
  const currentAccount = useCurrentAccount();

  // 处理创意作品点击
  const handleCreativeClick = (id: number) => {
    navigate(`/creative/${id}`);
  };

  // 部署合约后，请将 CONTRACT_PACKAGE_ID 替换为实际的包ID
  // 例如：const CONTRACT_PACKAGE_ID = '0x123...';

  // 提交创意到智能合约
  const handleSubmitIdea = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!currentAccount) {
      alert('请先连接钱包');
      return;
    }

    setLoading(true);
    try {
  // 暂时简化处理，只显示成功消息
      console.log('创意提交表单已提交');
      alert('创意提交成功！等待审核。');
      setShowSubmitForm(false);
      
      // 重置表单
      (e.target as HTMLFormElement).reset();
      
    } catch (error) {
      console.error('提交创意失败:', error);
      alert('提交创意失败，请重试');
    } finally {
      setLoading(false);
    }
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
                  className="px-4 py-4 mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm glow"
                  onClick={() => setShowSubmitForm(true)}
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
                  className="px-4 py-4 mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-sm glow-purple"
                  onClick={() => setShowSubmitForm(true)}
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
                  className="px-4 py-4 mt-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 text-sm glow"
                  onClick={() => setShowSubmitForm(true)}
                >
                  创意提交
                </button>
              </Flex>
            </Box>
          </Flex>
        </Box>

        {/* 创意展示模块 */}
        <Box className="mb-12">
          <Box className="text-center mb-8">
            <Heading as="h2" size="6" className="text-black mb-6 animate-pulse-slow">创意作品展示</Heading>
            <Text size="3" className="text-gray-500">发现精彩创意，探索无限可能</Text>
          </Box>
          
          <Flex className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 创意作品展示卡片 1 */}
            <Box 
              className="glass rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 group cursor-pointer"
              onClick={()=>handeleGoto()}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="/images/creative1.jpg" 
                  alt="科幻城市概念" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <Text size="2" className="text-white font-medium block mb-1">科幻城市概念</Text>
                  <Text size="1" className="text-gray-300">未来都市建筑设计</Text>
                </div>
              </div>
            </Box>
            
            {/* 创意作品展示卡片 2 */}
            <Box 
              className="glass rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 group cursor-pointer"
              onClick={() => handleCreativeClick(2)}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop" 
                  alt="虚拟角色设计" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <Text size="2" className="text-white font-medium block mb-1">虚拟角色设计</Text>
                  <Text size="1" className="text-gray-300">数字艺术角色创作</Text>
                </div>
              </div>
            </Box>
            
            {/* 创意作品展示卡片 3 */}
            <Box 
              className="glass rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 group cursor-pointer"
              onClick={() => handleCreativeClick(3)}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop" 
                  alt="游戏场景概念" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <Text size="2" className="text-white font-medium block mb-1">游戏场景概念</Text>
                  <Text size="1" className="text-gray-300">沉浸式游戏环境</Text>
                </div>
              </div>
            </Box>
            
            {/* 创意作品展示卡片 4 */}
            <Box 
              className="glass rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 group cursor-pointer"
              onClick={() => handleCreativeClick(4)}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop" 
                  alt="创新产品设计" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <Text size="2" className="text-white font-medium block mb-1">创新产品设计</Text>
                  <Text size="1" className="text-gray-300">科技感UI/UX设计</Text>
                </div>
              </div>
            </Box>
          </Flex>
          
          {/* 查看更多按钮 */}
          <Box className="text-center mt-8">
            <button 
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium"
              onClick={() => alert('跳转到创意作品展示页面')}
            >
              查看更多作品
            </button>
          </Box>
        </Box>
      </Container>
      
      {/* 创意提交表单 */}
      {showSubmitForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass rounded-2xl p-8 w-full max-w-md mx-4 border border-gray-700/30">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-white">创意提交表单</h3>
              <button 
                className="text-gray-400 hover:text-white transition-colors"
                onClick={() => setShowSubmitForm(false)}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmitIdea}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">创意标题</label>
                <input 
                  type="text" 
                  className="w-full p-3 rounded-lg bg-white/10 border border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="请输入创意标题"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">创意描述</label>
                <textarea 
                  className="w-full p-3 rounded-lg bg-white/10 border border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-gray-400"
                  rows={4}
                  placeholder="请详细描述您的创意..."
                  required
                ></textarea>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">创意分类</label>
                <select 
                  className="w-full p-3 rounded-lg bg-white/10 border border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white"
                  required
                >
                  <option value="" className="bg-gray-800">请选择分类</option>
                  <option value="game" className="bg-gray-800">游戏创意</option>
                  <option value="art" className="bg-gray-800">艺术创作</option>
                  <option value="tech" className="bg-gray-800">技术创新</option>
                  <option value="other" className="bg-gray-800">其他</option>
                </select>
              </div>
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-300 mb-2">标签 (用逗号分隔)</label>
                <input 
                  type="text" 
                  className="w-full p-3 rounded-lg bg-white/10 border border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="例如: 创意, 游戏, 独特"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button 
                  type="button"
                  className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
                  onClick={() => setShowSubmitForm(false)}
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? '提交中...' : '提交创意'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <Box className="p-6 border-t border-gray-700/30">
        <Text className="text-center text-gray-400">© 2023 创意空间 - 构建去中心化未来</Text>
      </Box>
    </Box>
  );
};

export default HomePage;
