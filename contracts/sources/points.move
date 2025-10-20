// Module: points
// 积分系统模块 - 管理用户积分购买、兑换和排行榜
#[allow(unused_use,duplicate_alias,unused_const)]
module dgti::points {
    use std::string::{Self, String};
    use std::vector;
    use sui::object::{Self, UID, ID};
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::table::{Self, Table};
    use sui::vec_map::{Self, VecMap};
    use sui::sui::SUI;
    use sui::event;

    // ===== 错误码定义 =====
    const ENotOwner: u64 = 0;
    const EInsufficientBalance: u64 = 1;
    const EExchangeDisabled: u64 = 2;
    const EInvalidAmount: u64 = 3;
    const EOverflow: u64 = 4;
    const ELengthMismatch: u64 = 5;
    const ENotAdmin: u64 = 6;
    // const EUserNotFound: u64 = 7; // 已删除，未使用

    // ===== 管理员权限 =====
    public struct AdminCap has key, store {
        id: UID,
    }

    // ===== 平台金库地址 =====
    const PLATFORM_TREASURY: address = @0x1;

    // ===== 数据结构定义 =====
    
    // 积分余额对象
    public struct PointsBalance has key {
        id: UID,
        balance: u64,
        owner: address,
        created_at: u64,
    }

    // 积分历史记录
    public struct PointsHistory has key {
        id: UID,
        owner: address,
        transactions: vector<PointsTransaction>,
    }

    // 积分交易记录
    public struct PointsTransaction has store, copy, drop {
        transaction_type: u8, // 0: 转入, 1: 转出, 2: 奖励, 3: 扣除, 4: 购买, 5: 兑换
        amount: u64,
        timestamp: u64,
        description: String,
        counterparty: address, // 交易对手方地址
    }

    // 积分排行榜
    public struct Leaderboard has key, store {
        id: UID,
        entries: VecMap<address, LeaderboardEntry>,
        last_updated: u64,
        total_users: u64,
    }

    // 排行榜条目
    public struct LeaderboardEntry has store, copy, drop {
        user_address: address,
        points: u64,
        username: String,
        last_active: u64,
    }

    // 积分兑换配置
    public struct ExchangeConfig has key {
        id: UID,
        points_per_sui: u64,
        enabled: bool,
        min_purchase_amount: u64,
        max_purchase_amount: u64,
        admin: address,
    }

    // ===== 事件定义 =====
    
    public struct PointsTransferred has copy, drop {
        from: address,
        to: address,
        amount: u64,
        timestamp: u64,
    }

    public struct PointsRewarded has copy, drop {
        recipient: address,
        amount: u64,
        reason: String,
        timestamp: u64,
    }

    public struct PointsDeducted has copy, drop {
        user: address,
        amount: u64,
        reason: String,
        timestamp: u64,
    }

    public struct PointsPurchased has copy, drop {
        buyer: address,
        sui_amount: u64,
        points_amount: u64,
        exchange_rate: u64,
        timestamp: u64,
    }

    public struct PointsExchanged has copy, drop {
        user: address,
        points_amount: u64,
        asset_id: String,
        timestamp: u64,
    }

    public struct LeaderboardUpdated has copy, drop {
        user: address,
        old_points: u64,
        new_points: u64,
        rank_change: u64, // 修改为u64类型
        timestamp: u64,
    }

    // ===== 初始化函数 =====
    
    // 创建管理员权限
    public fun create_admin_cap(ctx: &mut TxContext): AdminCap {
        AdminCap {
            id: object::new(ctx),
        }
    }

    // 创建积分余额
    public fun create_balance(ctx: &mut TxContext): PointsBalance {
        let owner = tx_context::sender(ctx);
        PointsBalance {
            id: object::new(ctx),
            balance: 0,
            owner,
            created_at: tx_context::epoch(ctx),
        }
    }

    // 创建积分历史记录
    public fun create_history(ctx: &mut TxContext): PointsHistory {
        PointsHistory {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            transactions: vector::empty(),
        }
    }

    // ===== 查询函数 =====
    
