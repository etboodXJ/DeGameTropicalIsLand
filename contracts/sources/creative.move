// 模块: creative
// 创意管理系统模块 - 管理创意提交、实例和期待值
#[allow(unused_use,duplicate_alias)]
module dgti::creative {
    use std::string::{Self, utf8, String};
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
    
    // 主分类常量
    const CATEGORY_IDEA: vector<u8> = b"idea";
    const CATEGORY_PROTOTYPE: vector<u8> = b"prototype";
    const CATEGORY_PROJECT: vector<u8> = b"project";
    const CATEGORY_RESOURCE: vector<u8> = b"resource";

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

    // 创意类型枚举
    public enum CreativeType has store, copy, drop {
        // 数字内容类
        ImageText,      // 1. 图文创意
        Video,          // 2. 视频创意
        Novel,          // 3. 小说
        
        // 项目类
        ProductCrowdFund,    // 4. 某产品众筹
        DappSoftware,        // 5. 一个dapp软件
        Game,                // 6. 某个游戏
        MobileApp,           // 7. 某个app
        Website,             // 8. 某个网站
        
        // 实体类
        PhysicalStore,       // 9. 某个实体店
        
        // 活动类
        OfflineEvent,        // 10. 某个线下活动
        OfflineExhibition,   // 11. 某个线下展览
        OfflinePerformance,  // 12. 某个线下演出
        OfflineLecture,      // 13. 某个线下讲座
        OfflineTraining,     // 14. 某个线下培训
        OfflineCompetition,   // 15. 某个线下比赛
        OfflineGathering,    // 16. 某个线下聚会
    }

    // 获取创意类型对应的字符串
    public fun creative_type_to_string(creative_type: &CreativeType): String {
        match (creative_type) {
            CreativeType::ImageText => utf8(b"图文创意"),
            CreativeType::Video => utf8(b"视频创意"),
            CreativeType::Novel => utf8(b"小说"),
            CreativeType::ProductCrowdFund => utf8(b"产品众筹"),
            CreativeType::DappSoftware => utf8(b"DAPP软件"),
            CreativeType::Game => utf8(b"游戏"),
            CreativeType::MobileApp => utf8(b"移动应用"),
            CreativeType::Website => utf8(b"网站"),
            CreativeType::PhysicalStore => utf8(b"实体店"),
            CreativeType::OfflineEvent => utf8(b"线下活动"),
            CreativeType::OfflineExhibition => utf8(b"线下展览"),
            CreativeType::OfflinePerformance => utf8(b"线下演出"),
            CreativeType::OfflineLecture => utf8(b"线下讲座"),
            CreativeType::OfflineTraining => utf8(b"线下培训"),
            CreativeType::OfflineCompetition => utf8(b"线下比赛"),
            CreativeType::OfflineGathering => utf8(b"线下聚会"),
        }
    }

    // 从字符串获取创意类型
    public fun string_to_creative_type(type_str: &String): CreativeType {
        let image_text = utf8(b"图文创意");
        let video = utf8(b"视频创意");
        let novel = utf8(b"小说");
        let product_crowd_fund = utf8(b"产品众筹");
        let dapp_software = utf8(b"DAPP软件");
        let game = utf8(b"游戏");
        let mobile_app = utf8(b"移动应用");
        let website = utf8(b"网站");
        let physical_store = utf8(b"实体店");
        let offline_event = utf8(b"线下活动");
        let offline_exhibition = utf8(b"线下展览");
        let offline_performance = utf8(b"线下演出");
        let offline_lecture = utf8(b"线下讲座");
        let offline_training = utf8(b"线下培训");
        let offline_competition = utf8(b"线下比赛");
        let offline_gathering = utf8(b"线下聚会");
        
        if (type_str == &image_text) {
            return CreativeType::ImageText
        } else if (type_str == &video) {
            return CreativeType::Video
        } else if (type_str == &novel) {
            return CreativeType::Novel
        } else if (type_str == &product_crowd_fund) {
            return CreativeType::ProductCrowdFund
        } else if (type_str == &dapp_software) {
            return CreativeType::DappSoftware
        } else if (type_str == &game) {
            return CreativeType::Game
        } else if (type_str == &mobile_app) {
            return CreativeType::MobileApp
        } else if (type_str == &website) {
            return CreativeType::Website
        } else if (type_str == &physical_store) {
            return CreativeType::PhysicalStore
        } else if (type_str == &offline_event) {
            return CreativeType::OfflineEvent
        } else if (type_str == &offline_exhibition) {
            return CreativeType::OfflineExhibition
        } else if (type_str == &offline_performance) {
            return CreativeType::OfflinePerformance
        } else if (type_str == &offline_lecture) {
            return CreativeType::OfflineLecture
        } else if (type_str == &offline_training) {
            return CreativeType::OfflineTraining
        } else if (type_str == &offline_competition) {
            return CreativeType::OfflineCompetition
        } else if (type_str == &offline_gathering) {
            return CreativeType::OfflineGathering
        } else {
            // 默认返回图文创意
            return CreativeType::ImageText
        }
    }

