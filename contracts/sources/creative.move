// 模块: creative
// 创意管理系统模块 - 管理创意提交、实例和期待值
#[allow(unused_use,duplicate_alias)]
module dgti::creative {
    use std::string::{Self, utf8,String};
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::vec_map::{Self, VecMap};
    use sui::event;
    use std::vector;
    use std::option::{Self, Option};
    use dgti::points::{Self, PointsBalance};

    // 创意状态常量
    const STATUS_DRAFT: u8 = 0;      // 草稿
    const STATUS_SUBMITTED: u8 = 1;  // 已提交
    const STATUS_REVIEWING: u8 = 2;  // 审核中
    const STATUS_PUBLISHED: u8 = 3;  // 已发布
    const STATUS_REJECTED: u8 = 4;  // 已拒绝

    public enum Status {
        Draft,
        Submitted,
        Reviewing,
        Published,
        Rejected,
    }
 
    // 获取状态对应的数值（如果需要）
    public fun as_u8(status: &Status): u8 {
        match (status) {
            Status::Draft => 0,
            Status::Submitted => 1,
            Status::Reviewing => 2,
            Status::Published => 3,
            Status::Rejected => 4,
        }
    }

    // 创意对象
    public struct Creative has key, store {
        id: UID,
        creator: address,
        title: String,
        description: String,
        content: String,
        status: u8,
        created_at: u64,
        updated_at: u64,
        total_expectation: u64,
        revenue: u64,
        tags: vector<String>,
        category: String,
        encrypted_id: String, // 加密内容ID，用于后期加密内容管理
    }

    // 创意实例
    public struct CreativeInstance has key, store {
        id: UID,
        creative_id: ID,
        owner: address,
        purchased_at: u64,
        expectation_value: u64,
        access_level: u8, // 0:基础, 1:高级, 2:完整
    }

    // 期待值记录
    public struct Expectation has key, store {
        id: UID,
        creative_id: ID,
        user: address,
        value: u64,
        timestamp: u64,
        comment: String,
    }

    // 创意统计
    public struct CreativeStats has key, store {
        id: UID,
        creative_id: ID,
        total_views: u64,
        total_purchases: u64,
        total_expectations: u64,
        average_rating: u64,
        last_updated: u64,
    }

    // 创意提交事件
    public struct CreativeSubmitted has copy, drop {
        creator: address,
        title: String,
        description: String,
        category: String,
        created_at: u64,
        creative_id: ID,
    }

    // 共享创意对象 - 用于存储所有创意的引用
    public struct SharedCreatives has key {
        id: UID,
        creatives: vector<ID>,
    }

    // 创建新创意
    public fun create_creative(
        title: String,
        description: String,
        content: String,
        category: String,
        tags: vector<String>,
        ctx: &mut TxContext
    ): Creative {
        let creator = tx_context::sender(ctx);
        let now = tx_context::epoch(ctx);
        
        Creative {
            id: object::new(ctx),
            creator,
            title,
            description,
            content,
            status: STATUS_DRAFT,
            created_at: now,
            updated_at: now,
            total_expectation: 0,
            revenue: 0,
            tags,
            category,
            encrypted_id: utf8(b""), // 初始化为空字符串，后期可设置加密ID
        }
    }

    // 提交创意审核
    public fun submit_creative(
        creative: &mut Creative,
        _ctx: &mut TxContext
    ) {
        // 验证创作者
        assert!(creative.creator == tx_context::sender(_ctx), 1);
        
        // 验证状态
        assert!(creative.status == STATUS_DRAFT, 2);
        
        creative.status = STATUS_SUBMITTED;
        creative.updated_at = tx_context::epoch(_ctx);
    }

    // 更新创意信息
    public fun update_creative(
        creative: &mut Creative,
        title: Option<String>,
        description: Option<String>,
        content: Option<String>,
        category: Option<String>,
        tags: Option<vector<String>>,
        _ctx: &mut TxContext
    ) {
        // 验证创作者
        assert!(creative.creator == tx_context::sender(_ctx), 1);
        
        // 验证状态 (只有草稿状态可以更新)
        assert!(creative.status == STATUS_DRAFT, 2);
        
        // 更新字段
        if (option::is_some(&title)) {
            creative.title = option::destroy_some(title);
        };
        
        if (option::is_some(&description)) {
            creative.description = option::destroy_some(description);
        };
        
        if (option::is_some(&content)) {
            creative.content = option::destroy_some(content);
        };
        
        if (option::is_some(&category)) {
            creative.category = option::destroy_some(category);
        };
        
        if (option::is_some(&tags)) {
            creative.tags = option::destroy_some(tags);
        };
        
        creative.updated_at = tx_context::epoch(_ctx);
    }

