import React from 'react';
import { Box, Container, Heading, Text } from '@radix-ui/themes';
import Navbar from '../components/Navbar';

const TestExplore: React.FC = () => {
  return (
    <Box className="min-h-screen">
      <Navbar />
      <Container className="container mx-auto p-6">
        <Box className="text-center py-12">
          <Heading as="h1" size="8" className="text-white mb-6">
            🎉 创意分类系统
          </Heading>
          <Text size="4" className="text-gray-300 mb-8">
            新的创意分类功能已成功加载！
          </Text>
          
          <Box className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
            <Heading as="h2" size="6" className="text-white mb-4">
              功能特性
            </Heading>
            <div className="text-left space-y-3">
              <Text className="text-gray-300 block">✅ 标签驱动的灵活分类系统</Text>
              <Text className="text-gray-300 block">✅ 多维度筛选器 (成熟度/领域/技术/状态)</Text>
              <Text className="text-gray-300 block">✅ 游戏专区、应用专区分类导航</Text>
              <Text className="text-gray-300 block">✅ 全文搜索和多种排序方式</Text>
              <Text className="text-gray-300 block">✅ 响应式设计，适配各种屏幕</Text>
            </div>
          </Box>
          
          <Box className="mt-8">
            <Text size="2" className="text-gray-400">
              如果您看到这个页面，说明路由配置成功！
            </Text>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default TestExplore;