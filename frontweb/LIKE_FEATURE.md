# 创意点赞功能实现文档

## 功能概述

实现了用户使用CYKJ积分对创意进行点赞的功能，点赞后创意获得"观众期待值"，这个期待值将用于后期运营利润的分配。

## 核心功能

### 1. 积分系统 (`usePoints.ts`)
- **获取积分**: 用户通过DeFi操作（存入Bucket、Cetus、Navi等）获得CYKJ积分
- **消费积分**: 用户可以使用积分进行点赞操作
- **积分记录**: 记录所有积分获取和消费的历史

### 2. 点赞系统 (`useCreativeLikes.ts`)
- **点赞创意**: 用户使用积分对创意进行点赞
- **观众期待值**: 积分转换为创意的观众期待值
- **防重复点赞**: 每个用户对同一创意只能点赞一次
- **数据持久化**: 使用localStorage保存点赞数据

### 3. 创意详情页面增强
- **期待值显示**: 显示创意的总期待值和点赞人数
- **点赞界面**: 用户可以选择点赞积分数量
- **状态管理**: 显示用户是否已点赞及贡献的积分

## 文件结构

```
src/
├── hooks/
│   ├── usePoints.ts              # 积分管理hook
│   └── useCreativeLikes.ts       # 点赞功能hook
├── pages/
│   ├── CreativeDetailPage.tsx    # 创意详情页（含点赞功能）
│   └── LikeTestPage.tsx         # 点赞功能测试页
└── components/
    ├── PointsBalance.tsx        # 积分余额显示
    └── CreativeCard.tsx         # 创意卡片（显示期待值）
```

## 数据结构

### 积分记录 (PointsRecord)
```typescript
interface PointsRecord {
  id: string;
  platform: 'bucket' | 'cetus' | 'navi' | 'spend';
  amount: number;
  points: number;
  timestamp: number;
  txHash?: string;
}
```

### 点赞记录 (LikeRecord)
```typescript
interface LikeRecord {
  creativeId: string;
  userId: string;
  points: number;
  timestamp: number;
}
```

### 创意期待值 (CreativeExpectation)
```typescript
interface CreativeExpectation {
  creativeId: string;
  totalExpectation: number;
  likeCount: number;
  lastUpdated: number;
}
```

## 使用流程

### 1. 获取积分
```typescript
const { addPoints } = usePoints();
// 用户通过DeFi操作获得积分
addPoints('bucket', 1, 'transaction-hash'); // 存入1 SUI获得100 CYKJ
```

### 2. 点赞创意
```typescript
const { likeCreative } = useCreativeLikes();
const { spendPoints } = usePoints();

// 消费积分并点赞
const success = spendPoints(10, '点赞创意: 创意标题');
if (success) {
  likeCreative('creative-id', 10);
}
```

### 3. 查看期待值
```typescript
const { getCreativeExpectation } = useCreativeLikes();
const expectation = getCreativeExpectation('creative-id');
// expectation.totalExpectation - 总期待值
// expectation.likeCount - 点赞人数
```

## 测试功能

访问 `/like-test` 页面可以测试完整的点赞功能：

1. **连接钱包**: 使用Sui钱包连接
2. **获取测试积分**: 点击"添加测试积分"按钮
3. **点赞测试**: 对测试创意进行点赞
4. **查看效果**: 观察期待值和积分变化

## 盈利分配机制

根据项目文档，后期盈利分配公式：
- **用户返利** = 创意盈利 × 观众期待值 ÷ 创意总期待值
- **创意盈利** = 平台盈利 × 创意总期待值 ÷ 平台总创意期待值
- **盈利分配**: 10%平台 + 20%投资人 + 70%平台盈利金库

## 技术特点

1. **去中心化**: 积分和点赞数据存储在本地，未来可迁移到区块链
2. **防作弊**: 每用户每创意只能点赞一次
3. **实时更新**: 点赞后立即更新UI显示
4. **数据持久化**: 使用localStorage保证数据不丢失
5. **扩展性**: 易于添加新的积分获取方式和消费场景

## 未来扩展

1. **链上存储**: 将点赞数据存储到Sui区块链
2. **智能合约**: 实现自动化的盈利分配
3. **社交功能**: 添加评论、分享等功能
4. **推荐算法**: 基于期待值的创意推荐
5. **创作者激励**: 为高期待值创意的创作者提供额外奖励