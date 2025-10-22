import React from 'react';
import { Box, Container, Heading, Text, Button } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { usePoints } from '../hooks/usePoints';
import { useCreativeLikes } from '../hooks/useCreativeLikes';
import Navbar from '../components/Navbar';

const LikeTestPage = () => {
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();
  const { points, addPoints } = usePoints();
  const { likeCreative, getCreativeExpectation, hasUserLiked } = useCreativeLikes();

  // 测试创意数据
  const testCreatives = [
    {
      id: 'test-creative-1',
      title: '测试创意：AI生成的游戏角色',
      description: '这是一个使用AI技术生成的游戏角色设计，包含完整的动画序列和技能效果。',
      category: 'game_assets',
      creator: currentAccount?.address || '0x123...abc'
    },
    {
      id: 'test-creative-2', 
      title: '测试创意：区块链游戏概念',
      description: '一个基于区块链的策略游戏概念，玩家可以真正拥有游戏内资产。',
      category: 'game_concept',
      creator: currentAccount?.address || '0x456...def'
    }
  ];

  const handleAddTestPoints = () => {
    addPoints('bucket', 1, 'test-transaction');
    alert('添加了100 CYKJ测试积分！');
  };

  const handleLikeCreative = (creativeId: string, points: number) => {
    const success = likeCreative(creativeId, points);
    if (success) {
      alert(`点赞成功！为创意增加了 ${points} 观众期待值`);
    } else {
      alert('点赞失败，可能已经点赞过了');
    }
  };

  return (
    <Box className="min-h-screen">
      <Navbar />
      
      <Container className="container mx-auto p-6">
        <Box className="mb-8">
          <Heading as="h1" size="8" className="text-gray-100 mb-4">
            点赞功能测试页面
          </Heading>
          <Text size="3" className="text-gray-400 mb-6">
            这是一个测试页面，用于演示创意点赞和观众期待值功能
          </Text>
          
          {/* 用户状态 */}
          <Box className="glass rounded-2xl p-6 mb-6">
            <Heading as="h3" size="4" className="text-gray-100 mb-4">用户状态</Heading>
            <div className="space-y-2 text-gray-300">
              <div>钱包地址: {currentAccount?.address || '未连接'}</div>
              <div>当前积分: {points} CYKJ</div>
              <Button 
                className="mt-4 bg-green-500 hover:bg-green-600 text-white"
                onClick={handleAddTestPoints}
                disabled={!currentAccount}
              >
                添加测试积分 (+100 CYKJ)
              </Button>
            </div>
          </Box>
        </Box>

        {/* 测试创意列表 */}
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testCreatives.map((creative) => {
            const expectation = getCreativeExpectation(creative.id);
            const userHasLiked = hasUserLiked(creative.id);
            
            return (
              <Box key={creative.id} className="glass rounded-2xl p-6">
                <Heading as="h3" size="5" className="text-gray-100 mb-3">
                  {creative.title}
                </Heading>
                <Text size="2" className="text-gray-400 mb-4">
                  {creative.description}
                </Text>
                
                {/* 期待值信息 */}
                <Box className="mb-4 p-4 bg-gray-800/50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Text className="text-gray-400">观众期待值</Text>
                      <Text className="text-yellow-400 font-bold text-lg">
                        {expectation.totalExpectation} 🌟
                      </Text>
                    </div>
                    <div>
                      <Text className="text-gray-400">点赞人数</Text>
                      <Text className="text-blue-400 font-bold text-lg">
                        {expectation.likeCount} 👍
                      </Text>
                    </div>
                  </div>
                </Box>

                {/* 点赞按钮 */}
                {!userHasLiked ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => handleLikeCreative(creative.id, 10)}
                        disabled={!currentAccount || points < 10}
                      >
                        点赞 (10 CYKJ)
                      </Button>
                      <Button
                        className="bg-purple-500 hover:bg-purple-600 text-white"
                        onClick={() => handleLikeCreative(creative.id, 50)}
                        disabled={!currentAccount || points < 50}
                      >
                        超级点赞 (50 CYKJ)
                      </Button>
                    </div>
                    <Text size="1" className="text-gray-500">
                      当前积分: {points} CYKJ
                    </Text>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <Text className="text-green-400">✅ 已点赞</Text>
                  </div>
                )}

                {/* 查看详情按钮 */}
                <Button
                  className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white"
                  onClick={() => navigate(`/creative/${creative.id}`)}
                >
                  查看详情
                </Button>
              </Box>
            );
          })}
        </Box>

        {/* 说明文档 */}
        <Box className="mt-8 glass rounded-2xl p-6">
          <Heading as="h3" size="4" className="text-gray-100 mb-4">功能说明</Heading>
          <div className="space-y-3 text-gray-300 text-sm">
            <div>1. 连接钱包后，点击"添加测试积分"获取CYKJ积分</div>
            <div>2. 使用积分对创意进行点赞，积分会转换为"观众期待值"</div>
            <div>3. 每个用户对同一创意只能点赞一次</div>
            <div>4. 观众期待值用于后期运营利润的分配</div>
            <div>5. 点击"查看详情"可以进入创意详细页面体验完整功能</div>
          </div>
        </Box>
      </Container>
    </Box>
  );
};

export default LikeTestPage;