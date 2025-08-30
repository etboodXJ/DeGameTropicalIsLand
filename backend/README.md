# 后端开发指南

## 技术栈
- Node.js 18
- Express 框架
- Supabase 数据库
- JWT 认证

## 目录结构
- `config/`: 配置文件
- `controllers/`: 业务逻辑
- `routes/`: API路由定义
- `models/`: 数据模型

## 开发规范
1. 使用ES Modules语法
2. 所有API响应遵循统一格式：
```json
{
  "code": 200,
  "data": {},
  "message": "success"
}
```
3. 错误处理使用中间件统一管理

## 开发命令
```bash
npm install   # 安装依赖
npm run dev   # 启动开发服务器
npm run test  # 运行单元测试
```