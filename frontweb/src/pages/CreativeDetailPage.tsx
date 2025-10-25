import React, { useState, useEffect } from 'react';
import { Box, Container, Heading, Text, Button, Badge, Flex } from '@radix-ui/themes';
import { useNavigate, useParams } from 'react-router-dom';
import { useSuiClient, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useNetworkAwareConfig } from '../hooks/useNetworkAwareConfig';
import { usePoints } from '../hooks/usePoints';
import { useCreativeLikes } from '../hooks/useCreativeLikes';
import { CATEGORY_DISPLAY, TAG_DISPLAY } from '../config/categories';
import { parseCreativeContent, updateBackgroundImage } from '../utils/contentUtils';
import Navbar from '../components/Navbar';

const CreativeDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { packageId, isContractDeployed } = useNetworkAwareConfig();
  const { points, spendPoints } = usePoints();
  const { likeCreative, getCreativeExpectation, hasUserLiked, getUserLikePoints } = useCreativeLikes();
  
  const [creative, setCreative] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likeAmount, setLikeAmount] = useState(10);
  const [isLiking, setIsLiking] = useState(false);
  const [showBgModal, setShowBgModal] = useState(false);
  const [bgImageUrl, setBgImageUrl] = useState('');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [isEditingDetailedDesc, setIsEditingDetailedDesc] = useState(false);
  const [editedDetailedDescription, setEditedDetailedDescription] = useState('');

  // 获取创意详情
  useEffect(() => {
    const fetchCreative = async () => {
      if (!id) {
        setError('创意ID不能为空');
        setLoading(false);
        return;
      }

      // 处理测试创意
      if (id.startsWith('test-creative-')) {
        const testCreatives = {
          'test-creative-1': {
            id: 'test-creative-1',
            title: '测试创意：AI生成的游戏角色',
            description: '这是一个使用AI技术生成的游戏角色设计，包含完整的动画序列和技能效果。角色设计融合了现代科技感和传统文化元素，具有独特的视觉风格和丰富的背景故事。',
            category: 'game_assets',
            tags: ['AI生成', '游戏角色', '动画', '科技'],
            creator: currentAccount?.address || '0x123...abc',
            createdAt: Date.now(),
            content: JSON.stringify({
              text: '这是一个使用AI技术生成的游戏角色设计，包含完整的动画序列和技能效果。',
              background_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
              detailed_description: '## 技术实现细节\n\n### AI模型选择\n- 使用Stable Diffusion XL作为主要生成模型\n- 结合ControlNet进行姿态控制\n- 使用LoRA微调模型以适应特定艺术风格\n\n### 动画制作流程\n1. **角色建模**: 使用Blender进行3D建模，确保多边形数量适中\n2. **骨骼绑定**: 采用Advanced Skeleton插件进行自动骨骼绑定\n3. **动画制作**: 使用Mixamo动作库作为基础，手动调整关键帧\n4. **特效制作**: 使用After Effects制作技能特效\n\n### 技能系统设计\n- **主动技能**: 火焰冲击、冰霜护盾、雷电链\n- **被动技能**: 元素亲和、伤害减免、生命恢复\n- **终极技能**: 元素爆发，造成范围伤害并施加元素效果\n\n### 性能优化\n- 使用LOD系统，根据距离调整模型精度\n- 实现遮挡剔除，减少不必要的渲染\n- 采用对象池技术管理特效实例'
            })
          },
          'test-creative-2': {
            id: 'test-creative-2',
            title: '测试创意：区块链游戏概念',
            description: '一个基于区块链的策略游戏概念，玩家可以真正拥有游戏内资产。游戏采用去中心化的经济模型，玩家的每一个决策都会影响整个游戏世界的发展。',
            category: 'game_concept',
            tags: ['区块链', '策略游戏', '去中心化', 'NFT'],
            creator: currentAccount?.address || '0x456...def',
            createdAt: Date.now(),
            content: JSON.stringify({
              text: '一个基于区块链的策略游戏概念，玩家可以真正拥有游戏内资产。',
              background_image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop',
              detailed_description: '## 游戏核心机制\n\n### 区块链集成\n- **智能合约**: 使用Solidity开发，部署在以太坊主网\n- **NFT标准**: 遵循ERC-721标准，确保资产唯一性和可交易性\n- **代币经济**: 采用ERC-20代币作为游戏内货币\n\n### 游戏玩法\n1. **资源管理**: 玩家需要管理土地、建筑、军队等资源\n2. **战略决策**: 通过投票机制影响游戏世界发展\n3. **PvP战斗**: 实时策略战斗，胜利者获得奖励\n4. **联盟系统**: 玩家可以组建联盟，共同发展\n\n### 经济模型\n- **土地拍卖**: 初始土地通过拍卖方式分配\n- **税收系统**: 联盟可以对辖区内的交易征税\n- **奖励机制**: 参与游戏治理和战斗获得代币奖励\n\n### 技术架构\n- **前端**: 使用React + WebGL开发\n- **后端**: Node.js + GraphQL API\n- **区块链**: 以太坊 + Layer2解决方案\n- **存储**: IPFS分布式存储游戏资产'
            })
          }
        };
        
        const testCreative = testCreatives[id as keyof typeof testCreatives];
        if (testCreative) {
          setCreative(testCreative);
        } else {
          setError('测试创意不存在');
        }
        setLoading(false);
        return;
      }

      // 处理真实创意（需要合约部署）
      if (!isContractDeployed || !packageId) {
        setError('合约未部署，无法获取链上创意');
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
          
          try {
            // 获取完整的创意对象信息
            const creativeObject = await suiClient.getObject({
              id: data.creative_id,
              options: {
                showContent: true,
                showType: true
              }
            });

            let content = '';
            if (creativeObject.data?.content && 'fields' in creativeObject.data.content) {
              const fields = creativeObject.data.content.fields as any;
              content = fields.content || '';
            }
            
            setCreative({
              id: data.creative_id,
              title: data.title,
              description: data.description,
              content: content,
              category: data.category,
              tags: data.tags || [],
              creator: data.creator,
              createdAt: parseInt(data.created_at)
            });
          } catch (err) {
            console.error('获取创意对象失败:', err);
            // 如果获取对象失败，使用事件数据
            setCreative({
              id: data.creative_id,
              title: data.title,
              description: data.description,
              content: '',
              category: data.category,
              tags: data.tags || [],
              creator: data.creator,
              createdAt: parseInt(data.created_at)
            });
          }
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
  }, [id, packageId, isContractDeployed, currentAccount?.address]);

  const handleBack = () => {
    navigate('/');
  };

  const handleDelete = () => {
    alert('创意删除功能暂时不可用，请联系管理员处理。');
  };

  // 检查是否为创作者
  const isCreator = currentAccount && creative && currentAccount.address === creative.creator;
  
  // 获取创意期待值信息
  const expectation = creative ? getCreativeExpectation(creative.id) : null;
  const userHasLiked = creative ? hasUserLiked(creative.id) : false;
  const userLikePoints = creative ? getUserLikePoints(creative.id) : 0;

  // 处理点赞
  const handleLike = async () => {
    if (!creative || !currentAccount || userHasLiked || isLiking) return;
    
    if (points < likeAmount) {
      alert(`积分不足！当前积分：${points} CYKJ，需要：${likeAmount} CYKJ`);
      return;
    }

    setIsLiking(true);
    
    try {
      // 消费积分
      const success = spendPoints(likeAmount, `点赞创意: ${creative.title}`);
      if (!success) {
        alert('积分消费失败');
        setIsLiking(false);
        return;
      }

      // 记录点赞
      const likeSuccess = likeCreative(creative.id, likeAmount);
      if (!likeSuccess) {
        alert('点赞失败，可能已经点赞过了');
        setIsLiking(false);
        return;
      }

      alert(`点赞成功！消费 ${likeAmount} CYKJ 积分，为创意增加了 ${likeAmount} 观众期待值！`);
    } catch (err) {
      console.error('点赞失败:', err);
      alert('点赞失败，请重试');
    } finally {
      setIsLiking(false);
    }
  };

  const handleUpdateBackground = () => {
    if (!creative || !currentAccount || !isCreator) return;
    
    if (!bgImageUrl.trim()) {
      alert('请输入背景图片URL');
      return;
    }

    try {
      // 更新本地数据
      const updatedContent = updateBackgroundImage(creative.content || '{}', bgImageUrl);
      setCreative({
        ...creative,
        content: updatedContent
      });
      
      setShowBgModal(false);
      setBgImageUrl('');
      // TODO: 后续可以添加链上更新content字段的功能
      alert('背景图片更新成功！（仅本地更新）');
    } catch (err) {
      console.error('更新背景失败:', err);
      alert('更新背景失败，请重试');
    }
  };

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
  const creativeContent = creative ? parseCreativeContent(creative.content || '{}') : null;

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
          <div 
            className="relative h-96 md:h-[500px] overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20"
            style={{
              backgroundImage: creativeContent?.background_image 
                ? `url(${creativeContent.background_image})` 
                : undefined,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {!creativeContent?.background_image && (
              <>
                <div className="absolute inset-0 bg-grid bg-[length:40px_40px] opacity-20"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="text-8xl opacity-30">
                    {categoryConfig?.icon || '💡'}
                  </div>
                </div>
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <Heading as="h1" size="8" className="mb-4">{creative.title}</Heading>
              <div className="flex items-center gap-4 text-sm">
                <span>分类: {categoryConfig?.name || creative.category}</span>
                <span>作者: {creative.creator.slice(0, 6)}...{creative.creator.slice(-4)}</span>
                <span>发布时间: {new Date(creative.createdAt).toLocaleString()}</span>
              </div>
            </div>
            {isCreator && (
              <button
                onClick={() => setShowBgModal(true)}
                className="absolute top-4 right-4 px-3 py-1 bg-black/50 hover:bg-black/70 text-white text-sm rounded-lg transition-colors"
              >
                🇺️ 修改背景
              </button>
            )}
          </div>
        </Box>

        {/* 作品详情 */}
        <Box className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* 左侧详情 */}
          <Box className="lg:col-span-2">
            <Box className="glass rounded-2xl p-8">
              <Flex justify="between" align="center" className="mb-6">
                <Heading as="h2" size="5" className="text-black">创意介绍</Heading>
                {isCreator && (
                  <button
                    onClick={() => {
                      setIsEditingDesc(true);
                      setEditedDescription(creative.description);
                    }}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                  >
                    ✏️ 编辑
                  </button>
                )}
              </Flex>
              
              {isEditingDesc && isCreator ? (
                <div className="mb-6">
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    rows={6}
                    placeholder="请输入创意描述..."
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={async () => {
                        if (!packageId || !currentAccount) {
                          alert('合约未部署或未连接钱包');
                          return;
                        }

                        try {
                          const tx = new Transaction();
                          tx.moveCall({
                            target: `${packageId}::creative::update_creative_entry`,
                            arguments: [
                              tx.object(creative.id),
                              tx.pure.option('string', null), // title
                              tx.pure.option('string', editedDescription), // description
                              tx.pure.option('string', null), // content
                              tx.pure.option('string', null), // category
                              tx.pure.option('vector<string>', null), // tags
                            ],
                          });

                          await signAndExecute({ transaction: tx });
                          
                          setCreative({
                            ...creative,
                            description: editedDescription
                          });
                          setIsEditingDesc(false);
                          alert('描述更新成功！');
                        } catch (err) {
                          console.error('更新失败:', err);
                          alert('更新失败，请重试');
                        }
                      }}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingDesc(false);
                        setEditedDescription('');
                      }}
                      className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <Text size="3" className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {creative.description}
                  </Text>
                </div>
              )}

              {/* 详细描述部分 */}
              <div className="mb-6">
                <Flex justify="between" align="center" className="mb-4">
                  <Heading as="h3" size="4" className="text-black">详细描述</Heading>
                  {isCreator && (
                    <button
                      onClick={() => {
                        setIsEditingDetailedDesc(true);
                        // 从content中获取详细描述，如果没有则使用默认值
                        const detailedDesc = creativeContent?.detailed_description || '';
                        setEditedDetailedDescription(detailedDesc);
                      }}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                    >
                      ✏️ 编辑详细描述
                    </button>
                  )}
                </Flex>
                
                {isEditingDetailedDesc && isCreator ? (
                  <div className="mb-6">
                    <textarea
                      value={editedDetailedDescription}
                      onChange={(e) => setEditedDetailedDescription(e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      rows={8}
                      placeholder="请输入详细描述，可以包含更多技术细节、设计理念、实现方案等..."
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={async () => {
                          if (!packageId || !currentAccount) {
                            alert('合约未部署或未连接钱包');
                            return;
                          }

                          try {
                            // 更新content中的详细描述
                            const currentContent = creativeContent || {};
                            const updatedContent = {
                              ...currentContent,
                              detailed_description: editedDetailedDescription
                            };
                            
                            // 调用合约更新content字段
                            const tx = new Transaction();
                            tx.moveCall({
                              target: `${packageId}::creative::update_creative_entry`,
                              arguments: [
                                tx.object(creative.id),
                                tx.pure.option('string', null), // title
                                tx.pure.option('string', null), // description
                                tx.pure.option('string', JSON.stringify(updatedContent)), // content
                                tx.pure.option('string', null), // category
                                tx.pure.option('vector<string>', null), // tags
                              ],
                            });

                            await signAndExecute({ transaction: tx });
                            
                            // 更新本地状态
                            setCreative({
                              ...creative,
                              content: JSON.stringify(updatedContent)
                            });
                            
                            setIsEditingDetailedDesc(false);
                            alert('详细描述更新成功！');
                          } catch (err) {
                            console.error('更新详细描述失败:', err);
                            alert('更新详细描述失败，请重试');
                          }
                        }}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingDetailedDesc(false);
                          setEditedDetailedDescription('');
                        }}
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    {creativeContent?.detailed_description ? (
                      <Text size="3" className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {creativeContent.detailed_description}
                      </Text>
                    ) : (
                      <Text size="3" className="text-gray-500 italic">
                        暂无详细描述
                      </Text>
                    )}
                  </div>
                )}
              </div>

              <Heading as="h3" size="4" className="text-black mb-4">标签</Heading>
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
              <Heading as="h3" size="4" className="text-black mb-4">作品信息</Heading>
              <div className="space-y-3 text-gray-700">
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

            <Box className="glass rounded-2xl p-6 mb-6">
              <Heading as="h3" size="4" className="text-black mb-4">观众期待值</Heading>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between items-center">
                  <Text size="2">总期待值</Text>
                  <Text size="3" className="font-bold text-yellow-400">
                    {expectation?.totalExpectation || 0} 🌟
                  </Text>
                </div>
                <div className="flex justify-between items-center">
                  <Text size="2">点赞人数</Text>
                  <Text size="2">{expectation?.likeCount || 0} 人</Text>
                </div>
                {userHasLiked && (
                  <div className="flex justify-between items-center">
                    <Text size="2">我的贡献</Text>
                    <Text size="2" className="text-green-400">{userLikePoints} CYKJ</Text>
                  </div>
                )}
              </div>
            </Box>

            <Box className="glass rounded-2xl p-6">
              <Heading as="h3" size="4" className="text-black mb-4">互动操作</Heading>
              <Flex direction="column" gap="3">
                {!userHasLiked ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Text size="2" className="text-gray-700">点赞积分:</Text>
                      <input
                        type="number"
                        min="1"
                        max={points}
                        value={likeAmount}
                        onChange={(e) => setLikeAmount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      />
                      <Text size="1" className="text-gray-400">CYKJ</Text>
                    </div>
                    <Text size="1" className="text-gray-600">
                      当前积分: {points} CYKJ
                    </Text>
                    <Button 
                      className={`${isLiking || points < likeAmount ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                      onClick={handleLike}
                      disabled={isLiking || points < likeAmount || !currentAccount}
                    >
                      {isLiking ? '点赞中...' : `👍 点赞 (${likeAmount} CYKJ)`}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Text size="2" className="text-green-400">✅ 已点赞</Text>
                    <Text size="1" className="text-gray-400 block mt-1">
                      贡献了 {userLikePoints} CYKJ 观众期待值
                    </Text>
                  </div>
                )}
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

      {/* 背景图片修改模态框 */}
      {showBgModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">修改背景图片</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                图片URL地址
              </label>
              <input
                type="url"
                value={bgImageUrl}
                onChange={(e) => setBgImageUrl(e.target.value)}
                placeholder="请输入图片URL地址"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="text-xs text-gray-500 mb-4">
              建议使用高质量图片，尺寸为 800x600 或更大
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowBgModal(false);
                  setBgImageUrl('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleUpdateBackground}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                确认修改
              </button>
            </div>
          </div>
        </div>
      )}
    </Box>
  );
};

export default CreativeDetailPage;