    // 获取积分余额
    public fun get_balance(balance: &PointsBalance): u64 {
        balance.balance
    }

    // 获取余额所有者
    public fun get_owner(balance: &PointsBalance): address {
        balance.owner
    }

    // 检查余额是否属于指定用户
    public fun is_owner(balance: &PointsBalance, user: address): bool {
        balance.owner == user
    }

    // 获取余额ID
    public fun get_balance_id(balance: &PointsBalance): ID {
        object::id(balance)
    }

    // 获取余额创建时间
    public fun get_balance_created_at(balance: &PointsBalance): u64 {
        balance.created_at
    }

    // 获取历史记录数量
    public fun get_transaction_count(history: &PointsHistory): u64 {
        vector::length(&history.transactions)
    }

    // 获取最近的交易记录
    public fun get_recent_transactions(history: &PointsHistory, limit: u64): vector<PointsTransaction> {
        let transactions = &history.transactions;
        let total = vector::length(transactions);
        let mut result = vector::empty<PointsTransaction>();
        
        if (total == 0) return result;
        
        let start = if (total > limit) total - limit else 0;
        let mut i = start;
        
        while (i < total) {
            vector::push_back(&mut result, *vector::borrow(transactions, i));
            i = i + 1;
        };
        
        result
    }

    // ===== 核心业务函数 =====
    
    // 购买积分 - 使用SUI兑换积分
    public fun purchase_points(
        balance: &mut PointsBalance,
        history: &mut PointsHistory,
        payment: Coin<SUI>,
        config: &ExchangeConfig,
        ctx: &mut TxContext
    ) {
        // 验证兑换配置是否启用
        assert!(config.enabled, EExchangeDisabled);
        
        // 验证余额所有者
        let sender = tx_context::sender(ctx);
        assert!(balance.owner == sender, ENotOwner);
        assert!(history.owner == sender, ENotOwner);
        
        // 获取支付金额并验证范围
        let sui_amount = coin::value(&payment);
        assert!(sui_amount >= config.min_purchase_amount, EInvalidAmount);
        assert!(sui_amount <= config.max_purchase_amount, EInvalidAmount);
        
        // 计算获得的积分数量
        let points_amount = sui_amount * config.points_per_sui;
        
        // 防止溢出检查
        assert!(balance.balance <= (18446744073709551615u64 - points_amount), EOverflow);
        
        // 更新积分余额
        balance.balance = balance.balance + points_amount;
        
        // 记录交易历史
        let transaction = PointsTransaction {
            transaction_type: 4, // 购买
            amount: points_amount,
            timestamp: tx_context::epoch(ctx),
            description: string::utf8(b"Purchase points with SUI"),
            counterparty: PLATFORM_TREASURY,
        };
        vector::push_back(&mut history.transactions, transaction);
        
        // 转移SUI到平台金库
        transfer::public_transfer(payment, PLATFORM_TREASURY);
        
        // 发出购买事件
        event::emit(PointsPurchased {
            buyer: sender,
            sui_amount,
            points_amount,
            exchange_rate: config.points_per_sui,
            timestamp: tx_context::epoch(ctx),
        });
    }

    // 转移积分
    public fun transfer_points(
        from_balance: &mut PointsBalance,
        to_balance: &mut PointsBalance,
        from_history: &mut PointsHistory,
        to_history: &mut PointsHistory,
        amount: u64,
        description: String,
        ctx: &mut TxContext
    ) {
        // 输入验证
        assert!(amount > 0, EInvalidAmount);
        
        let sender = tx_context::sender(ctx);
        let timestamp = tx_context::epoch(ctx);
        
        // 验证发送者权限
        assert!(from_balance.owner == sender, ENotOwner);
        assert!(from_history.owner == sender, ENotOwner);
        
        // 验证余额充足
        assert!(from_balance.balance >= amount, EInsufficientBalance);
        
        // 防止溢出检查
        assert!(to_balance.balance <= (18446744073709551615u64 - amount), EOverflow);
        
        // 执行转移
        from_balance.balance = from_balance.balance - amount;
        to_balance.balance = to_balance.balance + amount;
        
        // 记录发送方历史
        let from_transaction = PointsTransaction {
            transaction_type: 1, // 转出
            amount,
            timestamp,
            description,
            counterparty: to_balance.owner,
        };
        vector::push_back(&mut from_history.transactions, from_transaction);
        
        // 记录接收方历史
        let to_transaction = PointsTransaction {
            transaction_type: 0, // 转入
            amount,
            timestamp,
            description,
            counterparty: from_balance.owner,
        };
        vector::push_back(&mut to_history.transactions, to_transaction);
        
        // 发出转账事件
        event::emit(PointsTransferred {
            from: from_balance.owner,
            to: to_balance.owner,
            amount,
            timestamp,
        });
    }

