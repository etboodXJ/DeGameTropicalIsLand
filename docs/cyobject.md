# 创意对象
```rust
    public struct Creative has key, store {
        id: UID,
        creator: address,// 创作者地址
        title: String,// 创意标题
        description: String,// 创意描述
        content: String,// 创意内容
        status: u8,// 创意状态，0: 未发布；1：已发布；2：下架
        created_at: u64,// 创建时间
        updated_at: u64,// 更新时间
        total_expectation: u64,// 预期收益（单位：MIST）
        revenue: u64,// 实际收益（单位：MIST）
        tags: vector<String>,// 标签列表
        category: String,// 分类
        encrypted_id: String, // 加密内容ID，用于后期加密内容管理
    }
```
