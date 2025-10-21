import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

// Bucket 配置
const BUCKET_CONFIG = {
  packageId: '0x1234567890abcdef1234567890abcdef12345678', // 实际的 Bucket 包ID
  network: 'testnet' as const, // 使用测试网
};

// 用户余额接口
export interface UserBalance {
  sui: number;
  usdc: number;
  usdt: number;
  weth: number;
  totalUsd: number;
}

// 存款参数接口
export interface DepositParams {
  asset: 'SUI' | 'USDC' | 'USDT' | 'wETH';
  amount: number;
  depositor: string;
}

// 取款参数接口
export interface WithdrawParams {
  asset: 'SUI' | 'USDC' | 'USDT' | 'wETH';
  amount: number;
  withdrawer: string;
}

// 模拟 Bucket 客户端类
class MockBucketClient {
  private suiClient: SuiClient;
  private config: typeof BUCKET_CONFIG;

  constructor(config: { suiClient: SuiClient; network: string; packageId: string }) {
    this.suiClient = config.suiClient;
    this.config = config as typeof BUCKET_CONFIG;
  }

  // 模拟获取用户余额
  async getUserBalance(userAddress: string): Promise<UserBalance> {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 返回模拟余额数据
    return {
      sui: Math.floor(Math.random() * 1000) * 1e9,
      usdc: Math.floor(Math.random() * 500) * 1e6,
      usdt: Math.floor(Math.random() * 300) * 1e6,
      weth: Math.floor(Math.random() * 2) * 1e18,
      totalUsd: Math.floor(Math.random() * 5000),
    };
  }

  // 模拟存款操作
  async deposit(params: {
    tx: Transaction;
    asset: string;
    amount: number;
    depositor: string;
  }): Promise<void> {
    // 模拟构建存款交易
    console.log(`模拟存款: ${params.amount / 1e9} ${params.asset} 从 ${params.depositor}`);
    
    // 在实际实现中，这里会调用真实的 Bucket SDK
    // tx.moveCall({
    //   target: `${this.config.packageId}::bucket::deposit`,
    //   arguments: [tx.pure.u64(params.amount), tx.pure.address(params.depositor)]
    // });
  }

  // 模拟取款操作
  async withdraw(params: {
    tx: Transaction;
    asset: string;
    amount: number;
    withdrawer: string;
  }): Promise<void> {
    // 模拟构建取款交易
    console.log(`模拟取款: ${params.amount / 1e9} ${params.asset} 给 ${params.withdrawer}`);
    
    // 在实际实现中，这里会调用真实的 Bucket SDK
    // tx.moveCall({
    //   target: `${this.config.packageId}::bucket::withdraw`,
    //   arguments: [tx.pure.u64(params.amount), tx.pure.address(params.withdrawer)]
    // });
  }
}

// Bucket 服务类
export class BucketService {
  private bucketClient: MockBucketClient | null = null;
  private suiClient: SuiClient | null = null;

  // 初始化服务
  initialize(suiClient: SuiClient) {
    this.suiClient = suiClient;
    this.bucketClient = new MockBucketClient({
      suiClient,
      network: BUCKET_CONFIG.network,
      packageId: BUCKET_CONFIG.packageId,
    });
  }

  // 获取用户余额
  async getUserBalance(userAddress: string): Promise<UserBalance | null> {
    if (!this.bucketClient) {
      throw new Error('Bucket服务未初始化');
    }

    try {
      const balance = await this.bucketClient.getUserBalance(userAddress);
      return {
        sui: balance.sui || 0,
        usdc: balance.usdc || 0,
        usdt: balance.usdt || 0,
        weth: balance.weth || 0,
        totalUsd: balance.totalUsd || 0,
      };
    } catch (error) {
      console.error('获取Bucket余额失败:', error);
      // 返回默认余额而不是抛出错误
      return {
        sui: 0,
        usdc: 0,
        usdt: 0,
        weth: 0,
        totalUsd: 0,
      };
    }
  }

  // 构建存款交易
  async buildDepositTransaction(params: DepositParams): Promise<Transaction> {
    if (!this.bucketClient) {
      throw new Error('Bucket服务未初始化');
    }

    const tx = new Transaction();
    
    try {
      await this.bucketClient.deposit({
        tx,
        asset: params.asset,
        amount: params.amount * 1e9, // 转换为最小单位
        depositor: params.depositor,
      });
      
      return tx;
    } catch (error) {
      console.error('构建存款交易失败:', error);
      throw new Error('构建存款交易失败: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  // 构建取款交易
  async buildWithdrawTransaction(params: WithdrawParams): Promise<Transaction> {
    if (!this.bucketClient) {
      throw new Error('Bucket服务未初始化');
    }

    const tx = new Transaction();
    
    try {
      await this.bucketClient.withdraw({
        tx,
        asset: params.asset,
        amount: params.amount * 1e9, // 转换为最小单位
        withdrawer: params.withdrawer,
      });
      
      return tx;
    } catch (error) {
      console.error('构建取款交易失败:', error);
      throw new Error('构建取款交易失败: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  // 计算积分奖励
  calculatePointsReward(amount: number, action: 'deposit' | 'withdraw' | 'borrow'): number {
    switch (action) {
      case 'deposit':
        return Math.floor(amount * 100 * 0.01); // 存款金额的1%
      case 'withdraw':
        return Math.floor(amount * 100 * 0.005); // 取款金额的0.5%
      case 'borrow':
        return Math.floor(amount * 100 * 0.02); // 借贷金额的2%
      default:
        return 0;
    }
  }

  // 验证交易参数
  validateTransactionParams(amount: number, userAddress: string): void {
    if (!amount || amount <= 0) {
      throw new Error('金额必须大于0');
    }
    
    if (!userAddress) {
      throw new Error('用户地址不能为空');
    }
    
    if (amount > 1000) {
      throw new Error('单次交易金额不能超过1000');
    }
  }

  // 处理交易错误
  handleTransactionError(error: any): string {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes('INSUFFICIENT_BALANCE')) {
      return '余额不足，请检查您的账户余额';
    } else if (errorMessage.includes('NETWORK_ERROR')) {
      return '网络连接错误，请稍后重试';
    } else if (errorMessage.includes('USER_REJECTED')) {
      return '您取消了交易';
    } else if (errorMessage.includes('gas')) {
      return 'Gas费用不足，请增加Gas费用';
    } else {
      return '交易失败: ' + errorMessage;
    }
  }

  // 检查服务是否已初始化
  isInitialized(): boolean {
    return this.bucketClient !== null && this.suiClient !== null;
  }
}

// 创建单例实例
export const bucketService = new BucketService();

// 导出配置
export { BUCKET_CONFIG };
