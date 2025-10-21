import React, { useState, useEffect } from 'react';
import { Box, Container, Heading, Text, Button, Badge, Flex } from '@radix-ui/themes';
import { useNavigate, useParams } from 'react-router-dom';
import { useSuiClient, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useNetworkAwareConfig } from '../hooks/useNetworkAwareConfig';
import { CATEGORY_DISPLAY, TAG_DISPLAY } from '../config/categories';

const CreativeDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { packageId, isContractDeployed } = useNetworkAwareConfig();
  
  const [creative, setCreative] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取创意详情
  useEffect(() => {
    const fetchCreative = async () => {
      if (!id || !isContractDeployed || !packageId) {
        setError('参数错误或合约未部署');
        setLoading(false);
        return;
      }

      try {
        const events = await suiClient.queryEvents({
          query: {
            MoveEventType: `${packageId}::creative::CreativeSubmitted`
          },
          limit: 50,
          order: 'descending'
        });

        const targetEvent = events.data.find(event => {
          if (event.parsedJson) {
            const data = event.parsedJson as any;
            return data.creative_id === id;
          }
          return false;
        });

        if (targetEvent && targetEvent.parsedJson) {
          const data = targetEvent.parsedJson as any;
          setCreative({
            id: data.creative_id,
            title: data.title,
            description: data.description,
            category: data.category,
            tags: data.tags || [],
            creator: data.creator,
            createdAt: parseInt(data.created_at)
          });
        } else {
          setError('未找到该创意');
        }
      } catch (err) {
        console.error('获取创意详情失败:', err);
        setError('获取创意详情失败');
      } finally {
        setLoading(false);
      }
    };

    fetchCreative();
  }, [id, packageId, isContractDeployed]);

  const handleBack = () => {
    navigate('/');
  };

  const handleDelete = async () => {
    if (!currentAccount) {
      alert('请先连接钱包');
      return;
    }

    if (!creative) {
      return;
    }

    // 检查是否为创作者
    if (currentAccount.address !== creative.creator) {
      alert('您不是创作者，无法删除本创意');
      return;
    }

    if (!confirm('确定要删除这个创意吗？此操作不可恢复。')) {
      return;
    }

    try {
      const tx = new Transaction();
      
      // 调用标记删除函数
      tx.moveCall({
        target: `${packageId}::creative::mark_creative_as_deleted`,
        arguments: [
          tx.object(creative.id),
          tx.object('0x6')
        ],
      });

      await signAndExecute({ transaction: tx });
      
      alert('创意已标记为删除，不会在列表中显示');
      navigate('/');
      
    } catch (error) {
      console.error('删除创意失败:', error);
      alert(`删除失败: ${error instanceof Error ? error.message : '请重试'}`);
    }
  };

  // 检查是否为创作者
  const isCreator = currentAccount && creative && currentAccount.address === creative.creator;

  if (loading) {
    return (
      <Box className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        <Text className="text-gray-400 ml-2">加载中...</Text>
      </Box>
    );
  }

  if (error || !creative) {
    return (
      <Box className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Text className="text-red-400 mb-4">{error || '创意不存在'}</Text>
          <button 
            onClick={handleBack}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors cursor-pointer"
          >
            返回
          </button>
        </div>
      </Box>
    );
  }

  const categoryConfig = CATEGORY_DISPLAY[creative.category as keyof typeof CATEGORY_DISPLAY];

  return (
    <Box className="min-h-screen">
      {/* 返回按钮 */}
      <div className="p-6 relative z-50">
        <button 
          onClick={handleBack}
          className="mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors cursor-pointer relative z-50"
        >
          ← 返回
        </button>
      </div>

      <Container className="container mx-auto p-6 relative z-10">
        {/* 作品展示区域 */}
        <Box className="glass rounded-2xl overflow-hidden mb-8">
          <div className="relative h-96 md:h-[500px] overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20">
            <div className="absolute inset-0 bg-grid bg-[length:40px_40px] opacity-20"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-8xl opacity-30">
                {categoryConfig?.icon || '💡'}
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <Heading as="h1" size="8" className="mb-4">{creative.title}</Heading>
              <div className="flex items-center gap-4 text-sm">
                <span>分类: {categoryConfig?.name || creative.category}</span>
                <span>作者: {creative.creator.slice(0, 6)}...{creative.creator.slice(-4)}</span>
                <span>发布时间: {new Date(creative.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Box>

        {/* 作品详情 */}
        <Box className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* 左侧详情 */}
          <Box className="lg:col-span-2">
            <Box className="glass rounded-2xl p-8">
              <Heading as="h2" size="5" className="text-gray-100 mb-6">创意介绍</Heading>
              <Text size="3" className="text-gray-500 leading-relaxed mb-6">
                {creative.description}
              </Text>
              


              <Heading as="h3" size="4" className="text-gray-100 mb-4">标签</Heading>
              <Flex wrap="wrap" gap="2" className="mb-6">
                {creative.tags && creative.tags.length > 0 ? (
                  creative.tags.map((tag, index) => (
                    <Badge key={index} variant="surface" className="bg-blue-500/20 text-blue-400">
                      {TAG_DISPLAY[tag]?.name || tag}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="surface" className="bg-gray-500/20 text-gray-400">
                    无标签
                  </Badge>
                )}
              </Flex>
            </Box>
          </Box>

          {/* 右侧信息栏 */}
          <Box className="lg:col-span-1">
            <Box className="glass rounded-2xl p-6 mb-6">
              <Heading as="h3" size="4" className="text-gray-100 mb-4">作品信息</Heading>
              <div className="space-y-3 text-gray-500">
                <div>
                  <Text size="2" className="font-medium">分类</Text>
                  <Text size="1">{categoryConfig?.name || creative.category}</Text>
                </div>
                <div>
                  <Text size="2" className="font-medium">创作者</Text>
                  <Text size="1">{creative.creator.slice(0, 6)}...{creative.creator.slice(-4)}</Text>
                </div>
                <div>
                  <Text size="2" className="font-medium">发布时间</Text>
                  <Text size="1">{new Date(creative.createdAt).toLocaleString()}</Text>
                </div>
                <div>
                  <Text size="2" className="font-medium">创意ID</Text>
                  <Text size="1">{creative.id.slice(0, 8)}...</Text>
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
                {isCreator && (
                  <button 
                    onClick={handleDelete}
                    className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    🗑️ 删除创意
                  </button>
                )}
              </Flex>
            </Box>
          </Box>
        </Box>


      </Container>
    </Box>
  );
};

export default CreativeDetailPage;
