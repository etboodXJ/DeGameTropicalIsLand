import React, { useState, useEffect } from 'react';
import { useSuiClient } from '@mysten/dapp-kit';
import { useNavigate } from 'react-router-dom';
import { useNetworkAwareConfig } from '../hooks/useNetworkAwareConfig';
import { CATEGORY_DISPLAY, TAG_DISPLAY } from '../config/categories';
import { Box, Flex, Heading, Text } from '@radix-ui/themes';

interface Creative {
  id: string;
  creator: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  createdAt: number;
  status: number;
  totalExpectation: number;
}

interface CreativeListProps {
  limit?: number;
  showFilters?: boolean;
}

const CreativeList: React.FC<CreativeListProps> = ({ 
  limit = 10, 
  showFilters = false 
}) => {
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suiClient = useSuiClient();
  const navigate = useNavigate();
  const { packageId, isContractDeployed } = useNetworkAwareConfig();

  // 获取创意列表
  const fetchCreatives = async () => {
    if (!isContractDeployed || !packageId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 查询创意提交事件
      const events = await suiClient.queryEvents({
        query: {
          MoveEventType: `${packageId}::creative::CreativeSubmitted`
        },
        limit: limit,
        order: 'descending'
      });

      // 解析事件数据
      const creativesData: Creative[] = [];
      
      for (const event of events.data) {
        if (event.parsedJson) {
          const data = event.parsedJson as any;
          
          creativesData.push({
            id: data.creative_id,
            creator: data.creator,
            title: data.title,
            description: data.description,
            category: data.category,
            tags: data.tags || [],
            createdAt: parseInt(data.created_at),
            status: 1, // 已提交状态
            totalExpectation: 0
          });
        }
      }
      
      setCreatives(creativesData);

    } catch (err) {
      console.error('获取创意列表失败:', err);
      setError('获取创意列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatives();
  }, [packageId, isContractDeployed]);

  // 格式化地址显示
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // 获取状态显示
  const getStatusDisplay = (status: number) => {
    const statusMap = {
      0: { text: '草稿', color: 'text-gray-400' },
      1: { text: '已提交', color: 'text-blue-400' },
      2: { text: '审核中', color: 'text-yellow-400' },
      3: { text: '已发布', color: 'text-green-400' },
      4: { text: '已拒绝', color: 'text-red-400' }
    };
    return statusMap[status as keyof typeof statusMap] || { text: '未知', color: 'text-gray-400' };
  };

  if (!isContractDeployed) {
    return (
      <Box className="text-center py-8">
        <Text className="text-gray-400">合约未部署，无法显示创意列表</Text>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
        <Text className="text-gray-400 mt-2">加载中...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="text-center py-8">
        <Text className="text-red-400">{error}</Text>
        <button 
          onClick={fetchCreatives}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          重试
        </button>
      </Box>
    );
  }

  if (creatives.length === 0) {
    return (
      <Box className="text-center py-8">
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <Text className="text-gray-400">暂无创意作品</Text>
        <Text size="2" className="text-gray-500 mt-1">成为第一个提交创意的人吧！</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Flex className="flex justify-between items-center mb-6">
        <Heading as="h3" size="4" className="text-white">最新创意</Heading>
        <button 
          onClick={fetchCreatives}
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          刷新
        </button>
      </Flex>

      <Flex className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creatives.map((creative) => {
          const categoryConfig = CATEGORY_DISPLAY[creative.category as keyof typeof CATEGORY_DISPLAY];
          const statusDisplay = getStatusDisplay(creative.status);

          return (
            <Box 
              key={creative.id} 
              className="glass rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 group cursor-pointer"
              onClick={() => navigate(`/creative/${creative.id}`)}
            >
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                <div className="absolute inset-0 bg-grid bg-[length:40px_40px] opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${statusDisplay.color} bg-black/30 backdrop-blur-sm`}>
                    {statusDisplay.text}
                  </span>
                </div>
                
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="text-6xl opacity-30">
                    {categoryConfig?.icon || '💡'}
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4">
                  <Heading as="h4" size="3" className="text-white font-medium mb-1 line-clamp-1">
                    {creative.title}
                  </Heading>
                  <Text size="1" className="text-gray-300 line-clamp-2">
                    {creative.description}
                  </Text>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  {categoryConfig && (
                    <span 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: `${categoryConfig.color}20`,
                        color: categoryConfig.color,
                        border: `1px solid ${categoryConfig.color}30`
                      }}
                    >
                      {categoryConfig.icon} {categoryConfig.name}
                    </span>
                  )}
                  <Text size="1" className="text-gray-500">
                    {formatAddress(creative.creator)}
                  </Text>
                </div>
                
                {/* 标签显示 */}
                {creative.tags && creative.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {creative.tags.slice(0, 3).map((tag, index) => {
                      const tagConfig = TAG_DISPLAY[tag];
                      return (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-700/50 text-gray-300"
                        >
                          {tagConfig?.name || tag}
                        </span>
                      );
                    })}
                    {creative.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{creative.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    {creative.totalExpectation > 0 && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        {creative.totalExpectation}
                      </div>
                    )}
                  </div>
                  <div>
                    {new Date(creative.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Box>
          );
        })}
      </Flex>

      {creatives.length >= limit && (
        <Box className="text-center mt-6">
          <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
            查看更多
          </button>
        </Box>
      )}
    </Box>
  );
};

export default CreativeList;