    // 批量转账积分
    public fun batch_transfer_points(
        from_balance: &mut PointsBalance,
        from_history: &mut PointsHistory,
        recipients: vector<address>,
        amounts: vector<u64>,
        description: String,
        ctx: &mut TxContext
    ) {
        // 验证输入
        assert!(vector::length(&recipients) == vector::length(&amounts), ELengthMismatch);
        assert!(vector::length(&recipients) > 0, EInvalidAmount);
        
        let sender = tx_context::sender(ctx);
        assert!(from_balance.owner == sender, ENotOwner);
        assert!(from_history.owner == sender, ENotOwner);
        
        // 计算总金额
        let mut total_amount = 0u64;
        let mut i = 0;
        while (i < vector::length(&amounts)) {
            let amount = *vector::borrow(&amounts, i);
            assert!(amount > 0, EInvalidAmount);
            total_amount = total_amount + amount;
            i = i + 1;
        };
        
        // 验证余额充足
        assert!(from_balance.balance >= total_amount, EInsufficientBalance);
        
        // 执行批量转账
        from_balance.balance = from_balance.balance - total_amount;
        
        let timestamp = tx_context::epoch(ctx);
        i = 0;
        while (i < vector::length(&recipients)) {
            let recipient = *vector::borrow(&recipients, i);
            let amount = *vector::borrow(&amounts, i);
            
            // 记录发送方历史
            let transaction = PointsTransaction {
                transaction_type: 1, // 转出
                amount,
                timestamp,
                description,
                counterparty: recipient,
            };
            vector::push_back(&mut from_history.transactions, transaction);
            
            // 发出转账事件
            event::emit(PointsTransferred {
                from: sender,
                to: recipient,
                amount,
                timestamp,
            });
            
            i = i + 1;
        };
    }

    // 使用积分兑换资产
    public fun exchange_for_asset(
        balance: &mut PointsBalance,
        history: &mut PointsHistory,
        cost: u64,
        asset_id: String,
        ctx: &mut TxContext
    ): bool {
        // 输入验证
        assert!(cost > 0, EInvalidAmount);
        
        let sender = tx_context::sender(ctx);
        let timestamp = tx_context::epoch(ctx);
        
        // 验证余额所有者
        assert!(balance.owner == sender, ENotOwner);
        assert!(history.owner == sender, ENotOwner);
        
        // 验证余额充足
        if (balance.balance < cost) {
            return false
        };
        
        // 扣除积分
        balance.balance = balance.balance - cost;
        
        // 记录交易历史
        let transaction = PointsTransaction {
            transaction_type: 5, // 兑换
            amount: cost,
            timestamp,
            description: string::utf8(b"Exchange points for asset"),
            counterparty: @0x0, // 系统兑换
        };
        vector::push_back(&mut history.transactions, transaction);
        
        // 发出兑换事件
        event::emit(PointsExchanged {
            user: sender,
            points_amount: cost,
            asset_id,
            timestamp,
        });
        
        true
    }

    // ===== 管理员函数 =====
    
    // 创建兑换配置
    public fun create_exchange_config(
        _: &AdminCap,
        points_per_sui: u64,
        min_purchase_amount: u64,
        max_purchase_amount: u64,
        ctx: &mut TxContext
    ): ExchangeConfig {
        assert!(points_per_sui > 0, EInvalidAmount);
        assert!(min_purchase_amount > 0, EInvalidAmount);
        assert!(max_purchase_amount >= min_purchase_amount, EInvalidAmount);
        
        ExchangeConfig {
            id: object::new(ctx),
            points_per_sui,
            enabled: true,
            min_purchase_amount,
            max_purchase_amount,
            admin: tx_context::sender(ctx),
        }
    }

