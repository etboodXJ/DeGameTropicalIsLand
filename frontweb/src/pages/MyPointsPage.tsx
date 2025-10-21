import React from 'react';
import { Box, Container, Flex, Heading, Text } from '@radix-ui/themes';
import Navbar from '../components/Navbar';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { usePoints } from '../hooks/usePoints';
import { useNavigate } from 'react-router-dom';

const MyPointsPage = () => {
  const currentAccount = useCurrentAccount();
  const { points, records } = usePoints();
  const navigate = useNavigate();

  const platforms = {
    bucket: { name: 'Bucket Protocol', icon: 'BUCKET', color: 'blue' },
    cetus: { name: 'Cetus Protocol', icon: 'CETUS', color: 'purple' },
    navi: { name: 'Navi Protocol', icon: 'NAVI', color: 'green' }
  };

  if (!currentAccount) {
    return (
      <Box className="min-h-screen">
        <Navbar />
        <Container className="container mx-auto p-6">
          <Box className="text-center mt-20">
            <Text size="4" className="text-gray-400">请先连接钱包以查看积分记录</Text>
          </Box>
        </Container>
      </Box>
    );
  }

  const totalDeposited = records.reduce((sum, record) => sum + record.amount, 0);
  const totalEarned = records.reduce((sum, record) => sum + record.points, 0);

  return (
    <Box className="min-h-screen">
      <Navbar />
      <Container className="container mx-auto p-6">
        {/* 页面标题 */}
        <Flex align="center" gap="4" className="mb-8">
          <button 
            onClick={() => navigate('/points')}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← 返回积分中心
          </button>
          <Heading as="h1" size="6" className="text-gray-800">我的积分记录</Heading>
        </Flex>

        {/* 积分统计 */}
        <Flex className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Box className="glass rounded-xl p-6 text-center">
            <Text size="2" className="text-gray-600 mb-2">当前积分</Text>
            <Text size="6" className="text-yellow-600 font-bold">
              {points.toLocaleString()}
            </Text>
            <Text size="2" className="text-gray-600">CYKJ</Text>
          </Box>
          
          <Box className="glass rounded-xl p-6 text-center">
            <Text size="2" className="text-gray-600 mb-2">累计存款</Text>
            <Text size="6" className="text-blue-600 font-bold">
              {totalDeposited.toFixed(2)}
            </Text>
            <Text size="2" className="text-gray-600">SUI</Text>
          </Box>
          
          <Box className="glass rounded-xl p-6 text-center">
            <Text size="2" className="text-gray-600 mb-2">累计获得</Text>
            <Text size="6" className="text-green-600 font-bold">
              {totalEarned.toLocaleString()}
            </Text>
            <Text size="2" className="text-gray-600">CYKJ</Text>
          </Box>
        </Flex>

        {/* 积分记录列表 */}
        <Box className="glass rounded-xl p-6">
          <Heading as="h2" size="4" className="text-gray-800 mb-6">交易记录</Heading>
          
          {records.length === 0 ? (
            <Box className="text-center py-12">
              <Text size="6" className="mb-4 block">📊</Text>
              <Text className="text-gray-600 mb-4">暂无积分记录</Text>
              <button 
                onClick={() => navigate('/points')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
              >
                开始赚取积分
              </button>
            </Box>
          ) : (
            <Box className="space-y-4">
              {records.map((record) => {
                const platform = platforms[record.platform];
                return (
                  <Box
                    key={record.id}
                    className="p-4 bg-white/5 rounded-lg border border-gray-700/30 hover:bg-white/10 transition-colors"
                  >
                    <Flex justify="between" align="center">
                      <Flex align="center" gap="4">
                        <Box className="text-center">
                          <Text size="4" className="font-bold text-gray-800">{platform.icon}</Text>
                        </Box>
                        <Box>
                          <Text className="text-gray-800 font-medium mb-1">
                            {platform.name}
                          </Text>
                          <Text size="2" className="text-gray-600">
                            存入 {record.amount} SUI
                          </Text>
                          {record.txHash && (
                            <Text size="1" className="text-gray-500 font-mono">
                              {record.txHash.slice(0, 8)}...{record.txHash.slice(-8)}
                            </Text>
                          )}
                        </Box>
                      </Flex>
                      
                      <Box className="text-right">
                        <Text className="text-yellow-600 font-bold mb-1">
                          +{record.points.toLocaleString()} CYKJ
                        </Text>
                        <Text size="2" className="text-gray-600">
                          {new Date(record.timestamp).toLocaleString()}
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>

        {/* 积分使用说明 */}
        <Box className="glass rounded-xl p-6 mt-8">
          <Heading as="h3" size="3" className="text-gray-800 mb-4">积分使用说明</Heading>
          <Box className="space-y-3">
            <Flex align="center" gap="3">
              <Text size="4">🎯</Text>
              <Text className="text-gray-700">
                使用CYKJ积分投票支持您喜欢的创意项目
              </Text>
            </Flex>
            <Flex align="center" gap="3">
              <Text size="4">💰</Text>
              <Text className="text-gray-700">
                项目成功上线后，根据投票比例获得收益分成
              </Text>
            </Flex>
            <Flex align="center" gap="3">
              <Text size="4">🎁</Text>
              <Text className="text-gray-700">
                参与平台活动，获得额外积分奖励
              </Text>
            </Flex>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default MyPointsPage;