# Sui 智能合约开发指南

## 开发环境
- Sui Move 编程语言
- Sui CLI 工具链
- Sui Devnet 测试环境

## 目录结构
- `modules/`: Move模块
- `scripts/`: 部署脚本
- `tests/`: 合约测试

## 开发规范
1. 每个功能模块单独创建.move文件
2. 使用Sui标准库最佳实践
3. 所有公开方法必须有文档注释
4. 测试覆盖率不低于80%

## 常用命令
```bash
sui move build  # 构建合约
sui move test   # 运行测试
sui client publish --gas-budget 10000000  # 部署合约
```