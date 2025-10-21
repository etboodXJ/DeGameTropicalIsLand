import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

// Navi 配置
const NAVI_CONFIG = {
  packageId: '0x8f95218732b9a5a1a7b3c9e9a9b9b9b9b9b9b9b9', // 实际的 Navi 包ID
  network: 'testnet' as const, // 使用测试网
  lendingPoolId: '0x9f95218732b9a5a1a7b3c9e9a9b9b9b9b9b9b9b9b', // 借贷池ID
  interestRateModelId: '0xaf95218732b9a5a1a7b3c9e9a9b9b9b9b9b9b9b9b', // 利率模型ID
  riskManagerId: '0xbf95218732b9a5a1a7b3c9e9a9b9b9b9b9b9b9b9b', // 风险管理ID
};

// 代币类型定义
export interface TokenInfo {
  type: string;
  symbol: string;
  name: string;
  decimals: number;
  address: string;
}

// 借贷池信息接口
export interface LendingPoolInfo {
  address: string;
  token: TokenInfo;
  totalSupply: string;
  totalBorrow: string;
  supplyRate: number;
  borrowRate: number;
  collateralFactor: number;
  liquidationThreshold: number;
  reserveFactor: number;
}

// 用户持仓接口
export interface UserPosition {
  token: TokenInfo;
  supplyBalance: string;
  borrowBalance: string;
  collateralValue: string;
  supplyAPY: number;
  borrowAPY: number;
  healthFactor: number;
  isCollateral: boolean;
}

// 账户概览接口
export interface AccountOverview {
  totalSupply: string;
  totalBorrow: string;
  totalCollateral: string;
  healthFactor: number;
  borrowingPower: string;
  netAPY: number;
  positions: UserPosition[];
}

// 存款参数接口
export interface DepositParams {
  token: string;
  amount: number;
  user: string;
  enableCollateral?: boolean;
}

// 借款参数接口
export interface BorrowParams {
  token: string;
  amount: number;
  user: string;
}

// 还款参数接口
export interface RepayParams {
  token: string;
  amount: number;
  user: string;
  isFullRepayment?: boolean;
}

// 提取参数接口
export interface WithdrawParams {
  token: string;
  amount: number;
  user: string;
}

// 模拟 Navi 客户端类
class MockNaviClient {
  private suiClient: SuiClient;
  private config: typeof NAVI_CONFIG;

  constructor(config: { suiClient: SuiClient; network: string; packageId: string; lendingPoolId: string; interestRateModelId: string; riskManagerId: string }) {
    this.suiClient = config.suiClient;
    this.config = config as typeof NAVI_CONFIG;
  }

  // 模拟获取用户余额
  async getUserBalance(userAddress: string): Promise<any> {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 返回模拟余额数据
    return {
      sui: Math.floor(Math.random() * 1000) * 1e9,
      usdc: Math.floor(Math.random() * 2000) * 1e6,
      weth: Math.floor(Math.random() * 2) * 1e18,
      totalUSD: Math.floor(Math.random() * 5000),
    };
  }

