// 模块: revenue
// 盈利分配算法模块 - 管理创意盈利计算和分配
#[allow(unused_use,duplicate_alias,unused_const)]
module dgti::revenue {
    use std::string::{Self, String};
    
    use sui::object::{Self, UID, ID};
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin};
    use sui::tx_context::{Self, TxContext};
    use sui::table::{Self, Table};
    use sui::vec_map::{Self, VecMap};
    use std::vector;
    use std::option::{Self, Option};
    use dgti::creative::{Self, Creative};
    use dgti::points::{Self, PointsBalance, AdminCap, PointsHistory};

    // 分配比例常量 (basis points, 1/10000)
    const PLATFORM_FEE_RATIO: u64 = 1000;    // 10%
    const INVESTOR_SHARE_RATIO: u64 = 2000;  // 20%
    const CREATOR_SHARE_RATIO: u64 = 7000;   // 70%

    // 盈利分配记录
    public struct RevenueDistribution has key, store {
        id: UID,
        creative_id: ID,
        total_revenue: u64,
        platform_fee: u64,
        investor_share: u64,
        creator_share: u64,
        user_rewards: u64,
        timestamp: u64,
        is_distributed: bool,
    }

    // 用户返利记录
    public struct UserReward has key, store {
        id: UID,
        user: address,
        creative_id: ID,
        reward_amount: u64,
        expectation_ratio: u64, // 期待值占比 (basis points)
        claimed: bool,
        timestamp: u64,
    }

    // 平台收益池
    public struct PlatformPool has key {
        id: UID,
        balance: u64,
        total_revenue: u64,
        total_distributed: u64,
        last_updated: u64,
    }

    // 投资人收益记录
    public struct InvestorShare has key, store {
        id: UID,
        investor: address,
        creative_id: ID,
        share_amount: u64,
        claimed: bool,
        timestamp: u64,
    }

    // 创作者收益记录
    public struct CreatorRevenue has key, store {
        id: UID,
        creator: address,
        creative_id: ID,
        revenue_amount: u64,
        claimed: bool,
        timestamp: u64,
    }

    // 全局统计
    public struct GlobalStats has key, store {
        id: UID,
        total_platform_revenue: u64,
        total_creative_revenue: u64,
        total_user_rewards: u64,
        total_investor_shares: u64,
        active_creatives: u64,
        last_updated: u64,
    }

    // 创建平台收益池
    public fun create_platform_pool(ctx: &mut TxContext): PlatformPool {
        PlatformPool {
            id: object::new(ctx),
            balance: 0,
            total_revenue: 0,
            total_distributed: 0,
            last_updated: tx_context::epoch(ctx),
        }
    }

    // 创建全局统计
    public fun create_global_stats(ctx: &mut TxContext): GlobalStats {
        GlobalStats {
            id: object::new(ctx),
            total_platform_revenue: 0,
            total_creative_revenue: 0,
            total_user_rewards: 0,
            total_investor_shares: 0,
            active_creatives: 0,
            last_updated: tx_context::epoch(ctx),
        }
    }

    // 核心盈利分配算法
    public fun calculate_revenue_distribution(
        platform_revenue: u64,
        creative_total_expectation: u64,
        platform_total_expectation: u64,
        user_expectation: u64
    ): (u64, u64, u64, u64) {
        // 创意盈利 = 平台盈利 * 创意总期待值 / 平台总创意期待值
        let creative_revenue = if (platform_total_expectation > 0) {
            (platform_revenue * creative_total_expectation) / platform_total_expectation
        } else {
            0
        };

        // 用户返利 = 创意盈利 * 用户期待值 / 创意总期待值
        let user_reward = if (creative_total_expectation > 0) {
            (creative_revenue * user_expectation) / creative_total_expectation
        } else {
            0
        };

        // 盈利分配: 10%平台 20%投资人 70%平台盈利金库
        let platform_fee = (creative_revenue * PLATFORM_FEE_RATIO) / 10000;
        let investor_share = (creative_revenue * INVESTOR_SHARE_RATIO) / 10000;
        let creator_share = creative_revenue - platform_fee - investor_share - user_reward;

        (platform_fee, investor_share, creator_share, user_reward)
    }

    // 创建盈利分配记录
    public fun create_distribution(
        creative_id: ID,
        total_revenue: u64,
        platform_fee: u64,
        investor_share: u64,
        creator_share: u64,
        user_rewards: u64,
        ctx: &mut TxContext
    ): RevenueDistribution {
        RevenueDistribution {
            id: object::new(ctx),
            creative_id,
            total_revenue,
            platform_fee,
            investor_share,
            creator_share,
            user_rewards,
            timestamp: tx_context::epoch(ctx),
            is_distributed: false,
        }
    }

    // 执行盈利分配
    public fun distribute_revenue(
        distribution: &mut RevenueDistribution,
        platform_pool: &mut PlatformPool,
        global_stats: &mut GlobalStats,
        _ctx: &mut TxContext
    ) {
        // 验证分配状态
        assert!(!distribution.is_distributed, 1);

        // 更新平台收益池
        platform_pool.balance = platform_pool.balance + distribution.platform_fee;
        platform_pool.total_revenue = platform_pool.total_revenue + distribution.total_revenue;
        platform_pool.total_distributed = platform_pool.total_distributed + distribution.total_revenue;
        platform_pool.last_updated = tx_context::epoch(_ctx);

        // 更新全局统计
        global_stats.total_platform_revenue = global_stats.total_platform_revenue + distribution.platform_fee;
        global_stats.total_creative_revenue = global_stats.total_creative_revenue + distribution.creator_share;
        global_stats.total_user_rewards = global_stats.total_user_rewards + distribution.user_rewards;
        global_stats.total_investor_shares = global_stats.total_investor_shares + distribution.investor_share;
        global_stats.last_updated = tx_context::epoch(_ctx);

        // 标记为已分配
        distribution.is_distributed = true;
    }

    // 创建用户返利记录
    public fun create_user_reward(
        user: address,
        creative_id: ID,
        reward_amount: u64,
        expectation_ratio: u64,
        ctx: &mut TxContext
    ): UserReward {
        UserReward {
            id: object::new(ctx),
            user,
            creative_id,
            reward_amount,
            expectation_ratio,
            claimed: false,
            timestamp: tx_context::epoch(ctx),
        }
    }

    // 用户领取返利
    public fun claim_user_reward(
        reward: &mut UserReward,
        points_balance: &mut PointsBalance,
        points_history: &mut PointsHistory,
        admin_cap: &AdminCap,
        _ctx: &mut TxContext
    ): bool {
        // 验证用户
        assert!(reward.user == tx_context::sender(_ctx), 1);
        
        // 验证是否已领取
        assert!(!reward.claimed, 2);
        
        // 验证积分余额所有者
        assert!(points::is_owner(points_balance, reward.user), 3);
        
        // 发放积分奖励
        points::reward_points(
            admin_cap,
            points_balance,
            points_history,
            reward.reward_amount,
            string::utf8(b"User reward claim"),
            _ctx
        );
        
        // 标记为已领取
        reward.claimed = true;
        
        true
    }

    // 创建投资人收益记录
    public fun create_investor_share(
        investor: address,
        creative_id: ID,
        share_amount: u64,
        ctx: &mut TxContext
    ): InvestorShare {
        InvestorShare {
            id: object::new(ctx),
            investor,
            creative_id,
            share_amount,
            claimed: false,
            timestamp: tx_context::epoch(ctx),
        }
    }

    // 投资人领取收益
    public fun claim_investor_share(
        share: &mut InvestorShare,
        _ctx: &mut TxContext
    ): bool {
        // 验证投资人
        assert!(share.investor == tx_context::sender(_ctx), 1);
        
        // 验证是否已领取
        assert!(!share.claimed, 2);
        
        // 标记为已领取 (实际转账逻辑需要根据具体需求实现)
        share.claimed = true;
        
        true
    }

    // 创建创作者收益记录
    public fun create_creator_revenue(
        creator: address,
        creative_id: ID,
        revenue_amount: u64,
        ctx: &mut TxContext
    ): CreatorRevenue {
        CreatorRevenue {
            id: object::new(ctx),
            creator,
            creative_id,
            revenue_amount,
            claimed: false,
            timestamp: tx_context::epoch(ctx),
        }
    }

    // 创作者领取收益
    public fun claim_creator_revenue(
        revenue: &mut CreatorRevenue,
        _ctx: &mut TxContext
    ): bool {
        // 验证创作者
        assert!(revenue.creator == tx_context::sender(_ctx), 1);
        
        // 验证是否已领取
        assert!(!revenue.claimed, 2);
        
        // 标记为已领取 (实际转账逻辑需要根据具体需求实现)
        revenue.claimed = true;
        
        true
    }

    // 添加到平台收益池
    public fun add_to_platform_pool(
        pool: &mut PlatformPool,
        amount: u64,
        _ctx: &mut TxContext
    ) {
        pool.balance = pool.balance + amount;
        pool.total_revenue = pool.total_revenue + amount;
        pool.last_updated = tx_context::epoch(_ctx);
    }

    // 从平台收益池提取
    public fun withdraw_from_pool(
        pool: &mut PlatformPool,
        amount: u64,
        _ctx: &mut TxContext
    ): bool {
        // 验证余额
        assert!(pool.balance >= amount, 1);
        
        pool.balance = pool.balance - amount;
        pool.last_updated = tx_context::epoch(_ctx);
        
        true
    }

    // 获取收益池余额
    public fun get_pool_balance(pool: &PlatformPool): u64 {
        pool.balance
    }

    // 获取分配信息
    public fun get_distribution_info(
        distribution: &RevenueDistribution
    ): (ID, u64, u64, u64, u64, u64, bool) {
        (
            distribution.creative_id,
            distribution.total_revenue,
            distribution.platform_fee,
            distribution.investor_share,
            distribution.creator_share,
            distribution.user_rewards,
            distribution.is_distributed
        )
    }

    // 计算平台总收入
    public fun calculate_platform_revenue(
        global_stats: &GlobalStats
    ): u64 {
        global_stats.total_platform_revenue
    }

    // 获取全局统计信息
    public fun get_global_stats(
        stats: &GlobalStats
    ): (u64, u64, u64, u64, u64) {
        (
            stats.total_platform_revenue,
            stats.total_creative_revenue,
            stats.total_user_rewards,
            stats.total_investor_shares,
            stats.active_creatives
        )
    }

    // 更新活跃创意数量
    public fun update_active_creatives(
        stats: &mut GlobalStats,
        count: u64,
        _ctx: &mut TxContext
    ) {
        stats.active_creatives = count;
        stats.last_updated = tx_context::epoch(_ctx);
    }

    // 获取用户待领取返利
    // public fun get_pending_rewards(
    //     user_rewards: &vector<UserReward>,
    //     user: address
    // ): u64 {
    //     let mut total = 0;
    //     let mut i = 0;
        
    //     while (i < vector::length(&user_rewards)) {
    //         let reward = vector::borrow(&user_rewards, i);
    //         if (reward.user == user && !reward.claimed) {
    //             total = total + reward.reward_amount;
    //         };
    //         i = i + 1;
    //     };
        
    //     total
    // }

    // 获取创意总收益
    // public fun get_creative_total_revenue(
    //     distributions: vector<RevenueDistribution>,
    //     creative_id: ID
    // ): u64 {
    //     let mut total = 0;
    //     let i = 0;
        
    //     while (i < vector::length(&distributions)) {
    //         let dist = vector::borrow(&distributions, i);
    //         if (dist.creative_id == creative_id) {
    //             total = total + dist.total_revenue;
    //         };
    //         i = i + 1;
    //     };
        
    //     total
    // }

    // 检查分配是否完成
    public fun is_distribution_complete(
        distribution: &RevenueDistribution
    ): bool {
        distribution.is_distributed
    }

    // 获取分配时间戳
    public fun get_distribution_timestamp(
        distribution: &RevenueDistribution
    ): u64 {
        distribution.timestamp
    }
}
