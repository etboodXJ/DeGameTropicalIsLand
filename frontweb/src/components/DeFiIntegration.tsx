import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Text, Heading } from '@radix-ui/themes';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { usePoints } from '../hooks/usePoints';
import { BucketService } from '../services/bucketService';
import { useSuiClient } from '@mysten/dapp-kit';

interface DeFiIntegrationProps {
  platform: 'bucket' | 'cetus' | 'navi';
  onBack: () => void;
}

const DeFiIntegration: React.FC<DeFiIntegrationProps> = ({ platform, onBack }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bucketService, setBucketService] = useState<BucketService | null>(null);
  const [userBalance, setUserBalance] = useState<any>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { addPoints } = usePoints();
  const suiClient = useSuiClient();

  // 初始化 BucketService
  useEffect(() => {
    if (platform === 'bucket' && suiClient) {
      const service = new BucketService();
      service.initialize(suiClient);
      setBucketService(service);
      
      // 获取用户余额
      if (currentAccount?.address) {
        fetchUserBalance(service, currentAccount.address);
      }
    }
  }, [platform, currentAccount, suiClient]);

  // 获取用户余额
  const fetchUserBalance = async (service: BucketService, userAddress: string) => {
    setBalanceLoading(true);
    try {
      const balance = await service.getUserBalance(userAddress);
      setUserBalance(balance);
    } catch (error) {
      console.error('获取余额失败:', error);
    } finally {
      setBalanceLoading(false);
    }
  };

  const platformConfig = {
    bucket: {
      name: 'Bucket Protocol',
      icon: 'BUCKET',
      color: 'blue',
      packageId: '0x1234...', // 实际的Bucket Protocol包ID
      description: '通过Bucket Protocol进行借贷操作'
    },
    cetus: {
      name: 'Cetus Protocol', 
      icon: 'CETUS',
      color: 'purple',
      packageId: '0x5678...', // 实际的Cetus Protocol包ID
      description: '通过Cetus Protocol提供流动性'
    },
    navi: {
      name: 'Navi Protocol',
      icon: 'NAVI', 
      color: 'green',
      packageId: '0x9abc...', // 实际的Navi Protocol包ID
      description: '通过Navi Protocol进行DeFi操作'
    }
  };

  const config = platformConfig[platform];

  const handleDeposit = async () => {
    if (!currentAccount || !amount || parseFloat(amount) <= 0) return;

    setIsLoading(true);
    try {
      // 使用 BucketService 进行真实存款
      if (platform === 'bucket' && bucketService) {
        // 构建存款交易
        const tx = await bucketService.buildDepositTransaction({
          asset: 'SUI',
          amount: parseFloat(amount),
          depositor: currentAccount.address
        });

        // 执行交易
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log('Bucket存款交易成功:', result);
              
              // 计算积分：每存入1 SUI获得100 CYKJ积分
              const earnedPoints = Math.floor(parseFloat(amount) * 100);
              
              // 添加积分记录
              addPoints(platform, parseFloat(amount), result.digest);
              
              // 刷新余额
              fetchUserBalance(bucketService, currentAccount.address);
              
              setAmount('');
              alert(`成功存入 ${amount} SUI，获得 ${earnedPoints} CYKJ积分！`);
            },
            onError: (error) => {
              console.error('Bucket存款交易失败:', error);
              const errorMessage = bucketService.handleTransactionError(error);
              alert(`存款失败: ${errorMessage}`);
            }
          }
        );
      } else {
        // 其他平台的模拟逻辑
        const tx = new Transaction();
        
        switch (platform) {
          case 'cetus':
            tx.moveCall({
              target: `${config.packageId}::pool::add_liquidity`,
              arguments: [
                tx.pure.u64(parseFloat(amount) * 1000000000)
              ]
            });
            break;
            
          case 'navi':
            tx.moveCall({
              target: `${config.packageId}::lending::supply`,
              arguments: [
                tx.pure.u64(parseFloat(amount) * 1000000000)
              ]
            });
            break;
        }

        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log('交易成功:', result);
              
              // 计算积分：每存入1 SUI获得100 CYKJ积分
              const earnedPoints = Math.floor(parseFloat(amount) * 100);
              
              addPoints(platform, parseFloat(amount), result.digest);
              setAmount('');
              alert(`成功存入 ${amount} SUI，获得 ${earnedPoints} CYKJ积分！`);
            },
            onError: (error) => {
              console.error('交易失败:', error);
              alert('交易失败，请重试');
            }
          }
        );
      }
    } catch (error) {
      console.error('存款失败:', error);
      alert(`存款失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 模拟存款（用于演示）
  const handleMockDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setIsLoading(true);
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 计算积分：每存入1 SUI获得100 CYKJ积分
      const earnedPoints = Math.floor(parseFloat(amount) * 100);
      
      // 添加积分记录
      addPoints(platform, parseFloat(amount));
      
      //如果是Bucket平台，也刷新余额
      if (platform === 'bucket' && bucketService) {
        fetchUserBalance(bucketService, currentAccount?.address || '');
      }
      
      setAmount('');
      alert(`模拟存入 ${amount} SUI 成功，获得 ${earnedPoints} CYKJ积分！`);
    } catch (error) {
      console.error('模拟存款失败:', error);
      alert('操作失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box style={{ position: 'relative', zIndex: 9997 }}>
      <Flex align="center" gap="4" className="mb-8">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="text-gray-600 relative"
          style={{ position: 'relative', zIndex: 3000, pointerEvents: 'auto' }}
        >
          ← 返回
        </Button>
        <Heading as="h1" size="5" className="text-gray-800">
          {config.icon} {config.name}
        </Heading>
      </Flex>

      <Box className="glass rounded-xl p-8 max-w-md mx-auto" style={{ position: 'relative', zIndex: 9998 }}>
        <Box className="text-center mb-6">
          <Text size="8" className="mb-4 block font-bold text-gray-800">{config.icon}</Text>
          <Heading as="h2" size="4" className="text-gray-800 mb-2">
            {config.name}
          </Heading>
          <Text size="2" className="text-gray-600">
            {config.description}
          </Text>
        </Box>

        {/* 显示用户余额 (仅Bucket平台) */}
        {platform === 'bucket' && userBalance && (
          <Box className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <Text size="2" className="text-blue-600 block mb-2 font-medium">
              💰 您的余额
            </Text>
            <Flex direction="column" gap="1">
              <Text size="2" className="text-blue-700">
                SUI: {(userBalance.sui / 1e9).toFixed(4)}
              </Text>
              <Text size="2" className="text-blue-700">
                USDC: {(userBalance.usdc / 1e6).toFixed(2)}
              </Text>
              <Text size="2" className="text-blue-700">
                USDT: {(userBalance.usdt / 1e6).toFixed(2)}
              </Text>
              <Text size="2" className="text-blue-700">
                wETH: {(userBalance.weth / 1e18).toFixed(4)}
              </Text>
              <Text size="2" className="text-blue-800 font-medium mt-1">
                总价值: ${userBalance.totalUsd.toFixed(2)}
              </Text>
            </Flex>
          </Box>
        )}

        {platform === 'bucket' && balanceLoading && (
          <Box className="mb-6 p-4 bg-gray-500/10 border border-gray-500/30 rounded-lg">
            <Text size="2" className="text-gray-600">
              正在加载余额...
            </Text>
          </Box>
        )}

        <Box className="mb-6">
          <Text className="text-gray-800 mb-2 block">存款金额 (SUI)</Text>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="输入存款金额"
            step="0.1"
            min="0"
            className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 relative"
            style={{ position: 'relative', zIndex: 9999, pointerEvents: 'auto' }}
          />
        </Box>

        <Box className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <Text size="2" className="text-yellow-600 block mb-2">
            💡 积分奖励规则
          </Text>
          <Text size="2" className="text-yellow-700">
            • 每存入 1 SUI = 100 CYKJ 积分
          </Text>
          <Text size="2" className="text-yellow-700">
            • 积分可用于投票创意项目
          </Text>
          {amount && (
            <Text size="2" className="text-yellow-800 mt-2 font-medium">
              预计获得: {Math.floor(parseFloat(amount || '0') * 100)} CYKJ
            </Text>
          )}
        </Box>

        <Flex direction="column" gap="3">
          <Button
            onClick={handleMockDeposit}
            disabled={!amount || parseFloat(amount) <= 0 || isLoading}
            className={`w-full bg-gradient-to-r from-${config.color}-500 to-${config.color}-600 text-white rounded-lg py-3 disabled:opacity-50 relative`}
            style={{ position: 'relative', zIndex: 9999, pointerEvents: 'auto' }}
          >
            {isLoading ? '处理中...' : '模拟存款 (演示)'}
          </Button>
          
          <Button
            onClick={handleDeposit}
            disabled={!currentAccount || !amount || parseFloat(amount) <= 0 || isLoading}
            variant="outline"
            className="w-full border-gray-400 text-gray-700 hover:bg-gray-100 relative"
            style={{ position: 'relative', zIndex: 9999, pointerEvents: 'auto' }}
          >
            {platform === 'bucket' ? 'Bucket 存款' : '真实存款 (需要SDK)'}
          </Button>
        </Flex>

        <Box className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <Text size="1" className="text-blue-700">
            {platform === 'bucket' 
              ? 'ℹ️ Bucket Protocol 已集成SDK，支持真实存款交易'
              : 'ℹ️ 真实存款功能需要集成对应平台的SDK，目前提供模拟演示'
            }
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default DeFiIntegration;