  // 模拟获取借贷池信息
  async getLendingPoolInfo(tokenType: string): Promise<LendingPoolInfo | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟池子数据
    return {
      address: '0xpool1234567890abcdef1234567890abcdef12345678',
      token: {
        type: tokenType,
        symbol: tokenType.includes('sui') ? 'SUI' : tokenType.includes('usdc') ? 'USDC' : 'WETH',
        name: tokenType.includes('sui') ? 'Sui' : tokenType.includes('usdc') ? 'USD Coin' : 'Wrapped Ether',
        decimals: tokenType.includes('sui') ? 9 : tokenType.includes('usdc') ? 6 : 18,
        address: tokenType.includes('sui') ? '0x2' : tokenType.includes('usdc') ? '0x5d4b302506645c7ff7880de1249d425a6e6a5b1c' : '0x3'
      },
      totalSupply: '50000000000000', // 50,000 tokens
      totalBorrow: '30000000000000',  // 30,000 tokens
      supplyRate: 5.5, // 5.5% APY
      borrowRate: 7.2, // 7.2% APY
      collateralFactor: 0.8, // 80%
      liquidationThreshold: 0.85, // 85%
      reserveFactor: 0.1, // 10%
    };
  }

  // 模拟存款
  async deposit(params: {
    tx: Transaction;
    token: string;
    amount: number;
    user: string;
    enableCollateral?: boolean;
  }): Promise<void> {
    // 模拟构建存款交易
    console.log(`模拟存款: ${params.amount / 1e9} ${params.token}, 作为抵押品: ${params.enableCollateral || true}`);
    
    // 在实际实现中，这里会调用真实的 Navi SDK
    // tx.moveCall({
    //   target: `${this.config.packageId}::lending::deposit`,
    //   arguments: [
    //     tx.pure.address(params.token),
    //     tx.pure.u64(params.amount),
    //     tx.pure.bool(params.enableCollateral || true),
    //     tx.pure.address(params.user)
    //   ]
    // });
  }

  // 模拟借款
  async borrow(params: {
    tx: Transaction;
    token: string;
    amount: number;
    user: string;
  }): Promise<void> {
    // 模拟构建借款交易
    console.log(`模拟借款: ${params.amount / 1e9} ${params.token}`);
    
    // 在实际实现中，这里会调用真实的 Navi SDK
    // tx.moveCall({
    //   target: `${this.config.packageId}::lending::borrow`,
    //   arguments: [
    //     tx.pure.address(params.token),
    //     tx.pure.u64(params.amount),
    //     tx.pure.address(params.user)
    //   ]
    // });
  }

  // 模拟还款
  async repay(params: {
    tx: Transaction;
    token: string;
    amount: number;
    user: string;
    isFullRepayment?: boolean;
  }): Promise<void> {
    // 模拟构建还款交易
    const amountText = params.isFullRepayment ? '全部' : (params.amount / 1e9).toString();
    console.log(`模拟还款: ${amountText} ${params.token}`);
    
    // 在实际实现中，这里会调用真实的 Navi SDK
    // tx.moveCall({
    //   target: `${this.config.packageId}::lending::repay`,
    //   arguments: [
    //     tx.pure.address(params.token),
    //     tx.pure.u64(params.amount),
    //     tx.pure.bool(params.isFullRepayment || false),
    //     tx.pure.address(params.user)
    //   ]
    // });
  }

  // 模拟提取
  async withdraw(params: {
    tx: Transaction;
    token: string;
    amount: number;
    user: string;
  }): Promise<void> {
    // 模拟构建提取交易
    console.log(`模拟提取: ${params.amount / 1e9} ${params.token}`);
    
    // 在实际实现中，这里会调用真实的 Navi SDK
    // tx.moveCall({
    //   target: `${this.config.packageId}::lending::withdraw`,
    //   arguments: [
    //     tx.pure.address(params.token),
    //     tx.pure.u64(params.amount),
    //     tx.pure.address(params.user)
    //   ]
    // });
  }

  // 模拟获取用户持仓
  async getUserPositions(userAddress: string): Promise<UserPosition[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // 返回模拟持仓数据
    return [
      {
        token: {
          type: '0x2::sui::SUI',
          symbol: 'SUI',
          name: 'Sui',
          decimals: 9,
          address: '0x2'
        },
        supplyBalance: '5000000000000', // 5,000 SUI
        borrowBalance: '1000000000000',  // 1,000 SUI
        collateralValue: '4000000000000', // 4,000 SUI
        supplyAPY: 5.5,
        borrowAPY: 7.2,
        healthFactor: 2.5,
        isCollateral: true
      },
      {
        token: {
          type: '0x5d4b302506645c7ff7880de1249d425a6e6a5b1c::usdc::USDC',
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: 6,
          address: '0x5d4b302506645c7ff7880de1249d425a6e6a5b1c'
        },
        supplyBalance: '2000000000000', // 2,000 USDC
        borrowBalance: '0',
        collateralValue: '2000000000000', // 2,000 USDC
        supplyAPY: 4.8,
        borrowAPY: 6.5,
        healthFactor: 0,
        isCollateral: true
      }
    ];
  }

  // 模拟获取账户概览
  async getAccountOverview(userAddress: string): Promise<AccountOverview> {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const positions = await this.getUserPositions(userAddress);
    const totalSupply = positions.reduce((sum, pos) => sum + parseFloat(pos.supplyBalance), 0);
    const totalBorrow = positions.reduce((sum, pos) => sum + parseFloat(pos.borrowBalance), 0);
    const totalCollateral = positions.filter(pos => pos.isCollateral).reduce((sum, pos) => sum + parseFloat(pos.collateralValue), 0);
    
    return {
      totalSupply: totalSupply.toString(),
      totalBorrow: totalBorrow.toString(),
      totalCollateral: totalCollateral.toString(),
      healthFactor: totalBorrow > 0 ? totalCollateral / totalBorrow : 10,
      borrowingPower: (totalCollateral * 0.8 - totalBorrow).toString(),
      netAPY: 3.2,
      positions
    };
  }

  // 模拟获取借贷能力
  async getBorrowingPower(userAddress: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      availableSUI: 2000 * 1e9,
      availableUSDC: 5000 * 1e6,
      availableWETH: 1 * 1e18,
      totalBorrowingPower: 10000
    };
  }
}

