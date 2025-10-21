import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Text, Heading } from '@radix-ui/themes';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { usePoints } from '../hooks/usePoints';
import { BucketService } from '../services/bucketService';
import { CetusService } from '../services/cetusService';
import { NaviService } from '../services/naviService';
import { useSuiClient } from '@mysten/dapp-kit';

interface DeFiIntegrationProps {
  platform: 'bucket' | 'cetus' | 'navi';
  onBack: () => void;
}

const DeFiIntegration: React.FC<DeFiIntegrationProps> = ({ platform, onBack }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bucketService, setBucketService] = useState<BucketService | null>(null);
  const [cetusService, setCetusService] = useState<CetusService | null>(null);
  const [naviService, setNaviService] = useState<NaviService | null>(null);
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

  // 初始化 CetusService
  useEffect(() => {
    if (platform === 'cetus' && suiClient) {
      const service = new CetusService();
      service.initialize(suiClient);
      setCetusService(service);
      
      // 获取用户流动性位置
      if (currentAccount?.address) {
        fetchUserLiquidityPositions(service, currentAccount.address);
      }
    }
  }, [platform, currentAccount, suiClient]);

  // 初始化 NaviService
  useEffect(() => {
    if (platform === 'navi' && suiClient) {
      const service = new NaviService();
      service.initialize(suiClient);
      setNaviService(service);
      
      // 获取用户持仓信息
      if (currentAccount?.address) {
        fetchUserPositions(service, currentAccount.address);
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

  // 获取用户流动性位置
  const fetchUserLiquidityPositions = async (service: CetusService, userAddress: string) => {
    setBalanceLoading(true);
    try {
      const positions = await service.getUserPositions(userAddress);
      setUserBalance({
        positions: positions,
        totalValue: positions.reduce((sum, pos) => sum + (typeof pos.liquidity === 'number' ? pos.liquidity : 0), 0)
      });
    } catch (error) {
      console.error('获取流动性位置失败:', error);
    } finally {
      setBalanceLoading(false);
    }
  };

  // 获取用户持仓信息 (Navi)
  const fetchUserPositions = async (service: NaviService, userAddress: string) => {
    setBalanceLoading(true);
    try {
      const positions = await service.getUserPositions(userAddress);
      const accountOverview = await service.getAccountOverview(userAddress);
      setUserBalance({
        positions: positions,
        accountOverview: accountOverview,
        totalSupply: accountOverview?.totalSupply || '0',
        totalBorrow: accountOverview?.totalBorrow || '0',
        healthFactor: accountOverview?.healthFactor || 0,
        borrowingPower: accountOverview?.borrowingPower || '0'
      });
    } catch (error) {
      console.error('获取持仓信息失败:', error);
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
      } else if (platform === 'cetus' && cetusService) {
        // 使用 CetusService 进行真实添加流动性
        const tx = await cetusService.buildAddLiquidityTransaction({
          tokenA: 'SUI',
          tokenB: 'USDC',
          amountA: parseFloat(amount),
          amountB: parseFloat(amount) * 0.5, // 假设汇率
          lowerTick: -1000,
          upperTick: 1000,
          user: currentAccount.address
        });

        // 执行交易
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log('Cetus添加流动性交易成功:', result);
              
              // 计算积分：添加流动性获得更多积分奖励 (1.5倍)
              const earnedPoints = Math.floor(parseFloat(amount) * 150);
              
              // 添加积分记录
              addPoints(platform, parseFloat(amount), result.digest);
              
              // 刷新流动性位置
              fetchUserLiquidityPositions(cetusService, currentAccount.address);
              
              setAmount('');
              alert(`成功添加流动性 ${amount} SUI，获得 ${earnedPoints} CYKJ积分！`);
            },
            onError: (error) => {
              console.error('Cetus添加流动性交易失败:', error);
              const errorMessage = cetusService.handleTransactionError(error);
              alert(`添加流动性失败: ${errorMessage}`);
            }
          }
        );
      } else if (platform === 'navi' && naviService) {
        // 使用 NaviService 进行真实存款
        const tx = await naviService.buildDepositTransaction({
          token: 'SUI',
          amount: parseFloat(amount),
          user: currentAccount.address,
          enableCollateral: true
        });

        // 执行交易
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log('Navi存款交易成功:', result);
              
              // 计算积分：Navi 存款获得更多积分奖励 (1.2倍)
              const earnedPoints = Math.floor(parseFloat(amount) * 120);
              
              // 添加积分记录
              addPoints(platform, parseFloat(amount), result.digest);
              
              // 刷新持仓信息
              fetchUserPositions(naviService, currentAccount.address);
              
              setAmount('');
              alert(`成功存入 ${amount} SUI，获得 ${earnedPoints} CYKJ积分！`);
            },
            onError: (error) => {
              console.error('Navi存款交易失败:', error);
              const errorMessage = naviService.handleTransactionError(error);
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
      
      // 根据平台计算不同的积分奖励
      let earnedPoints: number;
      let actionText: string;
      
      if (platform === 'cetus') {
        // Cetus 添加流动性获得更多积分奖励 (1.5倍)
        earnedPoints = Math.floor(parseFloat(amount) * 150);
        actionText = `添加流动性 ${amount} SUI`;
      } else if (platform === 'navi') {
        // Navi 存款获得更多积分奖励 (1.2倍)
        earnedPoints = Math.floor(parseFloat(amount) * 120);
        actionText = `存入 ${amount} SUI`;
      } else {
        // 其他平台每存入1 SUI获得100 CYKJ积分
        earnedPoints = Math.floor(parseFloat(amount) * 100);
        actionText = `存入 ${amount} SUI`;
      }
      
      // 添加积分记录
      addPoints(platform, parseFloat(amount));
      
      // 刷新对应平台的数据
      if (platform === 'bucket' && bucketService) {
        fetchUserBalance(bucketService, currentAccount?.address || '');
      } else if (platform === 'cetus' && cetusService) {
        fetchUserLiquidityPositions(cetusService, currentAccount?.address || '');
      } else if (platform === 'navi' && naviService) {
        fetchUserPositions(naviService, currentAccount?.address || '');
      }
      
      setAmount('');
      alert(`模拟${actionText}成功，获得 ${earnedPoints} CYKJ积分！`);
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

        {/* 显示用户余额 (Bucket平台) */}
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

        {/* 显示用户流动性位置 (Cetus平台) */}
        {platform === 'cetus' && userBalance && userBalance.positions && (
          <Box className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <Text size="2" className="text-purple-600 block mb-2 font-medium">
              💧 您的流动性位置
            </Text>
            <Flex direction="column" gap="1">
              {userBalance.positions.length > 0 ? (
                userBalance.positions.map((pos: any, index: number) => (
                  <Box key={index} className="mb-2 p-2 bg-purple-500/5 rounded">
                    <Text size="2" className="text-purple-700">
                      池子: {pos.tokenA}/{pos.tokenB}
                    </Text>
                    <Text size="2" className="text-purple-700">
                      流动性: {typeof pos.liquidity === 'number' ? pos.liquidity.toFixed(4) : '0.0000'}
                    </Text>
                    <Text size="2" className="text-purple-700">
                      价格范围: {pos.lowerTick} - {pos.upperTick}
                    </Text>
                  </Box>
                ))
              ) : (
                <Text size="2" className="text-purple-600">
                  暂无流动性位置
                </Text>
              )}
              <Text size="2" className="text-purple-800 font-medium mt-2">
                总价值: ${userBalance.totalValue ? userBalance.totalValue.toFixed(2) : '0.00'}
              </Text>
            </Flex>
          </Box>
        )}

        {/* 显示用户持仓信息 (Navi平台) */}
        {platform === 'navi' && userBalance && (
          <Box className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <Text size="2" className="text-green-600 block mb-2 font-medium">
              🏦 您的借贷持仓
            </Text>
            <Flex direction="column" gap="1">
              <Text size="2" className="text-green-700">
                总存款: {parseFloat(userBalance.totalSupply || '0').toFixed(4)} SUI
              </Text>
              <Text size="2" className="text-green-700">
                总借款: {parseFloat(userBalance.totalBorrow || '0').toFixed(4)} SUI
              </Text>
              <Text size="2" className="text-green-700">
                净持仓: {(parseFloat(userBalance.totalSupply || '0') - parseFloat(userBalance.totalBorrow || '0')).toFixed(4)} SUI
              </Text>
              <Text size="2" className={`text-green-700 font-medium`}>
                健康因子: {parseFloat(userBalance.healthFactor?.toString() || '0').toFixed(2)}
              </Text>
              <Text size="2" className="text-green-700">
                借款能力: {parseFloat(userBalance.borrowingPower || '0').toFixed(4)} SUI
              </Text>
            </Flex>
          </Box>
        )}

        {balanceLoading && (
          <Box className="mb-6 p-4 bg-gray-500/10 border border-gray-500/30 rounded-lg">
            <Text size="2" className="text-gray-600">
              {platform === 'bucket' ? '正在加载余额...' : 
               platform === 'cetus' ? '正在加载流动性位置...' : 
               '正在加载持仓信息...'}
            </Text>
          </Box>
        )}

        <Box className="mb-6">
          <Text className="text-gray-800 mb-2 block">
            {platform === 'cetus' ? '添加流动性金额 (SUI)' : '存款金额 (SUI)'}
          </Text>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={platform === 'cetus' ? '输入添加流动性的SUI数量' : '输入存款金额'}
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
            {platform === 'cetus' 
              ? '• 每添加 1 SUI 流动性 = 150 CYKJ 积分 (1.5倍奖励)'
              : platform === 'navi'
              ? '• 每存入 1 SUI = 120 CYKJ 积分 (1.2倍奖励)'
              : '• 每存入 1 SUI = 100 CYKJ 积分'
            }
          </Text>
          <Text size="2" className="text-yellow-700">
            • 积分可用于投票创意项目
          </Text>
          {amount && (
            <Text size="2" className="text-yellow-800 mt-2 font-medium">
              预计获得: {platform === 'cetus' 
                ? Math.floor(parseFloat(amount || '0') * 150)
                : platform === 'navi'
                ? Math.floor(parseFloat(amount || '0') * 120)
                : Math.floor(parseFloat(amount || '0') * 100)
              } CYKJ
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
            {isLoading ? '处理中...' : (platform === 'cetus' ? '模拟添加流动性 (演示)' : '模拟存款 (演示)')}
          </Button>
          
          <Button
            onClick={handleDeposit}
            disabled={!currentAccount || !amount || parseFloat(amount) <= 0 || isLoading}
            variant="outline"
            className="w-full border-gray-400 text-gray-700 hover:bg-gray-100 relative"
            style={{ position: 'relative', zIndex: 9999, pointerEvents: 'auto' }}
          >
            {platform === 'bucket' ? 'Bucket 存款' : 
             platform === 'cetus' ? 'Cetus 添加流动性' : 
             platform === 'navi' ? 'Navi 存款' :
             '真实存款 (需要SDK)'}
          </Button>
        </Flex>

        <Box className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <Text size="1" className="text-blue-700">
            {platform === 'bucket' 
              ? 'ℹ️ Bucket Protocol 已集成SDK，支持真实存款交易'
              : platform === 'cetus'
              ? 'ℹ️ Cetus Protocol 已集成SDK，支持真实添加流动性交易'
              : 'ℹ️ 真实存款功能需要集成对应平台的SDK，目前提供模拟演示'
            }
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default DeFiIntegration;
