import React from 'react';
import { Box, Container, Heading, Text, Flex } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';

const ComingSoonPage = () => {
  const navigate = useNavigate();

  return (
    <Box className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <Container className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <Box className="text-center max-w-4xl mx-auto">
          {/* Logo区域 */}
          <Box className="mb-12">
            <div className="text-8xl mb-6 animate-bounce">🚀</div>
            <Heading as="h1" size="9" className="text-white mb-4 font-bold">
              创意空间
            </Heading>
            <Text size="6" className="text-blue-200 font-light">
              SparkSpace
            </Text>
          </Box>

          {/* 主要内容 */}
          <Box className="mb-12">
            <Heading as="h2" size="7" className="text-white mb-6">
              主网版本即将上线
            </Heading>
            <Text size="4" className="text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              我们正在为主网部署做最后的准备工作，包括安全审计、性能优化和用户体验完善。
              敬请期待更加稳定和完善的创意交易平台！
            </Text>
          </Box>

          {/* 功能预告 */}
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Box className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl mb-4">💡</div>
              <Heading as="h3" size="4" className="text-white mb-3">创意发布</Heading>
              <Text size="2" className="text-gray-300">
                发布您的创意想法，获得社区投票和期待值
              </Text>
            </Box>
            
            <Box className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl mb-4">🌟</div>
              <Heading as="h3" size="4" className="text-white mb-3">观众期待值</Heading>
              <Text size="2" className="text-gray-300">
                使用CYKJ积分投票，参与项目收益分配
              </Text>
            </Box>
            
            <Box className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl mb-4">💰</div>
              <Heading as="h3" size="4" className="text-white mb-3">盈利分配</Heading>
              <Text size="2" className="text-gray-300">
                项目成功后，按期待值比例获得收益分成
              </Text>
            </Box>
          </Box>

          {/* 当前状态 */}
          <Box className="bg-yellow-500/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30 mb-8">
            <Flex align="center" justify="center" gap="3" className="mb-4">
              <div className="text-2xl">⚠️</div>
              <Heading as="h3" size="4" className="text-yellow-200">当前网络状态</Heading>
            </Flex>
            <Text size="3" className="text-yellow-100 mb-4">
              检测到您正在使用 Sui 主网，主网版本尚未部署
            </Text>
            <Text size="2" className="text-yellow-200">
              如需体验功能，请切换到测试网络
            </Text>
          </Box>

          {/* 操作按钮 */}
          <Flex justify="center" gap="4" className="mb-8">
            <button
              onClick={() => {
                alert('请在钱包中切换到 Sui 测试网络，然后刷新页面');
              }}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
            >
              切换到测试网
            </button>
            
            <button
              onClick={() => {
                window.open('https://github.com/your-repo', '_blank');
              }}
              className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border border-white/30"
            >
              查看项目进展
            </button>
          </Flex>

          {/* 联系信息 */}
          <Box className="text-center">
            <Text size="2" className="text-gray-400 mb-4">
              关注我们的最新动态
            </Text>
            <Flex justify="center" gap="6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="text-xl">📧</span>
                <Text size="1" className="ml-2">邮件订阅</Text>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="text-xl">🐦</span>
                <Text size="1" className="ml-2">Twitter</Text>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="text-xl">💬</span>
                <Text size="1" className="ml-2">Discord</Text>
              </a>
            </Flex>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ComingSoonPage;