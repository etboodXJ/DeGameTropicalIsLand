import React, { useState } from 'react';
import { Box, Container, Flex, Heading, Text, Button } from '@radix-ui/themes';
import Navbar from '../components/Navbar';
import DeFiIntegration from '../components/DeFiIntegration';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { usePoints } from '../hooks/usePoints';
import { useNavigate } from 'react-router-dom';

type Platform = 'bucket' | 'cetus' | 'navi';

const PointsPage = () => {
  const currentAccount = useCurrentAccount();
  const { points, records } = usePoints();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const navigate = useNavigate();

  const platforms = [
    {
      id: 'bucket' as Platform,
      name: 'Bucket Protocol',
      description: '去中心化借贷协议',
      color: 'from-blue-500 to-blue-600',
      icon: '🪣'
    },
    {
      id: 'cetus' as Platform,
      name: 'Cetus Protocol',
      description: 'DEX流动性协议',
      color: 'from-purple-500 to-purple-600',
      icon: '🐋'
    },
    {
      id: 'navi' as Platform,
      name: 'Navi Protocol',
      description: '一站式DeFi协议',
      color: 'from-green-500 to-green-600',
      icon: '🧭'
    }
  ];

  const handlePlatformSelect = (platform: Platform) => {
    setSelectedPlatform(platform);
  };

  const handleBackToList = () => {
    setSelectedPlatform(null);
  };

  if (!currentAccount) {
    return (
      <Box className="min-h-screen">
        <Navbar />
        <Container className="container mx-auto p-6">
          <Box className="text-center mt-20">
            <Text size="4" className="text-gray-400">请先连接钱包以查看积分</Text>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen">
      <Navbar />
      <Container className="container mx-auto p-6">
        {!selectedPlatform ? (
          <>
            {/* 积分总览 */}
            <Box className="mb-8">
              <Box className="glass rounded-2xl p-8 text-center">
                <Heading as="h1" size="6" className="text-white mb-4">我的积分</Heading>
                <Text size="8" className="text-yellow-400 font-bold mb-2">
                  {points.toLocaleString()} CYKJ
                </Text>
                <Text size="3" className="text-gray-400 mb-4">
                  通过DeFi操作获得积分奖励
                </Text>
                <Button
                  onClick={() => navigate('/my-points')}
                  variant="outline"
                  className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                >
                  查看详细记录
                </Button>
              </Box>
            </Box>

            {/* 平台选择 */}
            <Box className="mb-8">
              <Heading as="h2" size="4" className="text-white mb-6">选择DeFi平台</Heading>
              <Flex className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {platforms.map((platform) => (
                  <Box
                    key={platform.id}
                    className="glass rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300"
                    onClick={() => handlePlatformSelect(platform.id)}
                  >
                    <Box className="text-center">
                      <Text size="6" className="mb-4 block">{platform.icon}</Text>
                      <Heading as="h3" size="3" className="text-white mb-2">
                        {platform.name}
                      </Heading>
                      <Text size="2" className="text-gray-400 mb-4">
                        {platform.description}
                      </Text>
                      <Button
                        className={`w-full bg-gradient-to-r ${platform.color} text-white rounded-lg hover:opacity-90 transition-opacity`}
                      >
                        进入存款
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Flex>
            </Box>

            {/* 最近积分记录 */}
            <Box>
              <Flex justify="between" align="center" className="mb-6">
                <Heading as="h2" size="4" className="text-white">最近记录</Heading>
                <Button
                  onClick={() => navigate('/my-points')}
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  查看全部 →
                </Button>
              </Flex>
              <Box className="glass rounded-xl p-6">
                {records.length === 0 ? (
                  <Text className="text-gray-400 text-center py-8">
                    暂无积分记录，开始您的第一笔DeFi操作吧！
                  </Text>
                ) : (
                  <Box className="space-y-4">
                    {records.slice(0, 3).map((record) => (
                      <Flex
                        key={record.id}
                        justify="between"
                        align="center"
                        className="p-4 bg-white/5 rounded-lg"
                      >
                        <Flex align="center" gap="3">
                          <Text size="4">
                            {platforms.find(p => p.id === record.platform)?.icon}
                          </Text>
                          <Box>
                            <Text className="text-white font-medium">
                              {platforms.find(p => p.id === record.platform)?.name}
                            </Text>
                            <Text size="2" className="text-gray-400">
                              存入 {record.amount} SUI
                            </Text>
                          </Box>
                        </Flex>
                        <Box className="text-right">
                          <Text className="text-yellow-400 font-medium">
                            +{record.points} CYKJ
                          </Text>
                          <Text size="2" className="text-gray-400">
                            {new Date(record.timestamp).toLocaleDateString()}
                          </Text>
                        </Box>
                      </Flex>
                    ))}
                    {records.length > 3 && (
                      <Box className="text-center pt-4">
                        <Text size="2" className="text-gray-400">
                          还有 {records.length - 3} 条记录...
                        </Text>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          </>
        ) : (
          <DeFiIntegration 
            platform={selectedPlatform} 
            onBack={handleBackToList}
          />
        )}
      </Container>
    </Box>
  );
};



export default PointsPage;