import React, { useState, useEffect } from 'react';
import { Box, Container, Heading, Text, Button, Badge, Flex } from '@radix-ui/themes';
import { useNavigate, useParams } from 'react-router-dom';
import { useSuiClient, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useNetworkAwareConfig } from '../hooks/useNetworkAwareConfig';
import { CATEGORY_DISPLAY, TAG_DISPLAY } from '../config/categories';
import Navbar from '../components/Navbar';

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

  const handleDelete = () => {
    alert('创意删除功能暂时不可用，请联系管理员处理。');
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
      <Navbar />
      
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
                  creative.tags.map((tag: string, index: number) => (
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
                  <div className="flex items-center gap-2">
                    <Text size="1" className="font-mono break-all">{creative.creator}</Text>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(creative.creator);
                        alert('创作者地址已复制到剪贴板');
                      }}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="复制地址"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <Text size="2" className="font-medium">发布时间</Text>
                  <Text size="1">{new Date(creative.createdAt).toLocaleString()}</Text>
                </div>
                <div>
                  <Text size="2" className="font-medium">创意ID</Text>
                  <div className="flex items-center gap-2">
                    <Text size="1" className="font-mono break-all">{creative.id}</Text>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(creative.id);
                        alert('创意ID已复制到剪贴板');
                      }}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="复制ID"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
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
                <Button 
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => {
                    const shareUrl = window.location.href;
                    const shareTitle = `发现一个精彩创意：${creative.title}`;
                    const shareText = `${creative.description.slice(0, 100)}${creative.description.length > 100 ? '...' : ''}`;
                    
                    // 创建分享菜单
                    const shareMenu = document.createElement('div');
                    shareMenu.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]';
                    shareMenu.innerHTML = `
                      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 class="text-lg font-semibold mb-4 text-gray-800">分享到</h3>
                        <div class="grid grid-cols-2 gap-3">
                          <button onclick="shareToWeChat()" class="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <span class="text-green-600 mr-2">📱</span>
                            <span class="text-gray-700">微信</span>
                          </button>
                          <button onclick="shareToWeibo()" class="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <span class="text-red-500 mr-2">📰</span>
                            <span class="text-gray-700">微博</span>
                          </button>
                          <button onclick="shareToTwitter()" class="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <span class="text-blue-500 mr-2">🐦</span>
                            <span class="text-gray-700">Twitter</span>
                          </button>
                          <button onclick="shareToDiscord()" class="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <span class="text-indigo-500 mr-2">🎮</span>
                            <span class="text-gray-700">Discord</span>
                          </button>
                          <button onclick="copyLink()" class="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <span class="text-gray-500 mr-2">🔗</span>
                            <span class="text-gray-700">复制链接</span>
                          </button>
                          <button onclick="closeShareMenu()" class="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <span class="text-gray-500 mr-2">❌</span>
                            <span class="text-gray-700">取消</span>
                          </button>
                        </div>
                      </div>
                    `;
                    
                    // 添加分享函数
                    (window as any).shareToWeChat = () => {
                      // 微信分享：复制链接到剪贴板
                      navigator.clipboard.writeText(shareUrl).then(() => {
                        alert('链接已复制到剪贴板！\n\n请打开微信，在聊天中粘贴分享。');
                      }).catch(() => {
                        alert('请手动复制链接分享到微信：\n' + shareUrl);
                      });
                      (window as any).closeShareMenu();
                    };
                    
                    (window as any).shareToWeibo = () => {
                      const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle + ' ' + shareText)}`;
                      window.open(weiboUrl, '_blank');
                      (window as any).closeShareMenu();
                    };
                    
                    (window as any).shareToTwitter = () => {
                      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle + ' ' + shareText)}&url=${encodeURIComponent(shareUrl)}`;
                      window.open(twitterUrl, '_blank');
                      (window as any).closeShareMenu();
                    };
                    
                    (window as any).shareToDiscord = () => {
                      // Discord 不支持直接分享，复制链接
                      navigator.clipboard.writeText(`${shareTitle}\n${shareText}\n${shareUrl}`);
                      alert('Discord 分享内容已复制到剪贴板，请粘贴到 Discord 频道中！');
                      (window as any).closeShareMenu();
                    };
                    
                    (window as any).copyLink = () => {
                      navigator.clipboard.writeText(shareUrl);
                      alert('链接已复制到剪贴板！');
                      (window as any).closeShareMenu();
                    };
                    
                    (window as any).closeShareMenu = () => {
                      document.body.removeChild(shareMenu);
                      delete (window as any).shareToWeChat;
                      delete (window as any).shareToWeibo;
                      delete (window as any).shareToTwitter;
                      delete (window as any).shareToDiscord;
                      delete (window as any).copyLink;
                      delete (window as any).closeShareMenu;
                    };
                    
                    document.body.appendChild(shareMenu);
                  }}
                >
                  🔄 分享作品
                </Button>
                <Button 
                  className="bg-gray-700 hover:bg-gray-600 text-white"
                  onClick={() => {
                    alert(`联系作者功能即将推出！\n\n作者地址：${creative.creator}\n\n您可以：\n1. 复制作者地址进行链上交互\n2. 等待站内消息系统上线\n3. 在创意评论区留言`);
                  }}
                >
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