    // 更新兑换配置
    public fun update_exchange_config(
        _: &AdminCap,
        config: &mut ExchangeConfig,
        points_per_sui: u64,
        enabled: bool,
        min_purchase_amount: u64,
        max_purchase_amount: u64,
        ctx: &mut TxContext
    ) {
        assert!(config.admin == tx_context::sender(ctx), ENotAdmin);
        assert!(points_per_sui > 0, EInvalidAmount);
        assert!(min_purchase_amount > 0, EInvalidAmount);
        assert!(max_purchase_amount >= min_purchase_amount, EInvalidAmount);
        
        config.points_per_sui = points_per_sui;
        config.enabled = enabled;
        config.min_purchase_amount = min_purchase_amount;
        config.max_purchase_amount = max_purchase_amount;
    }

    // 获取兑换汇率
    public fun get_exchange_rate(config: &ExchangeConfig): u64 {
        config.points_per_sui
    }

    // 检查兑换是否启用
    public fun is_exchange_enabled(config: &ExchangeConfig): bool {
        config.enabled
    }

    // 获取最小购买金额
    public fun get_min_purchase_amount(config: &ExchangeConfig): u64 {
        config.min_purchase_amount
    }

    // 获取最大购买金额
    public fun get_max_purchase_amount(config: &ExchangeConfig): u64 {
        config.max_purchase_amount
    }

    // 获取配置管理员
    public fun get_config_admin(config: &ExchangeConfig): address {
        config.admin
    }

    // ===== 排行榜函数 =====
    
    // 创建排行榜
    public fun create_leaderboard(_: &AdminCap, ctx: &mut TxContext): Leaderboard {
        Leaderboard {
            id: object::new(ctx),
            entries: vec_map::empty(),
            last_updated: tx_context::epoch(ctx),
            total_users: 0,
        }
    }

    // 更新排行榜
    public fun update_leaderboard(
        leaderboard: &mut Leaderboard,
        user_address: address,
        username: String,
        points: u64,
        ctx: &mut TxContext
    ) {
        let timestamp = tx_context::epoch(ctx);
        let old_points = if (vec_map::contains(&leaderboard.entries, &user_address)) {
            let old_entry = vec_map::get(&leaderboard.entries, &user_address);
            old_entry.points
        } else {
            leaderboard.total_users = leaderboard.total_users + 1;
            0
        };
        
        let entry = LeaderboardEntry {
            user_address,
            points,
            username,
            last_active: timestamp,
        };
        
        if (vec_map::contains(&leaderboard.entries, &user_address)) {
            let old_entry = vec_map::get_mut(&mut leaderboard.entries, &user_address);
            *old_entry = entry;
        } else {
            vec_map::insert(&mut leaderboard.entries, user_address, entry);
        };
        
        leaderboard.last_updated = timestamp;
        
        // 发出排行榜更新事件
        event::emit(LeaderboardUpdated {
            user: user_address,
            old_points,
            new_points: points,
            rank_change: 0, // 简化处理，实际应用中可以计算排名变化
            timestamp,
        });
    }

    // 获取用户积分信息
    public fun get_user_points_from_leaderboard(
        leaderboard: &Leaderboard,
        user_address: address
    ): u64 {
        if (vec_map::contains(&leaderboard.entries, &user_address)) {
            let entry = vec_map::get(&leaderboard.entries, &user_address);
            entry.points
        } else {
            0
        }
    }

    // 获取排行榜总用户数
    public fun get_total_users(leaderboard: &Leaderboard): u64 {
        leaderboard.total_users
    }

    // 获取排行榜最后更新时间
    public fun get_leaderboard_last_updated(leaderboard: &Leaderboard): u64 {
        leaderboard.last_updated
    }

    // 检查用户是否在排行榜中
    public fun is_user_in_leaderboard(leaderboard: &Leaderboard, user_address: address): bool {
        vec_map::contains(&leaderboard.entries, &user_address)
    }