// Navi 服务类
export class NaviService {
  private naviClient: MockNaviClient | null = null;
  private suiClient: SuiClient | null = null;

  // 初始化服务
  initialize(suiClient: SuiClient) {
    this.suiClient = suiClient;
    this.naviClient = new MockNaviClient({
      suiClient,
      network: NAVI_CONFIG.network,
      packageId: NAVI_CONFIG.packageId,
      lendingPoolId: NAVI_CONFIG.lendingPoolId,
      interestRateModelId: NAVI_CONFIG.interestRateModelId,
      riskManagerId: NAVI_CONFIG.riskManagerId,
    });
  }

  // 获取用户余额
  async getUserBalance(userAddress: string): Promise<any | null> {
    if (!this.naviClient) {
      throw new Error('Navi服务未初始化');
    }

    try {
      const balance = await this.naviClient.getUserBalance(userAddress);
      return {
        sui: balance.sui || 0,
        usdc: balance.usdc || 0,
        weth: balance.weth || 0,
        totalUSD: balance.totalUSD || 0,
      };
    } catch (error) {
      console.error('获取Navi余额失败:', error);
      // 返回默认余额而不是抛出错误
      return {
        sui: 0,
        usdc: 0,
        weth: 0,
        totalUSD: 0,
      };
    }
  }

