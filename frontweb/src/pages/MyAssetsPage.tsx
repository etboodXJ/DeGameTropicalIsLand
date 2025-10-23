import React, { useState } from 'react';
import { Box, Container, Heading, Text, Button, Flex, Dialog, Select } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useMyAssets } from '../hooks/useMyAssets';
import { CATEGORY_DISPLAY, CATEGORIES } from '../config/categories';
import { useNetworkAwareConfig } from '../hooks/useNetworkAwareConfig';
import Navbar from '../components/Navbar';
import ProfitChart from '../components/ProfitChart';

const MyAssetsPage = () => {
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { packageId } = useNetworkAwareConfig();
  const { myCreatives, profitReport, futureProfitProjection, loading, refreshAssets } = useMyAssets();
  const [activeTab, setActiveTab] = useState<'overview' | 'creatives' | 'profit' | 'projection'>('overview');
  const [updatingCategory, setUpdatingCategory] = useState(false);
  const [selectedCreative, setSelectedCreative] = useState<any>(null);
  const [newCategory, setNewCategory] = useState('');

  if (!currentAccount) {
    return (
      <Box className="min-h-screen">
        <Navbar />
        <Container className="container mx-auto p-6">
          <Box className="text-center py-20">
            <Text size="6" className="text-gray-500 mb-4">请先连接钱包</Text>
            <Text size="3" className="text-gray-600">连接钱包后查看您的创意资产</Text>
          </Box>
        </Container>
      </Box>
    );
  }

  const formatSUI = (amount: number) => {
    return amount.toFixed(4) + ' SUI';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('zh-CN');
  };

  const handleUpdateCategory = async () => {
    if (!selectedCreative || !newCategory || !packageId) {
      return;
    }

    setUpdatingCategory(true);
    try {
      const tx = new Transaction();
      
      // 调用智能合约的修改分类函数
      tx.moveCall({
        target: `${packageId}::creative::update_creative_category_entry`,
        arguments: [
          tx.object(selectedCreative.id),
          tx.pure.string(newCategory),
        ],
      });

      const result = await signAndExecute({ transaction: tx });
      
      console.log('项目成熟度更新成功:', result);
      alert('项目成熟度更新成功！');
      
      // 刷新数据
      await refreshAssets();
      
      // 关闭对话框
      setSelectedCreative(null);
      setNewCategory('');
      
    } catch (error) {
      console.error('更新项目成熟度失败:', error);
      alert(`更新项目成熟度失败: ${error instanceof Error ? error.message : '请重试'}`);
    } finally {
      setUpdatingCategory(false);
    }
  };

  const openCategoryDialog = (creative: any) => {
    setSelectedCreative(creative);
    setNewCategory(creative.category);
  };

  const closeCategoryDialog = () => {
    setSelectedCreative(null);
    setNewCategory('');
  };

  return (
    <Box className="min-h-screen">
      <Navbar />
      
      <Container className="container mx-auto p-6">
        <Box className="mb-8">
          <Flex justify="between" align="start">
            <Box>
              <Heading as="h1" size="8" className="text-black mb-4">我的创意资产</Heading>
              <Text size="3" className="text-gray-700 mb-6">
                管理您的创意作品，查看观众期待值和盈利预期
              </Text>
            </Box>
            <Button 
              className={`${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
              onClick={refreshAssets}
              disabled={loading}
            >
              {loading ? '刷新中...' : '刷新数据'}
            </Button>
          </Flex>
        </Box>

        {/* 标签页导航 */}
        <Box className="mb-8 relative z-10">
          <Flex gap="4" className="border-b border-gray-600">
            {[
              { key: 'overview', label: '总览' },
              { key: 'creatives', label: '我的创意' },
              { key: 'profit', label: '盈利报表' },
              { key: 'projection', label: '未来预期' }
            ].map(tab => (
              <button
                key={tab.key}
                className={`px-4 py-2 font-medium transition-colors cursor-pointer relative z-20 ${
                  activeTab === tab.key
                    ? 'text-black border-b-2 border-blue-400'
                    : 'text-gray-600 hover:text-black'
                }`}
                onClick={() => setActiveTab(tab.key as any)}
              >
                {tab.label}
              </button>
            ))}
          </Flex>
        </Box>

        {/* 总览页面 */}
        {activeTab === 'overview' && (
          <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Box className="glass rounded-2xl p-6">
              <Text size="2" className="text-gray-600 mb-2">创意总数</Text>
              <Text size="6" className="text-black font-bold">{profitReport.totalCreatives}</Text>
            </Box>
            <Box className="glass rounded-2xl p-6">
              <Text size="2" className="text-gray-600 mb-2">总期待值</Text>
              <Text size="6" className="text-yellow-400 font-bold">{profitReport.totalExpectation} 🌟</Text>
            </Box>
            <Box className="glass rounded-2xl p-6">
              <Text size="2" className="text-gray-600 mb-2">市场份额</Text>
              <Text size="6" className="text-green-400 font-bold">{profitReport.marketShare.toFixed(2)}%</Text>
            </Box>
            <Box className="glass rounded-2xl p-6">
              <Text size="2" className="text-gray-600 mb-2">预估月收益</Text>
              <Text size="6" className="text-blue-400 font-bold">{formatSUI(profitReport.estimatedMonthlyRevenue)}</Text>
            </Box>
          </Box>
        )}

        {/* 我的创意页面 */}
        {activeTab === 'creatives' && (
          <Box className="space-y-4">
            {myCreatives.length === 0 ? (
              <Box className="text-center py-20">
                <Text size="4" className="text-gray-700 mb-4">暂无创意作品</Text>
                <Button 
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => navigate('/submit')}
                >
                  发布第一个创意
                </Button>
              </Box>
            ) : (
              myCreatives.map(creative => {
                const categoryInfo = CATEGORY_DISPLAY[creative.category as keyof typeof CATEGORY_DISPLAY];
                return (
                  <Box key={creative.id} className="glass rounded-2xl p-6 relative" style={{ zIndex: 1 }}>
                    <Flex justify="between" align="start" className="mb-4">
                      <Box className="flex-1">
                        <Heading as="h3" size="4" className="text-black mb-2">
                          {creative.title}
                        </Heading>
                        <Text size="2" className="text-gray-700 mb-3">
                          {creative.description}
                        </Text>
                        <Flex gap="4" className="text-sm text-gray-700">
                          <span>成熟度: {categoryInfo?.name || creative.category}</span>
                          <span>发布时间: {formatDate(creative.createdAt)}</span>
                        </Flex>
                      </Box>
                      <Flex gap="2" className="relative z-10">
                        <Button
                          className="bg-blue-500 hover:bg-blue-600 text-white relative z-20 cursor-pointer"
                          onClick={() => openCategoryDialog(creative)}
                          style={{ pointerEvents: 'auto' }}
                        >
                          修改成熟度
                        </Button>
                        <Button
                          className="bg-gray-700 hover:bg-gray-600 text-white relative z-20 cursor-pointer"
                          onClick={() => navigate(`/creative/${creative.id}`)}
                          style={{ pointerEvents: 'auto' }}
                        >
                          查看详情
                        </Button>
                      </Flex>
                    </Flex>
                    
                    <Box className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-600">
                      <div className="text-center">
                        <Text size="1" className="text-gray-600">观众期待值</Text>
                        <Text size="3" className="text-yellow-400 font-bold">{creative.expectationValue} 🌟</Text>
                      </div>
                      <div className="text-center">
                        <Text size="1" className="text-gray-600">点赞人数</Text>
                        <Text size="3" className="text-blue-400 font-bold">{creative.likeCount} 👍</Text>
                      </div>
                      <div className="text-center">
                        <Text size="1" className="text-gray-600">预估收益</Text>
                        <Text size="3" className="text-green-400 font-bold">{formatSUI(creative.estimatedRevenue)}</Text>
                      </div>
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>
        )}

        {/* 盈利报表页面 */}
        {activeTab === 'profit' && (
          <Box className="space-y-6">
            <Box className="glass rounded-2xl p-6">
              <Heading as="h3" size="5" className="text-black mb-6">盈利分析报表</Heading>
              
              <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Box className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-600">
                    <Text className="text-gray-600">创意总数</Text>
                    <Text className="text-black font-medium">{profitReport.totalCreatives} 个</Text>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-600">
                    <Text className="text-gray-600">总观众期待值</Text>
                    <Text className="text-yellow-400 font-medium">{profitReport.totalExpectation} 🌟</Text>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-600">
                    <Text className="text-gray-600">平台市场份额</Text>
                    <Text className="text-green-400 font-medium">{profitReport.marketShare.toFixed(2)}%</Text>
                  </div>
                </Box>
                
                <Box className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-600">
                    <Text className="text-gray-600">预估月收益</Text>
                    <Text className="text-blue-400 font-medium">{formatSUI(profitReport.estimatedMonthlyRevenue)}</Text>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-600">
                    <Text className="text-gray-600">预估年收益</Text>
                    <Text className="text-purple-400 font-medium">{formatSUI(profitReport.estimatedYearlyRevenue)}</Text>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-600">
                    <Text className="text-gray-600">平均每期待值收益</Text>
                    <Text className="text-orange-400 font-medium">
                      {profitReport.totalExpectation > 0 
                        ? formatSUI(profitReport.estimatedMonthlyRevenue / profitReport.totalExpectation)
                        : '0.0000 SUI'
                      }
                    </Text>
                  </div>
                </Box>
              </Box>

              <Box className="bg-gray-800/50 rounded-lg p-4">
                <Text size="2" className="text-gray-400 mb-2">💡 盈利分配机制</Text>
                <Text size="1" className="text-gray-500 leading-relaxed">
                  根据项目设计，用户返利 = 创意盈利 × 观众期待值 ÷ 创意总期待值。
                  您的期待值越高，在创意盈利时获得的分成就越多。
                  平台盈利分配：10%平台运营 + 20%投资人分红 + 70%创意者和用户分成。
                </Text>
              </Box>
            </Box>
          </Box>
        )}

        {/* 未来预期页面 */}
        {activeTab === 'projection' && (
          <Box className="space-y-6">
            <Box className="glass rounded-2xl p-6">
              <Heading as="h3" size="5" className="text-black mb-6">未来12个月盈利预期</Heading>
              
              <Box className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left py-3 text-gray-700">月份</th>
                      <th className="text-right py-3 text-gray-700">预期收益</th>
                      <th className="text-right py-3 text-gray-700">期待值增长</th>
                      <th className="text-right py-3 text-gray-700">累计收益</th>
                    </tr>
                  </thead>
                  <tbody>
                    {futureProfitProjection.map((projection, index) => {
                      const cumulativeRevenue = futureProfitProjection
                        .slice(0, index + 1)
                        .reduce((sum, p) => sum + p.revenue, 0);
                      
                      return (
                        <tr key={projection.month} className="border-b border-gray-700">
                          <td className="py-3 text-gray-700">第 {projection.month} 月</td>
                          <td className="py-3 text-right text-green-400 font-medium">
                            {formatSUI(projection.revenue)}
                          </td>
                          <td className="py-3 text-right text-yellow-400">
                            {Math.round(projection.expectation)} 🌟
                          </td>
                          <td className="py-3 text-right text-blue-400 font-medium">
                            {formatSUI(cumulativeRevenue)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Box>

              <Box className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Box className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <Text size="2" className="text-green-400 mb-1">12个月总收益</Text>
                  <Text size="4" className="text-green-300 font-bold">
                    {formatSUI(futureProfitProjection.reduce((sum, p) => sum + p.revenue, 0))}
                  </Text>
                </Box>
                <Box className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <Text size="2" className="text-yellow-400 mb-1">预期期待值</Text>
                  <Text size="4" className="text-yellow-300 font-bold">
                    {Math.round(futureProfitProjection[11]?.expectation || 0)} 🌟
                  </Text>
                </Box>
                <Box className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <Text size="2" className="text-purple-400 mb-1">月均增长率</Text>
                  <Text size="4" className="text-purple-300 font-bold">15%</Text>
                </Box>
              </Box>

              <Box className="mt-6 mb-6">
                <ProfitChart data={futureProfitProjection} />
              </Box>

              <Box className="bg-gray-800/50 rounded-lg p-4">
                <Text size="2" className="text-gray-400 mb-2">📈 预期说明</Text>
                <Text size="1" className="text-gray-500 leading-relaxed">
                  预期基于当前期待值和15%的月增长率计算。实际收益受市场环境、平台发展、
                  创意质量等多种因素影响。此预期仅供参考，不构成投资建议。
                </Text>
              </Box>
            </Box>
          </Box>
        )}

        {/* 修改项目成熟度对话框 */}
        <Dialog.Root open={selectedCreative !== null} onOpenChange={(open) => !open && closeCategoryDialog()}>
          <Dialog.Content className="max-w-md mx-auto" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
            <Dialog.Title className="text-white mb-4">修改项目成熟度</Dialog.Title>
            
            {selectedCreative && (
              <Box className="space-y-4">
                <Box>
                  <Text size="2" className="text-gray-400 mb-2">创意标题</Text>
                  <Text size="3" className="text-white font-medium">{selectedCreative.title}</Text>
                </Box>
                
                <Box>
                  <Text size="2" className="text-gray-400 mb-2">当前成熟度</Text>
                  <Text size="3" className="text-white">
                    {CATEGORY_DISPLAY[selectedCreative.category as keyof typeof CATEGORY_DISPLAY]?.name || selectedCreative.category}
                  </Text>
                </Box>
                
                <Box>
                  <Text size="2" className="text-gray-400 mb-2">选择新的成熟度</Text>
                  <Select.Root value={newCategory} onValueChange={setNewCategory}>
                    <Select.Trigger 
                      className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white"
                      style={{ position: 'relative', zIndex: 3001 }}
                    />
                    <Select.Content style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
                      {Object.entries(CATEGORY_DISPLAY).map(([key, config]) => (
                        <Select.Item key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <span>{config.icon}</span>
                            <span>{config.name}</span>
                            <span className="text-gray-400 text-sm">- {config.description}</span>
                          </div>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Box>
                
                <Flex gap="3" justify="end" className="pt-4">
                  <Button
                    variant="soft"
                    onClick={closeCategoryDialog}
                    disabled={updatingCategory}
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    取消
                  </Button>
                  <Button
                    onClick={handleUpdateCategory}
                    disabled={updatingCategory || newCategory === selectedCreative.category}
                    className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                  >
                    {updatingCategory ? '更新中...' : '确认修改'}
                  </Button>
                </Flex>
              </Box>
            )}
          </Dialog.Content>
        </Dialog.Root>
      </Container>
    </Box>
  );
};

export default MyAssetsPage;