    // 创意对象
    public struct Creative has key, store {
        id: UID,
        creator: address,// 创作者地址
        title: String,// 创意标题
        description: String,// 创意描述
        content: String,// 创意内容
        creative_type: CreativeType, // 创意类型
        status: u8,// 创意状态，0: 未发布；1：已发布；2：下架
        created_at: u64,// 创建时间
        updated_at: u64,// 更新时间
        total_expectation: u64,// 预期收益（单位：聪）
        revenue: u64,// 实际收益（单位：聪）
        tags: vector<String>,// 标签列表
        category: String,// 分类
        encrypted_id: String, // 加密内容ID，用于后期加密内容管理
        follow: address,// 跟随创意对象的地址
        prev: address,// 上一个创意对象的地址
        fans: vector<address>,// 粉丝列表
        list: vector<address>,// 创意列表 CreativeDetail的地址列表
    }

    // 创意实例
    public struct CreativeDetail has key, store {
        id: UID,
        creator: address,// 创作者地址
        title: String,// 创意标题
        description: String,// 创意描述
        content: String,// 创意内容
        status: u8,// 创意状态，0: 未发布；1：已发布；2：下架
        created_at: u64,// 创建时间
        updated_at: u64,// 更新时间
        tags: vector<String>,// 标签列表
        category: String,// 分类
        encrypted_id: String, // 加密内容ID，用于后期加密内容管理
    }

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
        creative_type: CreativeType,
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
            creative_type,
            status: STATUS_DRAFT,
            created_at: now,
            updated_at: now,
            total_expectation: 0,
            revenue: 0,
            tags,
            category,
            encrypted_id: utf8(b""), // 初始化为空字符串，后期可设置加密ID
            follow: @0x0, // 初始化为零地址
            prev: @0x0, // 初始化为零地址
            fans: vector::empty<address>(), // 初始化为空向量
            list: vector::empty<address>(), // 初始化为空向量
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
            follow: _,
            prev: _,
            fans: _,
            list: _,
            creative_type: _,
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
        _ctx: &mut TxContext
    ) {
        vector::push_back(&mut shared.creatives, creative_id);
        // UID 不能直接赋值，这里我们不需要更新 UID
    }

    // 获取所有创意ID
    public fun get_all_creatives(shared: &SharedCreatives): vector<ID> {
        shared.creatives
    }

    // 外部调用入口函数 - 提交创意到共享对象
    #[allow(lint(public_entry))]
    entry fun submit_creative_to_shared(
        title: String,
        description: String,
        content: String,
        creative_type: u8,
        category: String,
        tags: vector<String>,
        ctx: &mut TxContext,
    ) {
        let sender = tx_context::sender(ctx);
        let now = tx_context::epoch(ctx);
        
        let id = object::new(ctx);
        let cid = object::uid_to_inner(&id);

        // 将creative_type转换为枚举
        let creative_type_enum = if (creative_type == 0) {
            CreativeType::ImageText
        } else if (creative_type == 1) {
            CreativeType::Video
        } else if (creative_type == 2) {
            CreativeType::Novel
        } else if (creative_type == 3) {
            CreativeType::ProductCrowdFund
        } else if (creative_type == 4) {
            CreativeType::DappSoftware
        } else if (creative_type == 5) {
            CreativeType::Game
        } else if (creative_type == 6) {
            CreativeType::MobileApp
        } else if (creative_type == 7) {
            CreativeType::Website
        } else if (creative_type == 8) {
            CreativeType::PhysicalStore
        } else if (creative_type == 9) {
            CreativeType::OfflineEvent
        } else if (creative_type == 10) {
            CreativeType::OfflineExhibition
        } else if (creative_type == 11) {
            CreativeType::OfflinePerformance
        } else if (creative_type == 12) {
            CreativeType::OfflineLecture
        } else if (creative_type == 13) {
            CreativeType::OfflineTraining
        } else if (creative_type == 14) {
            CreativeType::OfflineCompetition
        } else if (creative_type == 15) {
            CreativeType::OfflineGathering
        } else {
            CreativeType::ImageText
        };

        // 创建新的创意对象
        let creative = Creative {
            id,
            creator: sender,
            title,
            description,
            content,
            creative_type: creative_type_enum,
            status: STATUS_DRAFT,
            created_at: now,
            updated_at: now,
            total_expectation: 0,
            revenue: 0,
            tags,
            category,
            encrypted_id: utf8(b""), // 初始化为空字符串
            follow: @0x0, // 初始化为零地址
            prev: @0x0, // 初始化为零地址
            fans: vector::empty<address>(), // 初始化为空向量
            list: vector::empty<address>(), // 初始化为空向量
        };

        // 将创意添加到共享对象
        transfer::share_object(creative);

        // 发送创意提交事件
        let event = CreativeSubmitted {
            creator: sender,
            title: title,
            description: description,
            category: category,
            created_at: now,
            creative_id:cid,
        };
        event::emit(event);
    }

    // 获取共享对象中的创意数量
    public fun get_creative_count(shared: &SharedCreatives): u64 {
        vector::length(&shared.creatives)
    }

    // 检查创意是否在共享对象中
    public fun is_creative_in_shared(shared: &SharedCreatives, creative_id: ID): bool {
        let ids = shared.creatives;
        let mut i = 0;
        let len = vector::length(&ids);
        while (i < len) {
            if (vector::borrow(&ids, i) == &creative_id) {
                return true
            };
            i = i + 1;
        };
        false
    }

    // ========== CreativeDetail 相关功能 ==========

    // 创建新的 CreativeDetail
    public fun create_creative_detail(
        title: String,
        description: String,
        content: String,
        category: String,
        tags: vector<String>,
        ctx: &mut TxContext
    ): CreativeDetail {
        let creator = tx_context::sender(ctx);
        let now = tx_context::epoch(ctx);
        
        CreativeDetail {
            id: object::new(ctx),
            creator,
            title,
            description,
            content,
            status: STATUS_DRAFT,
            created_at: now,
            updated_at: now,
            tags,
            category,
            encrypted_id: utf8(b""), // 初始化为空字符串，后期可设置加密ID
        }
    }

    // 查询 CreativeDetail 信息
    public fun get_creative_detail_info(detail: &CreativeDetail): (String, String, String, u8, address, u64) {
        (
            detail.title,
            detail.description,
            detail.category,
            detail.status,
            detail.creator,
            detail.created_at
        )
    }

    // 获取 CreativeDetail 状态
    public fun get_creative_detail_status(detail: &CreativeDetail): u8 {
        detail.status
    }

    // 获取 CreativeDetail 创作者地址
    public fun get_creative_detail_creator(detail: &CreativeDetail): address {
        detail.creator
    }

    // 获取 CreativeDetail 标签
    public fun get_creative_detail_tags(detail: &CreativeDetail): vector<String> {
        detail.tags
    }

    // 获取 CreativeDetail 分类
    public fun get_creative_detail_category(detail: &CreativeDetail): String {
        detail.category
    }

    // 获取 CreativeDetail 加密ID
    public fun get_creative_detail_encrypted_id(detail: &CreativeDetail): &String {
        &detail.encrypted_id
    }

    // 检查 CreativeDetail 是否设置了加密ID
    public fun has_creative_detail_encrypted_id(detail: &CreativeDetail): bool {
        !string::is_empty(&detail.encrypted_id)
    }

    // 更新 CreativeDetail 信息
    public fun update_creative_detail(
        detail: &mut CreativeDetail,
        title: Option<String>,
        description: Option<String>,
        content: Option<String>,
        category: Option<String>,
        tags: Option<vector<String>>,
        _ctx: &mut TxContext
    ) {
        // 验证创作者
        assert!(detail.creator == tx_context::sender(_ctx), 1);
        
        // 验证状态 (只有草稿状态可以更新)
        assert!(detail.status == STATUS_DRAFT, 2);
        
        // 更新字段
        if (option::is_some(&title)) {
            detail.title = option::destroy_some(title);
        };
        
        if (option::is_some(&description)) {
            detail.description = option::destroy_some(description);
        };
        
        if (option::is_some(&content)) {
            detail.content = option::destroy_some(content);
        };
        
        if (option::is_some(&category)) {
            detail.category = option::destroy_some(category);
        };
        
        if (option::is_some(&tags)) {
            detail.tags = option::destroy_some(tags);
        };
        
        detail.updated_at = tx_context::epoch(_ctx);
    }

    // 提交 CreativeDetail 审核
    public fun submit_creative_detail(
        detail: &mut CreativeDetail,
        _ctx: &mut TxContext
    ) {
        // 验证创作者
        assert!(detail.creator == tx_context::sender(_ctx), 1);
        
        // 验证状态
        assert!(detail.status == STATUS_DRAFT, 2);
        
        detail.status = STATUS_SUBMITTED;
        detail.updated_at = tx_context::epoch(_ctx);
    }

    // 审核 CreativeDetail (管理员功能)
    public fun review_creative_detail(
        detail: &mut CreativeDetail,
        approved: bool,
        _ctx: &mut TxContext
    ) {
        // 验证状态
        assert!(detail.status == STATUS_SUBMITTED || detail.status == STATUS_REVIEWING, 2);
        
        if (approved) {
            detail.status = STATUS_PUBLISHED;
        } else {
            detail.status = STATUS_REJECTED;
        };
        
        detail.updated_at = tx_context::epoch(_ctx);
    }

    // 发布 CreativeDetail
    public fun publish_creative_detail(
        detail: &mut CreativeDetail,
        _ctx: &mut TxContext
    ) {
        // 验证创作者
        assert!(detail.creator == tx_context::sender(_ctx), 1);
        
        // 验证状态
        assert!(detail.status == STATUS_REVIEWING, 2);
        
        detail.status = STATUS_PUBLISHED;
        detail.updated_at = tx_context::epoch(_ctx);
    }

    // 删除 CreativeDetail
    public fun delete_creative_detail(
        detail: CreativeDetail,
        _ctx: &mut TxContext
    ) {
        // 验证创作者
        assert!(detail.creator == tx_context::sender(_ctx), 1);
        
        // 验证状态 (只有草稿或拒绝状态可以删除)
        assert!(detail.status == STATUS_DRAFT || detail.status == STATUS_REJECTED, 2);
        
        let CreativeDetail {
            id,
            creator: _,
            title: _,
            description: _,
            content: _,
            status: _,
            created_at: _,
            updated_at: _,
            tags: _,
            category: _,
            encrypted_id: _,
        } = detail;
        
        object::delete(id);
    }

    // 设置 CreativeDetail 加密ID
    public fun set_creative_detail_encrypted_id(
        detail: &mut CreativeDetail,
        encrypted_id: String,
        _ctx: &mut TxContext
    ) {
        // 验证创作者
        assert!(detail.creator == tx_context::sender(_ctx), 1);
        
        // 验证状态 (只有草稿或已发布状态可以设置加密ID)
        assert!(detail.status == STATUS_DRAFT || detail.status == STATUS_PUBLISHED, 2);
        
        // 验证加密ID不为空
        assert!(!string::is_empty(&encrypted_id), 3);
        
        detail.encrypted_id = encrypted_id;
        detail.updated_at = tx_context::epoch(_ctx);
    }

    // ========== Creative 与 CreativeDetail 交互功能 ==========

    // 添加 CreativeDetail 到 Creative
    public fun add_creative_detail_to_creative(
        creative: &mut Creative,
        detail_address: address,
        _ctx: &mut TxContext
    ) {
        // 验证创作者
        assert!(creative.creator == tx_context::sender(_ctx), 1);
        
        // 验证创意状态
        assert!(creative.status == STATUS_DRAFT || creative.status == STATUS_PUBLISHED, 2);
        
        // 添加到列表
        vector::push_back(&mut creative.list, detail_address);
        creative.updated_at = tx_context::epoch(_ctx);
    }

    // 从 Creative 中删除 CreativeDetail
    public fun remove_creative_detail_from_creative(
        creative: &mut Creative,
        detail_address: address,
        _ctx: &mut TxContext
    ) {
        // 验证创作者
        assert!(creative.creator == tx_context::sender(_ctx), 1);
        
        // 验证创意状态
        assert!(creative.status == STATUS_DRAFT, 2);
        
        // 查找并删除 CreativeDetail
        let details = &mut creative.list;
        let mut i = 0;
        let len = vector::length(details);
        let mut found = false;
        
        while (i < len) {
            if (vector::borrow(details, i) == &detail_address) {
                vector::remove(details, i);
                found = true;
                break
            };
            i = i + 1;
        };
        
        // 验证 CreativeDetail 存在
        assert!(found, 3);
        
        creative.updated_at = tx_context::epoch(_ctx);
    }

    // 获取 Creative 中的所有 CreativeDetail 地址
    public fun get_creative_details(creative: &Creative): vector<address> {
        creative.list
    }

    // 获取 Creative 中的 CreativeDetail 数量
    public fun get_creative_detail_count(creative: &Creative): u64 {
        vector::length(&creative.list)
    }

    // 检查 Creative 是否包含指定的 CreativeDetail
    public fun has_creative_detail(creative: &Creative, detail_address: address): bool {
        let details = creative.list;
        let mut i = 0;
        let len = vector::length(&details);
        while (i < len) {
            if (vector::borrow(&details, i) == &detail_address) {
                return true
            };
            i = i + 1;
        };
        false
    }

    // 添加粉丝到 Creative
    public fun add_fan_to_creative(
        creative: &mut Creative,
        fan_address: address,
        _ctx: &mut TxContext
    ) {
        // 验证创意状态
        assert!(creative.status == STATUS_PUBLISHED, 1);
        
        // 添加到粉丝列表
        vector::push_back(&mut creative.fans, fan_address);
        creative.updated_at = tx_context::epoch(_ctx);
    }

    // 从 Creative 中移除粉丝
    public fun remove_fan_from_creative(
        creative: &mut Creative,
        fan_address: address,
        _ctx: &mut TxContext
    ) {
        // 验证创作者
        assert!(creative.creator == tx_context::sender(_ctx), 1);
        
        // 验证创意状态
        assert!(creative.status == STATUS_PUBLISHED, 2);
        
        // 查找并移除粉丝
        let fans = &mut creative.fans;
        let mut i = 0;
        let len = vector::length(fans);
        let mut found = false;
        
        while (i < len) {
            if (vector::borrow(fans, i) == &fan_address) {
                vector::remove(fans, i);
                found = true;
                break
            };
            i = i + 1;
        };
        
        // 验证粉丝存在
        assert!(found, 3);
        
        creative.updated_at = tx_context::epoch(_ctx);
    }

    // 获取 Creative 的粉丝列表
    public fun get_creative_fans(creative: &Creative): vector<address> {
        creative.fans
    }

    // 获取 Creative 的粉丝数量
    public fun get_creative_fan_count(creative: &Creative): u64 {
        vector::length(&creative.fans)
    }

    // 设置 Creative 的跟随地址
    public fun set_creative_follow(
        creative: &mut Creative,
        follow_address: address,
        _ctx: &mut TxContext
    ) {
        // 验证创作者
        assert!(creative.creator == tx_context::sender(_ctx), 1);
        
        // 验证创意状态
        assert!(creative.status == STATUS_DRAFT || creative.status == STATUS_PUBLISHED, 2);
        
        creative.follow = follow_address;
        creative.updated_at = tx_context::epoch(_ctx);
    }

    // 获取 Creative 的跟随地址
    public fun get_creative_follow(creative: &Creative): address {
        creative.follow
    }

    // 设置 Creative 的上一个创意地址
    public fun set_creative_prev(
        creative: &mut Creative,
        prev_address: address,
        _ctx: &mut TxContext
    ) {
        // 验证创作者
        assert!(creative.creator == tx_context::sender(_ctx), 1);
        
        // 验证创意状态
        assert!(creative.status == STATUS_DRAFT || creative.status == STATUS_PUBLISHED, 2);
        
        creative.prev = prev_address;
        creative.updated_at = tx_context::epoch(_ctx);
    }

    // 获取 Creative 的上一个创意地址
    public fun get_creative_prev(creative: &Creative): address {
        creative.prev
    }
    
    // ========== 新增查询接口 ==========
    
    // 按主分类查询创意
    public fun is_category_match(creative: &Creative, category: &String): bool {
        &creative.category == category
    }
    
    // 按标签查询 (支持多标签AND/OR查询)
    public fun has_tags(creative: &Creative, tags: &vector<String>, match_all: bool): bool {
        let creative_tags = &creative.tags;
        let mut matched_count = 0;
        let target_count = vector::length(tags);
        
        let mut i = 0;
        while (i < target_count) {
            let target_tag = vector::borrow(tags, i);
            if (vector::contains(creative_tags, target_tag)) {
                matched_count = matched_count + 1;
                if (!match_all) {
                    return true // OR查询，匹配一个即返回
                }
            };
            i = i + 1;
        };
        
        if (match_all) {
            matched_count == target_count // AND查询，必须全部匹配
        } else {
            false // OR查询但没有匹配任何标签
        }
    }
    
    // 复合查询：分类 + 标签
    public fun matches_category_and_tags(
        creative: &Creative, 
        category: &String, 
        tags: &vector<String>,
        match_all_tags: bool
    ): bool {
        is_category_match(creative, category) && has_tags(creative, tags, match_all_tags)
    }
    
    // 成熟度筛选：检查是否属于指定成熟度分类
    public fun is_maturity_match(creative: &Creative, categories: &vector<String>): bool {
        let creative_category = &creative.category;
        vector::contains(categories, creative_category)
    }
    
    // 获取分类常量字符串
    public fun get_category_idea(): String {
        utf8(CATEGORY_IDEA)
    }
    
    public fun get_category_prototype(): String {
        utf8(CATEGORY_PROTOTYPE)
    }
    
    public fun get_category_project(): String {
        utf8(CATEGORY_PROJECT)
    }
    
    public fun get_category_resource(): String {
        utf8(CATEGORY_RESOURCE)
    }
    
    // 验证分类是否有效
    public fun is_valid_category(category: &String): bool {
        let idea = utf8(CATEGORY_IDEA);
        let prototype = utf8(CATEGORY_PROTOTYPE);
        let project = utf8(CATEGORY_PROJECT);
        let resource = utf8(CATEGORY_RESOURCE);
        
        category == &idea || category == &prototype || category == &project || category == &resource
    }
}
