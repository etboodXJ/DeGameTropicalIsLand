# Sui 智能合约开发指南

## 开发环境
- Sui Move 编程语言
- Sui CLI 工具链
- Sui testnet 测试环境

## 目录结构
- `sources/`: Move模块
- `tests/`: 合约测试

## 开发规范
1. 每个功能模块单独创建.move文件
2. 使用Sui标准库最佳实践
3. 所有公开方法必须有文档注释
4. 测试覆盖率不低于80%

## 常用命令
```bash
sui move new dgti  # 创建新项目
sui move build  # 构建合约
sui move test   # 运行测试
sui client publish --gas-budget 10000000  # 发布合约
```

## 结构设计
* 项目结构
* 用户积分
* 积分兑换

# 类型设计
* 资源类型
* 角色身份类型
* 积分类型

## 合约开发的功能
* 作者上架资源
* 作者积分奖励
* 身份加入组织/退出组织
* 用户积分获取
* 用户积分兑换
* 积分排行榜