    // 审核创意 (管理员功能)
    public fun review_creative(
        creative: &mut Creative,
        approved: bool,
        _ctx: &mut TxContext
    ) {
        // 验证状态
        assert!(creative.status == STATUS_SUBMITTED || creative.status == STATUS_REVIEWING, 2);
        
        if (approved) {
            creative.status = STATUS_PUBLISHED;
        } else {
            creative.status = STATUS_REJECTED;
        };
        
        creative.updated_at = tx_context::epoch(_ctx);
    }

    // 发布创意
    public fun publish_creative(
        creative: &mut Creative,
        _ctx: &mut TxContext
    ) {
        // 验证创作者
        assert!(creative.creator == tx_context::sender(_ctx), 1);
        
        // 验证状态
        assert!(creative.status == STATUS_REVIEWING, 2);
        
        creative.status = STATUS_PUBLISHED;
        creative.updated_at = tx_context::epoch(_ctx);
    }

    // 删除创意
    public fun delete_creative(
        creative: Creative,
        _ctx: &mut TxContext
    ) {
        // 验证创作者
        assert!(creative.creator == tx_context::sender(_ctx), 1);
        
        // 验证状态 (只有草稿或拒绝状态可以删除)
        assert!(creative.status == STATUS_DRAFT || creative.status == STATUS_REJECTED, 2);
        
        let Creative {
            id,
            creator: _,
            title: _,
            description: _,
            content: _,
            status: _,
            created_at: _,
            updated_at: _,
            total_expectation: _,
            revenue: _,
            tags: _,
            category: _,
            encrypted_id: _,
        } = creative;
        
        object::delete(id);
    }

    // 创建创意实例
    public fun create_instance(
        creative: &Creative,
        owner: address,
        expectation_value: u64,
        access_level: u8,
        ctx: &mut TxContext
    ): CreativeInstance {
        // 验证创意状态
        assert!(creative.status == STATUS_PUBLISHED, 1);
        
        // 验证访问级别
        assert!(access_level <= 2, 2);
        
        CreativeInstance {
            id: object::new(ctx),
            creative_id: object::id(creative),
            owner,
            purchased_at: tx_context::epoch(ctx),
            expectation_value,
            access_level,
        }
    }

    // 转移创意实例
    public fun transfer_instance(
        instance: &mut CreativeInstance,
        new_owner: address,
        _ctx: &mut TxContext
    ) {
        // 验证当前所有者
        assert!(instance.owner == tx_context::sender(_ctx), 1);
        
        instance.owner = new_owner;
    }

    // 添加期待值
    public fun add_expectation(
        creative: &mut Creative,
        user: address,
        value: u64,
        comment: String,
        ctx: &mut TxContext
    ): Expectation {
        // 验证创意状态
        assert!(creative.status == STATUS_PUBLISHED, 1);
        
        // 验证期待值范围
        assert!(value > 0 && value <= 1000, 2); // 1-1000范围
        
        // 更新创意总期待值
        creative.total_expectation = creative.total_expectation + value;
        creative.updated_at = tx_context::epoch(ctx);
        
        // 创建期待值记录
        Expectation {
            id: object::new(ctx),
            creative_id: object::id(creative),
            user,
            value,
            timestamp: tx_context::epoch(ctx),
            comment,
        }
    }

    // 更新期待值
    public fun update_expectation(
        expectation: &mut Expectation,
        new_value: u64,
        creative: &mut Creative,
        _ctx: &mut TxContext
    ) {
        // 验证用户
        assert!(expectation.user == tx_context::sender(_ctx), 1);
        
        // 验证新值范围
        assert!(new_value > 0 && new_value <= 1000, 2);
        
        // 计算差值并更新创意总期待值
        let diff = new_value - expectation.value;
        creative.total_expectation = creative.total_expectation + diff;
        creative.updated_at = tx_context::epoch(_ctx);
        
        // 更新期待值记录
        expectation.value = new_value;
    }

    // 获取创意总期待值
    public fun get_total_expectation(creative: &Creative): u64 {
        creative.total_expectation
    }

    // 计算用户期待值占比
    public fun calculate_user_expectation_ratio(
        creative: &Creative,
        user_expectation: u64
    ): u64 {
        if (creative.total_expectation == 0) {
            return 0
        };
        
        // 返回basis points (1/10000)
        (user_expectation * 10000) / creative.total_expectation
    }

    // 获取创意信息
    public fun get_creative_info(creative: &Creative): (String, String, String, u8, address, u64) {
        (
            creative.title,
            creative.description,
            creative.category,
            creative.status,
            creative.creator,
            creative.created_at
        )
    }

    // 获取创意状态
    public fun get_status(creative: &Creative): u8 {
        creative.status
    }

    // 检查创意是否已发布
    public fun is_published(creative: &Creative): bool {
        creative.status == STATUS_PUBLISHED
    }

    // 获取创作者地址
    public fun get_creator(creative: &Creative): address {
        creative.creator
    }

    // 获取创意收入
    public fun get_revenue(creative: &Creative): u64 {
        creative.revenue
    }

