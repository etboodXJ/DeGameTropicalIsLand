// Module: points
// 积分系统模块 - 管理用户积分购买、兑换和排行榜
#[allow(unused_use,duplicate_alias)]
module dgti::points {
    use std::string::{Self, String};
    use sui::object::{Self, UID, ID};
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::table::{Self, Table};
    use sui::vec_map::{Self, VecMap};
    use sui::sui::SUI;

    // 积分余额对象
    public struct PointsBalance has key {
        id: UID,
        balance: u64,
        owner: address,
    }

    // 积分排行榜
    public struct Leaderboard has key, store {
        id: UID,
        entries: VecMap<address, LeaderboardEntry>,
        last_updated: u64,
    }

    // 排行榜条目
    public struct LeaderboardEntry has store {
        user_address: address,
        points: u64,
        username: String,
    }

    // 积分兑换配置
    public struct ExchangeConfig has key {
        id: UID,
        points_per_sui: u64,
        enabled: bool,
    }

    // 创建积分余额
    public fun create_balance(ctx: &mut TxContext): PointsBalance {
        PointsBalance {
            id: object::new(ctx),
            balance: 0,
            owner: tx_context::sender(ctx),
        }
    }

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

    // 购买积分 - 使用SUI兑换积分
    // public fun purchase_points(
    //     balance: &mut PointsBalance,
    //     payment: Coin<SUI>,
    //     config: &ExchangeConfig,
    //     _ctx: &mut TxContext
    // ) {
    //     // 验证兑换配置是否启用
    //     assert!(config.enabled, 0);
        
    //     // 验证余额所有者
    //     assert!(balance.owner == tx_context::sender(_ctx), 1);
        
    //     // 计算获得的积分数量
    //     let sui_amount = coin::value(&payment);
    //     let points_amount = sui_amount * config.points_per_sui;
        
    //     // 更新积分余额
    //     balance.balance = balance.balance + points_amount;
        
    //     // 销毁支付的SUI
    //     //coin::burn_zero(payment);
    // }

    // 转移积分
    public fun transfer_points(
        from_balance: &mut PointsBalance,
        to_balance: &mut PointsBalance,
        amount: u64,
        _ctx: &mut TxContext
    ) {
        // 验证发送者
        assert!(from_balance.owner == tx_context::sender(_ctx), 1);
        
        // 验证余额充足
        assert!(from_balance.balance >= amount, 2);
        
        // 执行转移
        from_balance.balance = from_balance.balance - amount;
        to_balance.balance = to_balance.balance + amount;
    }

    // 使用积分兑换资产
    public fun exchange_for_asset(
        balance: &mut PointsBalance,
        cost: u64,
        _ctx: &mut TxContext
    ): bool {
        // 验证余额所有者
        assert!(balance.owner == tx_context::sender(_ctx), 1);
        
        // 验证余额充足
        if (balance.balance < cost) {
            return false
        };
        
        // 扣除积分
        balance.balance = balance.balance - cost;
        true
    }

    // 创建兑换配置
    public fun create_exchange_config(
        points_per_sui: u64,
        ctx: &mut TxContext
    ): ExchangeConfig {
        ExchangeConfig {
            id: object::new(ctx),
            points_per_sui,
            enabled: true,
        }
    }

    // 更新兑换配置
    public fun update_exchange_config(
        config: &mut ExchangeConfig,
        points_per_sui: u64,
        enabled: bool,
        _ctx: &mut TxContext
    ) {
        config.points_per_sui = points_per_sui;
        config.enabled = enabled;
    }

    // 获取兑换汇率
    public fun get_exchange_rate(config: &ExchangeConfig): u64 {
        config.points_per_sui
    }

    // 检查兑换是否启用
    public fun is_exchange_enabled(config: &ExchangeConfig): bool {
        config.enabled
    }

    // 创建排行榜
    public fun create_leaderboard(ctx: &mut TxContext): Leaderboard {
        Leaderboard {
            id: object::new(ctx),
            entries: vec_map::empty(),
            last_updated: tx_context::epoch(ctx),
        }
    }

    // 更新排行榜
    public fun update_leaderboard(
        leaderboard: &mut Leaderboard,
        user_address: address,
        username: String,
        points: u64,
        _ctx: &mut TxContext
    ) {
        let entry = LeaderboardEntry {
            user_address,
            points,
            username,
        };
        
        vec_map::insert(&mut leaderboard.entries, user_address, entry);
        leaderboard.last_updated = tx_context::epoch(_ctx);
    }

    // 获取前N名用户
    // public fun get_top_users(
    //     leaderboard: &Leaderboard,
    //     n: u64
    // ): vector<LeaderboardEntry> {
    //     let mut result = vector[];
        
    //     // 创建entries的副本进行排序，不破坏原始数据
    //     let mut entries = vec_map::values(&leaderboard.entries);
        
    //     // 简单排序 (实际应用中可能需要更高效的排序算法)
    //     let i = 0;
    //     while (i < vector::length(&entries) && i < n) {
    //         let mut max_index = i;
    //         let mut j = i + 1;
            
    //         while (j < vector::length(&entries)) {
    //             let current = vector::borrow(&entries, j);
    //             let max = vector::borrow(&entries, max_index);
    //             if (current.points > max.points) {
    //                 max_index = j;
    //             };
    //             j = j + 1;
    //         };
            
    //         if (max_index != i) {
    //             vector::swap(&mut entries, i, max_index);
    //         };
            
    //         vector::push_back(&mut result, *vector::borrow(&entries, i));
    //         i = i + 1;
    //     };
        
    //     result
    // }

    // 获取用户排名
    // public fun get_user_rank(
    //     leaderboard: &Leaderboard,
    //     user_address: address
    // ): (u64, u64) {
    //     if (!vec_map::contains(&leaderboard.entries, &user_address)) {
    //         return (0, 0)
    //     };
        
    //     let user_entry = vec_map::borrow(&leaderboard.entries, &user_address);
    //     let user_points = user_entry.points;
    //     let mut rank = 1;
        
    //     // 计算排名
    //     let entries = vec_map::values(&leaderboard.entries);
    //     let i = 0;
    //     while (i < vector::length(&entries)) {
    //         let entry = vector::borrow(&entries, i);
    //         if (entry.points > user_points) {
    //             rank = rank + 1;
    //         };
    //         i = i + 1;
    //     };
        
    //     (rank, vec_map::length(&leaderboard.entries))
    // }

    // 获取用户积分信息
    // public fun get_user_points(
    //     leaderboard: &Leaderboard,
    //     user_address: address
    // ): u64 {
    //     if (!vec_map::contains(&leaderboard.entries, &user_address)) {
    //         return 0
    //     };
        
    //     let entry = vec_map::borrow(&leaderboard.entries, &user_address);
    //     entry.points
    // }

    // 奖励积分
    public fun reward_points(
        balance: &mut PointsBalance,
        amount: u64,
        _ctx: &mut TxContext
    ) {
        // 验证余额所有者
        assert!(balance.owner == tx_context::sender(_ctx), 1);
        
        balance.balance = balance.balance + amount;
    }

    // 扣除积分
    public fun deduct_points(
        balance: &mut PointsBalance,
        amount: u64,
        _ctx: &mut TxContext
    ) {
        // 验证余额所有者
        assert!(balance.owner == tx_context::sender(_ctx), 1);
        
        // 验证余额充足
        assert!(balance.balance >= amount, 2);
        
        balance.balance = balance.balance - amount;
    }
}