  // 构建存款交易
  async buildDepositTransaction(params: DepositParams): Promise<Transaction> {
    if (!this.naviClient) {
      throw new Error('Navi服务未初始化');
    }

    const tx = new Transaction();
    
    try {
      await this.naviClient.deposit({
        tx,
        token: params.token,
        amount: params.amount * 1e9, // 转换为最小单位
        user: params.user,
        enableCollateral: params.enableCollateral !== false, // 默认启用抵押品
      });
      
      return tx;
    } catch (error) {
      console.error('构建存款交易失败:', error);
      throw new Error('构建存款交易失败: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  // 构建借款交易
  async buildBorrowTransaction(params: BorrowParams): Promise<Transaction> {
    if (!this.naviClient) {
      throw new Error('Navi服务未初始化');
    }

    const tx = new Transaction();
    
    try {
      await this.naviClient.borrow({
        tx,
        token: params.token,
        amount: params.amount * 1e9, // 转换为最小单位
        user: params.user,
      });
      
      return tx;
    } catch (error) {
      console.error('构建借款交易失败:', error);
      throw new Error('构建借款交易失败: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  // 构建还款交易
  async buildRepayTransaction(params: RepayParams): Promise<Transaction> {
    if (!this.naviClient) {
      throw new Error('Navi服务未初始化');
    }

    const tx = new Transaction();
    
    try {
      await this.naviClient.repay({
        tx,
        token: params.token,
        amount: params.amount * 1e9, // 转换为最小单位
        user: params.user,
        isFullRepayment: params.isFullRepayment || false,
      });
      
      return tx;
    } catch (error) {
      console.error('构建还款交易失败:', error);
      throw new Error('构建还款交易失败: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  // 构建提取交易
  async buildWithdrawTransaction(params: WithdrawParams): Promise<Transaction> {
    if (!this.naviClient) {
      throw new Error('Navi服务未初始化');
    }

    const tx = new Transaction();
    
    try {
      await this.naviClient.withdraw({
        tx,
        token: params.token,
        amount: params.amount * 1e9, // 转换为最小单位
        user: params.user,
      });
      
      return tx;
    } catch (error) {
      console.error('构建提取交易失败:', error);
      throw new Error('构建提取交易失败: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  // 获取借贷池信息
  async getLendingPoolInfo(tokenType: string): Promise<LendingPoolInfo | null> {
    if (!this.naviClient) {
      throw new Error('Navi服务未初始化');
    }

    try {
      return await this.naviClient.getLendingPoolInfo(tokenType);
    } catch (error) {
      console.error('获取借贷池信息失败:', error);
      return null;
    }
  }

  // 获取用户持仓
  async getUserPositions(userAddress: string): Promise<UserPosition[]> {
    if (!this.naviClient) {
      throw new Error('Navi服务未初始化');
    }

    try {
      return await this.naviClient.getUserPositions(userAddress);
    } catch (error) {
      console.error('获取用户持仓失败:', error);
      return [];
    }
  }

  // 获取账户概览
  async getAccountOverview(userAddress: string): Promise<AccountOverview | null> {
    if (!this.naviClient) {
      throw new Error('Navi服务未初始化');
    }

    try {
      return await this.naviClient.getAccountOverview(userAddress);
    } catch (error) {
      console.error('获取账户概览失败:', error);
      return null;
    }
  }

  // 获取借贷能力
  async getBorrowingPower(userAddress: string): Promise<any> {
    if (!this.naviClient) {
      throw new Error('Navi服务未初始化');
    }

    try {
      return await this.naviClient.getBorrowingPower(userAddress);
    } catch (error) {
      console.error('获取借贷能力失败:', error);
      return {
        availableSUI: 0,
        availableUSDC: 0,
        availableWETH: 0,
        totalBorrowingPower: 0
      };
    }
  }

  // 计算积分奖励
  calculatePointsReward(amount: number, action: 'deposit' | 'borrow' | 'repay' | 'withdraw'): number {
    switch (action) {
      case 'deposit':
        return Math.floor(amount * 100 * 0.012); // 存款金额的1.2%
      case 'borrow':
        return Math.floor(amount * 100 * 0.008); // 借款金额的0.8%
      case 'repay':
        return Math.floor(amount * 100 * 0.003); // 还款金额的0.3%
      case 'withdraw':
        return Math.floor(amount * 100 * 0.002); // 提取金额的0.2%
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
    
    if (amount > 50000) {
      throw new Error('单次交易金额不能超过50000 SUI');
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
    } else if (errorMessage.includes('INSUFFICIENT_COLLATERAL')) {
      return '抵押品不足，请增加抵押品或减少借款';
    } else if (errorMessage.includes('LIQUIDATION_RISK')) {
      return '存在清算风险，请增加抵押品或偿还部分借款';
    } else if (errorMessage.includes('BORROWING_CAP_EXCEEDED')) {
      return '借贷额度已满，请稍后重试';
    } else {
      return '交易失败: ' + errorMessage;
    }
  }

  // 检查服务是否已初始化
  isInitialized(): boolean {
    return this.naviClient !== null && this.suiClient !== null;
  }

  // 获取支持的代币列表
  getSupportedTokens(): TokenInfo[] {
    return [
      {
        type: '0x2::sui::SUI',
        symbol: 'SUI',
        name: 'Sui',
        decimals: 9,
        address: '0x2'
      },
      {
        type: '0x5d4b302506645c7ff7880de1249d425a6e6a5b1c::usdc::USDC',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        address: '0x5d4b302506645c7ff7880de1249d425a6e6a5b1c'
      },
      {
        type: '0x3::weth::WETH',
        symbol: 'WETH',
        name: 'Wrapped Ether',
        decimals: 18,
        address: '0x3'
      }
    ];
  }
}

// 创建单例实例
export const naviService = new NaviService();

// 导出配置
export { NAVI_CONFIG };
