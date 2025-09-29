import React from 'react';
import { Box, Container, Heading, Text, Button, Badge, Flex } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';

const CreativeDetailPage = () => {
  const navigate = useNavigate();

  // 模拟创意作品数据
  const creativeWork = {
    id: 1,
    title: '科幻城市概念',
    description: '这是一个充满未来感的科幻城市概念设计，融合了先进的科技与可持续发展的理念。城市中摩天大楼高耸入云，飞行器在楼宇间穿梭，绿色空间与高科技完美结合。',
    creativeType: '图文创意',
    category: '建筑设计',
    tags: ['科幻', '未来城市', '可持续发展', '建筑设计'],
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
    author: '张设计师',
    date: '2024-01-15',
    views: 1250,
    likes: 89
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box className="min-h-screen">
      {/* 返回按钮 */}
      <Box className="p-6">
        <Button 
          onClick={handleBack}
          className="mb-6 bg-gray-700 hover:bg-gray-600 text-white"
        >
          ← 返回
        </Button>
      </Box>

      <Container className="container mx-auto p-6 relative z-10">
        {/* 作品展示区域 */}
        <Box className="glass rounded-2xl overflow-hidden mb-8">
          <div className="relative h-96 md:h-[500px] overflow-hidden">
            <img 
              src={creativeWork.imageUrl} 
              alt={creativeWork.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <Heading as="h1" size="8" className="mb-4">{creativeWork.title}</Heading>
              <div className="flex items-center gap-4 text-sm">
                <span>类型: {creativeWork.creativeType}</span>
                <span>作者: {creativeWork.author}</span>
                <span>发布时间: {creativeWork.date}</span>
                <span>浏览: {creativeWork.views}</span>
                <span>点赞: {creativeWork.likes}</span>
              </div>
            </div>
          </div>
        </Box>

        {/* 作品详情 */}
        <Box className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* 左侧详情 */}
          <Box className="lg:col-span-2">
            <Box className="glass rounded-2xl p-8">
              <Heading as="h2" size="5" className="text-gray-100 mb-6">作品介绍</Heading>
              <Text size="3" className="text-gray-500 leading-relaxed mb-6">
                {creativeWork.description}
              </Text>
              
              <Heading as="h3" size="4" className="text-gray-100 mb-4">设计理念</Heading>
              <Text size="2" className="text-gray-500 leading-relaxed mb-6">
                这个科幻城市概念设计旨在探索未来人类居住环境的可能性。设计融合了人工智能、清洁能源和垂直农业等先进技术，
                创造一个既高效又宜居的城市环境。建筑风格采用流线型设计，减少风阻，同时最大化自然光的利用。
              </Text>

              <Heading as="h3" size="4" className="text-gray-100 mb-4">技术特点</Heading>
              <ul className="text-gray-500 space-y-2 mb-6">
                <li>• 智能交通系统：自动驾驶飞行器与地下磁悬浮列车结合</li>
                <li>• 能源自给：太阳能、风能和核聚变能的综合利用</li>
                <li>• 生态循环：垂直农业和水资源循环利用系统</li>
                <li>• 智能管理：AI驱动的城市管理和资源分配系统</li>
              </ul>

              <Heading as="h3" size="4" className="text-gray-100 mb-4">标签</Heading>
              <Flex wrap="wrap" gap="2" className="mb-6">
                {creativeWork.tags.map((tag, index) => (
                  <Badge key={index} variant="surface" className="bg-blue-500/20 text-blue-400">
                    {tag}
                  </Badge>
                ))}
              </Flex>
            </Box>
          </Box>

          {/* 右侧信息栏 */}
          <Box className="lg:col-span-1">
            <Box className="glass rounded-2xl p-6 mb-6">
              <Heading as="h3" size="4" className="text-gray-100 mb-4">作品信息</Heading>
              <div className="space-y-3 text-gray-500">
                <div>
                  <Text size="2" className="font-medium">创意类型</Text>
                  <Text size="1">{creativeWork.creativeType}</Text>
                </div>
                <div>
                  <Text size="2" className="font-medium">分类</Text>
                  <Text size="1">{creativeWork.category}</Text>
                </div>
                <div>
                  <Text size="2" className="font-medium">作者</Text>
                  <Text size="1">{creativeWork.author}</Text>
                </div>
                <div>
                  <Text size="2" className="font-medium">发布时间</Text>
                  <Text size="1">{creativeWork.date}</Text>
                </div>
                <div>
                  <Text size="2" className="font-medium">浏览次数</Text>
                  <Text size="1">{creativeWork.views}</Text>
                </div>
                <div>
                  <Text size="2" font-medium>点赞次数</Text>
                  <Text size="1">{creativeWork.likes}</Text>
                </div>
              </div>
            </Box>

            <Box className="glass rounded-2xl p-6">
              <Heading as="h3" size="4" className="text-gray-100 mb-4">互动操作</Heading>
              <Flex direction="column" gap="3">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  👍 点赞作品
                </Button>
                <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                  💬 收藏作品
                </Button>
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  🔄 分享作品
                </Button>
                <Button className="bg-gray-700 hover:bg-gray-600 text-white">
                  📧 联系作者
                </Button>
              </Flex>
            </Box>
          </Box>
        </Box>

        {/* 相关推荐 */}
        <Box className="glass rounded-2xl p-8">
          <Heading as="h2" size="5" className="text-gray-100 mb-6">相关推荐</Heading>
          <Flex className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 推荐卡片 1 */}
            <Box className="glass rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="relative h-40 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop" 
                  alt="相关作品1" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
              <Box className="p-4">
                <Text size="2" className="text-white font-medium mb-1">虚拟角色设计</Text>
                <Text size="1" className="text-gray-400">数字艺术创作</Text>
              </Box>
            </Box>

            {/* 推荐卡片 2 */}
            <Box className="glass rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="relative h-40 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop" 
                  alt="相关作品2" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
              <Box className="p-4">
                <Text size="2" className="text-white font-medium mb-1">游戏场景概念</Text>
                <Text size="1" className="text-gray-400">沉浸式游戏环境</Text>
              </Box>
            </Box>

            {/* 推荐卡片 3 */}
            <Box className="glass rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="relative h-40 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop" 
                  alt="相关作品3" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
              <Box className="p-4">
                <Text size="2" className="text-white font-medium mb-1">创新产品设计</Text>
                <Text size="1" className="text-gray-400">科技感UI/UX设计</Text>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
};

export default CreativeDetailPage;