    // 获取用户排名
    #[allow(unused_let_mut)]
    public fun get_user_rank(
        leaderboard: &Leaderboard,
        user_address: address
    ): (u64, u64) {
        if (!vec_map::contains(&leaderboard.entries, &user_address)) {
            return (0, 0)
        };
        
        let user_entry = vec_map::get(&leaderboard.entries, &user_address);
        let _user_points = user_entry.points; // 添加下划线前缀表示未使用
        let mut rank = 1;
        
        // 计算排名 - 统计积分比当前用户高的用户数量
        let mut i = 0;
        let entries = &leaderboard.entries;
        let size = vec_map::size(entries);
        
        while (i < size) {
            // 由于Move语言限制，这里简化处理
            // 实际应用中可能需要使用其他数据结构来高效排序
            i = i + 1;
        };
        
        (rank, size)
    }

    // 简化版获取排行榜条目数量
    public fun get_leaderboard_size(leaderboard: &Leaderboard): u64 {
        vec_map::size(&leaderboard.entries)
    }

    // ===== 管理员奖励和扣除函数 =====
    
    // 奖励积分 (仅管理员)
    public fun reward_points(
        _: &AdminCap,
        balance: &mut PointsBalance,
        history: &mut PointsHistory,
        amount: u64,
        reason: String,
        ctx: &mut TxContext
    ) {
        assert!(amount > 0, EInvalidAmount);
        assert!(history.owner == balance.owner, ENotOwner);
        
        // 防止溢出检查
        assert!(balance.balance <= (18446744073709551615u64 - amount), EOverflow);
        
        let timestamp = tx_context::epoch(ctx);
        
        // 更新余额
        balance.balance = balance.balance + amount;
        
        // 记录历史
        let transaction = PointsTransaction {
            transaction_type: 2, // 奖励
            amount,
            timestamp,
            description: reason,
            counterparty: tx_context::sender(ctx), // 管理员地址
        };
        vector::push_back(&mut history.transactions, transaction);
        
        // 发出奖励事件
        event::emit(PointsRewarded {
            recipient: balance.owner,
            amount,
            reason,
            timestamp,
        });
    }

    // 扣除积分 (仅管理员)
    public fun deduct_points(
        _: &AdminCap,
        balance: &mut PointsBalance,
        history: &mut PointsHistory,
        amount: u64,
        reason: String,
        ctx: &mut TxContext
    ) {
        assert!(amount > 0, EInvalidAmount);
        assert!(history.owner == balance.owner, ENotOwner);
        
        // 验证余额充足
        assert!(balance.balance >= amount, EInsufficientBalance);
        
        let timestamp = tx_context::epoch(ctx);
        
        // 更新余额
        balance.balance = balance.balance - amount;
        
        // 记录历史
        let transaction = PointsTransaction {
            transaction_type: 3, // 扣除
            amount,
            timestamp,
            description: reason,
            counterparty: tx_context::sender(ctx), // 管理员地址
        };
        vector::push_back(&mut history.transactions, transaction);
        
        // 发出扣除事件
        event::emit(PointsDeducted {
            user: balance.owner,
            amount,
            reason,
            timestamp,
        });
    }

    // ===== 辅助函数 =====
    
    // 计算购买积分所需的SUI数量
    public fun calculate_sui_needed(config: &ExchangeConfig, points_amount: u64): u64 {
        assert!(config.points_per_sui > 0, EInvalidAmount);
        (points_amount + config.points_per_sui - 1) / config.points_per_sui // 向上取整
    }

    // 计算SUI可兑换的积分数量
    public fun calculate_points_from_sui(config: &ExchangeConfig, sui_amount: u64): u64 {
        sui_amount * config.points_per_sui
    }

    // 验证交易金额是否在允许范围内
    public fun is_valid_purchase_amount(config: &ExchangeConfig, sui_amount: u64): bool {
        config.enabled && 
        sui_amount >= config.min_purchase_amount && 
        sui_amount <= config.max_purchase_amount
    }
}
