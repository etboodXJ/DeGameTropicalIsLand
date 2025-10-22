# 我的资产页面功能文档

## 功能概述

"我的资产"页面为创作者提供了全面的资产管理和盈利分析功能，展示用户创意的观众期待值、盈利报表和未来收益预期。

## 核心功能

### 1. 资产总览 (`useMyAssets.ts`)
- **创意统计**: 显示用户创建的创意总数
- **期待值汇总**: 展示所有创意获得的观众期待值总和
- **市场份额**: 计算用户在平台中的市场占有率
- **收益预估**: 基于期待值计算预估收益

### 2. 四大功能模块

#### 📊 总览页面
- 创意总数统计
- 总观众期待值展示
- 平台市场份额计算
- 预估月收益显示

#### 📝 我的创意
- 创意列表展示
- 每个创意的详细数据：
  - 观众期待值
  - 点赞人数
  - 预估收益
- 快速跳转到创意详情页

#### 💰 盈利报表
- 详细的盈利分析数据
- 盈利分配机制说明
- 平均每期待值收益计算
- 年度收益预估

#### 📈 未来预期
- 12个月盈利预期表格
- 可视化收益趋势图
- 期待值增长预测
- 累计收益计算

## 文件结构

```
src/
├── hooks/
│   └── useMyAssets.ts           # 资产管理hook
├── pages/
│   └── MyAssetsPage.tsx         # 我的资产主页面
├── components/
│   └── ProfitChart.tsx          # 盈利趋势图表组件
└── MY_ASSETS_FEATURE.md         # 功能文档
```

## 数据结构

### 我的创意 (MyCreative)
```typescript
interface MyCreative {
  id: string;                    // 创意ID
  title: string;                 // 创意标题
  description: string;           // 创意描述
  category: string;              // 创意分类
  createdAt: number;            // 创建时间
  expectationValue: number;      // 观众期待值
  likeCount: number;            // 点赞人数
  estimatedRevenue: number;      // 预估收益
}
```

### 盈利报表 (ProfitReport)
```typescript
interface ProfitReport {
  totalExpectation: number;      // 总期待值
  totalCreatives: number;        // 创意总数
  estimatedMonthlyRevenue: number; // 预估月收益
  estimatedYearlyRevenue: number;  // 预估年收益
  marketShare: number;           // 市场份额百分比
}
```

## 计算逻辑

### 1. 收益预估算法
```typescript
// 基础收益：每个期待值单位 = 0.01 SUI潜在收益
const estimatedRevenue = expectationValue * 0.01;

// 月收益：每月每期待值 = 0.005 SUI
const baseMonthlyRevenue = totalExpectation * 0.005;

// 市场份额加成
const estimatedMonthlyRevenue = baseMonthlyRevenue * (1 + marketShare / 100);
```

### 2. 市场份额计算
```typescript
const marketShare = (userTotalExpectation / platformTotalExpectation) * 100;
```

### 3. 未来预期模型
```typescript
// 假设15%月增长率
const growthRate = 0.15;
const futureRevenue = currentMonthly * Math.pow(1 + growthRate, monthIndex);
```

## 盈利分配机制

根据项目白皮书设计：

### 分配公式
- **用户返利** = 创意盈利 × 观众期待值 ÷ 创意总期待值
- **创意盈利** = 平台盈利 × 创意总期待值 ÷ 平台总创意期待值

### 收益分配比例
- **10%** - 平台运营费用
- **20%** - 投资人分红
- **70%** - 创意者和用户分成池

## 使用流程

### 1. 访问页面
```
导航栏 → 我的资产 → /my-assets
```

### 2. 查看总览
- 快速了解整体资产状况
- 查看关键指标数据

### 3. 管理创意
- 浏览所有已发布创意
- 查看每个创意的表现数据
- 跳转到创意详情页进行管理

### 4. 分析盈利
- 查看详细的盈利报表
- 了解收益分配机制
- 计算投资回报率

### 5. 预期规划
- 查看未来12个月收益预期
- 通过图表了解增长趋势
- 制定创意发布策略

## 技术特点

### 1. 实时数据同步
- 与点赞系统实时同步
- 自动更新期待值变化
- 动态计算收益预估

### 2. 多维度分析
- 时间维度：创建时间、增长趋势
- 价值维度：期待值、收益预估
- 市场维度：份额占比、竞争分析

### 3. 可视化展示
- 趋势图表直观展示
- 数据卡片清晰呈现
- 响应式设计适配各设备

### 4. 用户体验优化
- 标签页分类管理
- 一键刷新数据
- 快速导航跳转

## 未来扩展

### 1. 高级分析
- 创意表现对比分析
- 行业趋势分析
- 竞争对手分析

### 2. 智能推荐
- 基于数据的创意优化建议
- 最佳发布时机推荐
- 标签和分类建议

### 3. 导出功能
- 数据报表导出
- 图表截图保存
- PDF报告生成

### 4. 通知系统
- 收益变化提醒
- 里程碑达成通知
- 市场机会提醒

## 注意事项

1. **数据准确性**: 预期收益基于算法模型，实际收益可能有差异
2. **市场风险**: 收益受市场环境、平台发展等多因素影响
3. **更新频率**: 建议定期刷新数据获取最新信息
4. **隐私保护**: 个人资产数据仅用户本人可见

这个功能为创作者提供了全面的资产管理工具，帮助他们更好地了解创意表现，制定发展策略，实现价值最大化。