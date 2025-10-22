import { useState, useEffect } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { useNetworkAwareConfig } from './useNetworkAwareConfig';
import { useCreativeLikes } from './useCreativeLikes';

interface MyCreative {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: number;
  expectationValue: number;
  likeCount: number;
  estimatedRevenue: number;
}

interface ProfitReport {
  totalExpectation: number;
  totalCreatives: number;
  estimatedMonthlyRevenue: number;
  estimatedYearlyRevenue: number;
  marketShare: number;
}

export const useMyAssets = () => {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const { packageId, isContractDeployed } = useNetworkAwareConfig();
  const { creativeExpectations } = useCreativeLikes();
  
  const [myCreatives, setMyCreatives] = useState<MyCreative[]>([]);
  const [profitReport, setProfitReport] = useState<ProfitReport>({
    totalExpectation: 0,
    totalCreatives: 0,
    estimatedMonthlyRevenue: 0,
    estimatedYearlyRevenue: 0,
    marketShare: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentAccount?.address) {
      loadMyAssets();
    }
  }, [currentAccount?.address]);

  // 每60秒自动刷新一次
  useEffect(() => {
    if (currentAccount?.address) {
      const interval = setInterval(() => {
        loadMyAssets();
      }, 60000); // 60秒
      return () => clearInterval(interval);
    }
  }, [currentAccount?.address]);

  const loadMyAssets = async () => {
    if (!currentAccount?.address) return;
    
    setLoading(true);
    try {
      const creatives: MyCreative[] = [];
      
      // 获取链上创意（如果合约已部署）
      if (isContractDeployed && packageId) {
        try {
          const events = await suiClient.queryEvents({
            query: {
              MoveEventType: `${packageId}::creative::CreativeSubmitted`
            },
            limit: 100,
            order: 'descending'
          });

          events.data.forEach(event => {
            if (event.parsedJson) {
              const data = event.parsedJson as any;
              if (data.creator === currentAccount.address) {
                const expectation = creativeExpectations.find(exp => exp.creativeId === data.creative_id);
                creatives.push({
                  id: data.creative_id,
                  title: data.title,
                  description: data.description,
                  category: data.category,
                  createdAt: parseInt(data.created_at),
                  expectationValue: expectation?.totalExpectation || 0,
                  likeCount: expectation?.likeCount || 0,
                  estimatedRevenue: calculateEstimatedRevenue(expectation?.totalExpectation || 0)
                });
              }
            }
          });
        } catch (err) {
          console.error('获取链上创意失败:', err);
        }
      }

      // 添加测试创意（如果是当前用户创建的）
      const testCreatives = [
        {
          id: 'test-creative-1',
          title: '测试创意：AI生成的游戏角色',
          description: '这是一个使用AI技术生成的游戏角色设计，包含完整的动画序列和技能效果。',
          category: 'game_assets',
          createdAt: Date.now() - 86400000 * 7 // 7天前
        },
        {
          id: 'test-creative-2',
          title: '测试创意：区块链游戏概念',
          description: '一个基于区块链的策略游戏概念，玩家可以真正拥有游戏内资产。',
          category: 'game_concept',
          createdAt: Date.now() - 86400000 * 3 // 3天前
        }
      ];

      testCreatives.forEach(testCreative => {
        const expectation = creativeExpectations.find(exp => exp.creativeId === testCreative.id);
        creatives.push({
          ...testCreative,
          expectationValue: expectation?.totalExpectation || 0,
          likeCount: expectation?.likeCount || 0,
          estimatedRevenue: calculateEstimatedRevenue(expectation?.totalExpectation || 0)
        });
      });

      setMyCreatives(creatives);
      calculateProfitReport(creatives);
    } catch (err) {
      console.error('加载我的资产失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateEstimatedRevenue = (expectationValue: number): number => {
    // 基于期待值计算预估收益
    // 假设每个期待值单位对应0.01 SUI的潜在收益
    return expectationValue * 0.01;
  };

  const calculateProfitReport = (creatives: MyCreative[]) => {
    const totalExpectation = creatives.reduce((sum, creative) => sum + creative.expectationValue, 0);
    const totalCreatives = creatives.length;
    
    // 计算市场份额（基于全平台期待值）
    const totalPlatformExpectation = creativeExpectations.reduce((sum, exp) => sum + exp.totalExpectation, 0);
    const marketShare = totalPlatformExpectation > 0 ? (totalExpectation / totalPlatformExpectation) * 100 : 0;
    
    // 预估收益计算
    const baseMonthlyRevenue = totalExpectation * 0.005; // 每月每期待值0.005 SUI
    const estimatedMonthlyRevenue = baseMonthlyRevenue * (1 + marketShare / 100);
    const estimatedYearlyRevenue = estimatedMonthlyRevenue * 12;

    setProfitReport({
      totalExpectation,
      totalCreatives,
      estimatedMonthlyRevenue,
      estimatedYearlyRevenue,
      marketShare
    });
  };

  const getFutureProfitProjection = () => {
    const currentMonthly = profitReport.estimatedMonthlyRevenue;
    const growthRate = 0.15; // 假设15%月增长率
    
    return Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      revenue: currentMonthly * Math.pow(1 + growthRate, i),
      expectation: profitReport.totalExpectation * Math.pow(1.1, i) // 期待值10%月增长
    }));
  };

  return {
    myCreatives,
    profitReport,
    futureProfitProjection: getFutureProfitProjection(),
    loading,
    refreshAssets: loadMyAssets
  };
};