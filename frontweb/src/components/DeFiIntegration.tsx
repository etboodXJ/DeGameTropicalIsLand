import React, { useState } from 'react';
import { Box, Button, Flex, Text, Heading } from '@radix-ui/themes';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { usePoints } from '../hooks/usePoints';

interface DeFiIntegrationProps {
  platform: 'bucket' | 'cetus' | 'navi';
  onBack: () => void;
}

const DeFiIntegration: React.FC<DeFiIntegrationProps> = ({ platform, onBack }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { addPoints } = usePoints();

  const platformConfig = {
    bucket: {
      name: 'Bucket Protocol',
      icon: '🪣',
      color: 'blue',
      packageId: '0x1234...', // 实际的Bucket Protocol包ID
      description: '通过Bucket Protocol进行借贷操作'
    },
    cetus: {
      name: 'Cetus Protocol', 
      icon: '🐋',
      color: 'purple',
      packageId: '0x5678...', // 实际的Cetus Protocol包ID
      description: '通过Cetus Protocol提供流动性'
    },
    navi: {
      name: 'Navi Protocol',
      icon: '🧭', 
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
      const tx = new Transaction();
      
      // 根据不同平台构建不同的交易
      switch (platform) {
        case 'bucket':
          // Bucket Protocol 存款逻辑
          tx.moveCall({
            target: `${config.packageId}::bucket::deposit`,
            arguments: [
              tx.pure.u64(parseFloat(amount) * 1000000000) // 转换为MIST
            ]
          });
          break;
          
        case 'cetus':
          // Cetus Protocol 流动性提供逻辑
          tx.moveCall({
            target: `${config.packageId}::pool::add_liquidity`,
            arguments: [
              tx.pure.u64(parseFloat(amount) * 1000000000)
            ]
          });
          break;
          
        case 'navi':
          // Navi Protocol 存款逻辑
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
            // 添加积分记录
            addPoints(platform, parseFloat(amount), result.digest);
            setAmount('');
            alert(`成功存入 ${amount} SUI，获得 ${Math.floor(parseFloat(amount) * 100)} CYKJ积分！`);
          },
          onError: (error) => {
            console.error('交易失败:', error);
            alert('交易失败，请重试');
          }
        }
      );
    } catch (error) {
      console.error('构建交易失败:', error);
      alert('构建交易失败，请重试');
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
      
      // 添加积分记录
      addPoints(platform, parseFloat(amount));
      
      setAmount('');
      alert(`模拟存入 ${amount} SUI 成功，获得 ${Math.floor(parseFloat(amount) * 100)} CYKJ积分！`);
    } catch (error) {
      console.error('模拟存款失败:', error);
      alert('操作失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Flex align="center" gap="4" className="mb-8">
        <Button variant="ghost" onClick={onBack} className="text-gray-400">
          ← 返回
        </Button>
        <Heading as="h1" size="5" className="text-white">
          {config.icon} {config.name}
        </Heading>
      </Flex>

      <Box className="glass rounded-xl p-8 max-w-md mx-auto">
        <Box className="text-center mb-6">
          <Text size="6" className="mb-4 block">{config.icon}</Text>
          <Heading as="h2" size="4" className="text-white mb-2">
            {config.name}
          </Heading>
          <Text size="2" className="text-gray-400">
            {config.description}
          </Text>
        </Box>

        <Box className="mb-6">
          <Text className="text-white mb-2 block">存款金额 (SUI)</Text>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="输入存款金额"
            step="0.1"
            min="0"
            className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </Box>

        <Box className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <Text size="2" className="text-yellow-400 block mb-2">
            💡 积分奖励规则
          </Text>
          <Text size="2" className="text-yellow-300">
            • 每存入 1 SUI = 100 CYKJ 积分
          </Text>
          <Text size="2" className="text-yellow-300">
            • 积分可用于投票创意项目
          </Text>
          {amount && (
            <Text size="2" className="text-yellow-200 mt-2 font-medium">
              预计获得: {Math.floor(parseFloat(amount || '0') * 100)} CYKJ
            </Text>
          )}
        </Box>

        <Flex direction="column" gap="3">
          <Button
            onClick={handleMockDeposit}
            disabled={!amount || parseFloat(amount) <= 0 || isLoading}
            className={`w-full bg-gradient-to-r from-${config.color}-500 to-${config.color}-600 text-white rounded-lg py-3 disabled:opacity-50`}
          >
            {isLoading ? '处理中...' : '模拟存款 (演示)'}
          </Button>
          
          <Button
            onClick={handleDeposit}
            disabled={!currentAccount || !amount || parseFloat(amount) <= 0 || isLoading}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            真实存款 (需要SDK)
          </Button>
        </Flex>

        <Box className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <Text size="1" className="text-blue-300">
            ℹ️ 真实存款功能需要集成对应平台的SDK，目前提供模拟演示
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default DeFiIntegration;