    // 更新创意收入
    public fun update_revenue(
        creative: &mut Creative,
        amount: u64,
        _ctx: &mut TxContext
    ) {
        creative.revenue = creative.revenue + amount;
        creative.updated_at = tx_context::epoch(_ctx);
    }

    // 获取创意标签
    public fun get_tags(creative: &Creative): vector<String> {
        creative.tags
    }

    // 获取创意分类
    public fun get_category(creative: &Creative): String {
        creative.category
    }

    // 设置加密ID
    public fun set_encrypted_id(
        creative: &mut Creative,
        encrypted_id: String,
        _ctx: &mut TxContext
    ) {
        // 验证创作者
        assert!(creative.creator == tx_context::sender(_ctx), 1);
        
        // 验证状态 (只有草稿或已发布状态可以设置加密ID)
        assert!(creative.status == STATUS_DRAFT || creative.status == STATUS_PUBLISHED, 2);
        
        // 验证加密ID不为空
        assert!(!string::is_empty(&encrypted_id), 3);
        
        creative.encrypted_id = encrypted_id;
        creative.updated_at = tx_context::epoch(_ctx);
    }

    // 获取加密ID
    public fun get_encrypted_id(creative: &Creative): &String {
        &creative.encrypted_id
    }

    // 检查是否设置了加密ID
    public fun has_encrypted_id(creative: &Creative): bool {
        !string::is_empty(&creative.encrypted_id)
    }

    // 创建创意统计
    public fun create_stats(
        creative_id: ID,
        ctx: &mut TxContext
    ): CreativeStats {
        CreativeStats {
            id: object::new(ctx),
            creative_id,
            total_views: 0,
            total_purchases: 0,
            total_expectations: 0,
            average_rating: 0,
            last_updated: tx_context::epoch(ctx),
        }
    }

    // 更新统计信息
    public fun update_stats(
        stats: &mut CreativeStats,
        views: u64,
        purchases: u64,
        expectations: u64,
        rating: u64,
        _ctx: &mut TxContext
    ) {
        stats.total_views = stats.total_views + views;
        stats.total_purchases = stats.total_purchases + purchases;
        stats.total_expectations = stats.total_expectations + expectations;
        
        // 更新平均评分
        if (rating > 0) {
            stats.average_rating = (stats.average_rating + rating) / 2;
        };
        
        stats.last_updated = tx_context::epoch(_ctx);
    }

    // 获取统计信息
    public fun get_stats(stats: &CreativeStats): (u64, u64, u64, u64) {
        (
            stats.total_views,
            stats.total_purchases,
            stats.total_expectations,
            stats.average_rating
        )
    }

    // 创建共享创意对象
    public fun create_shared_creatives(ctx: &mut TxContext): SharedCreatives {
        SharedCreatives {
            id: object::new(ctx),
            creatives: vector::empty<ID>(),
        }
    }

    // 添加创意到共享对象
    public fun add_creative_to_shared(
        shared: &mut SharedCreatives,
        creative_id: ID,
        ctx: &mut TxContext
    ) {
        vector::push_back(&mut shared.creatives, creative_id);
        shared.id = object::uid_from_address(tx_context::sender(ctx));
    }

    // 获取所有创意ID
    public fun get_all_creatives(shared: &SharedCreatives): vector<ID> {
        shared.creatives
    }

    // 外部调用接口函数 - 提交创意到共享对象
    public fun submit_creative_to_shared(
        shared: &mut SharedCreatives,
        title: String,
        description: String,
        content: String,
        category: String,
        tags: vector<String>,
        ctx: &mut TxContext
    ): (Creative, ID) {
        let sender = tx_context::sender(ctx);
        let now = tx_context::epoch(ctx);
        
        // 创建新的创意对象
        let creative = Creative {
            id: object::new(ctx),
            creator: sender,
            title,
            description,
            content,
            status: STATUS_DRAFT,
            created_at: now,
            updated_at: now,
            total_expectation: 0,
            revenue: 0,
            tags,
            category,
            encrypted_id: utf8(b""), // 初始化为空字符串
        };

        // 获取创意ID
        let creative_id = object::id(&creative);

        // 将创意添加到共享对象
        add_creative_to_shared(shared, creative_id, ctx);

        // 发送创意提交事件
        let event = CreativeSubmitted {
            creator: sender,
            title: creative.title,
            description: creative.description,
            category: creative.category,
            created_at: now,
            creative_id,
        };
        event::emit(ctx, event);

        // 返回创意对象和ID
        (creative, creative_id)
    }

    // 获取共享对象中的创意数量
    public fun get_creative_count(shared: &SharedCreatives): u64 {
        vector::length(&shared.creatives)
    }

    // 检查创意是否在共享对象中
    public fun is_creative_in_shared(shared: &SharedCreatives, creative_id: ID): bool {
        let ids = shared.creatives;
        let i = 0;
        let len = vector::length(&ids);
        while (i < len) {
            if (vector::borrow(&ids, i) == &creative_id) {
                return true
            };
            i = i + 1;
        };
        false
    }
}
