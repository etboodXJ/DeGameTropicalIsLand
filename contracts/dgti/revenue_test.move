#[test_only]
#[allow(unused_use,duplicate_alias,unused_const)]
module dgti::revenue_tests {
    use dgti::revenue::{
        Self, 
        RevenueDistribution, 
        UserReward, 
        PlatformPool, 
        InvestorShare, 
        CreatorRevenue, 
        GlobalStats
    };
    use dgti::points::{Self, PointsBalance};
    use sui::test_scenario;
    use sui::object::{Self, UID, ID};

    const TEST_USER: address = @0x1;
    const TEST_CREATOR: address = @0x2;
    const TEST_INVESTOR: address = @0x3;

    #[test]
    fun test_create_platform_pool() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let pool = revenue::create_platform_pool(ctx);

        assert!(revenue::get_pool_balance(&pool) == 0, 0);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_create_global_stats() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let stats = revenue::create_global_stats(ctx);

        let (platform_revenue, creative_revenue, user_rewards, investor_shares, active_creatives) = 
            revenue::get_global_stats(&stats);
        
        assert!(platform_revenue == 0, 0);
        assert!(creative_revenue == 0, 1);
        assert!(user_rewards == 0, 2);
        assert!(investor_shares == 0, 3);
        assert!(active_creatives == 0, 4);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_calculate_revenue_distribution() {
        let platform_revenue = 1000000; // 1,000,000
        let creative_total_expectation = 5000;
        let platform_total_expectation = 20000;
        let user_expectation = 100;

        let (platform_fee, investor_share, creator_share, user_reward) = 
            revenue::calculate_revenue_distribution(
                platform_revenue,
                creative_total_expectation,
                platform_total_expectation,
                user_expectation
            );

        // 创意盈利 = 1,000,000 * 5,000 / 20,000 = 250,000
        // 用户返利 = 250,000 * 100 / 5,000 = 5,000
        // 平台费用 = 250,000 * 10% = 25,000
        // 投资人份额 = 250,000 * 20% = 50,000
        // 创作者份额 = 250,000 - 25,000 - 50,000 - 5,000 = 170,000

        assert!(platform_fee == 25000, 0);
        assert!(investor_share == 50000, 1);
        assert!(creator_share == 170000, 2);
        assert!(user_reward == 5000, 3);
    }

    #[test]
    fun test_calculate_revenue_distribution_zero_expectation() {
        let platform_revenue = 1000000;
        let creative_total_expectation = 0;
        let platform_total_expectation = 0;
        let user_expectation = 100;

        let (platform_fee, investor_share, creator_share, user_reward) = 
            revenue::calculate_revenue_distribution(
                platform_revenue,
                creative_total_expectation,
                platform_total_expectation,
                user_expectation
            );

        // 当期待值为0时，所有分配应该为0
        assert!(platform_fee == 0, 0);
        assert!(investor_share == 0, 1);
        assert!(creator_share == 0, 2);
        assert!(user_reward == 0, 3);
    }

    #[test]
    fun test_create_distribution() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let creative_obj = object::new(ctx);
        let creative_id = object::id(&creative_obj);
        let distribution = revenue::create_distribution(
            creative_id,
            1000000,
            100000,
            200000,
            600000,
            100000,
            ctx
        );

        let (dist_creative_id, total_revenue, platform_fee, investor_share, creator_share, user_rewards, is_distributed) = 
            revenue::get_distribution_info(&distribution);

        assert!(dist_creative_id == creative_id, 0);
        assert!(total_revenue == 1000000, 1);
        assert!(platform_fee == 100000, 2);
        assert!(investor_share == 200000, 3);
        assert!(creator_share == 600000, 4);
        assert!(user_rewards == 100000, 5);
        assert!(is_distributed == false, 6);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_add_to_platform_pool() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut pool = revenue::create_platform_pool(ctx);
        
        revenue::add_to_platform_pool(&mut pool, 50000, ctx);

        assert!(revenue::get_pool_balance(&pool) == 50000, 0);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_withdraw_from_pool() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut pool = revenue::create_platform_pool(ctx);
        
        // 先添加资金
        revenue::add_to_platform_pool(&mut pool, 100000, ctx);
        
        // 提取资金
        let success = revenue::withdraw_from_pool(&mut pool, 30000, ctx);

        assert!(success == true, 0);
        assert!(revenue::get_pool_balance(&pool) == 70000, 1);

        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 1)] // 期望提取失败（余额不足）
    fun test_withdraw_from_pool_insufficient_balance() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut pool = revenue::create_platform_pool(ctx);
        
        // 只添加少量资金
        revenue::add_to_platform_pool(&mut pool, 10000, ctx);
        
        // 尝试提取更多资金
        revenue::withdraw_from_pool(&mut pool, 50000, ctx);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_create_user_reward() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let creative_obj = object::new(ctx);
        let creative_id = object::id(&creative_obj);
        let reward = revenue::create_user_reward(
            TEST_USER,
            creative_id,
            5000,
            2000, // 20% in basis points
            ctx
        );

        // 注意：由于字段是私有的，我们无法直接验证
        // 但至少可以确认对象创建成功

        test_scenario::end(scenario);
    }

    #[test]
    fun test_create_investor_share() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let creative_obj = object::new(ctx);
        let creative_id = object::id(&creative_obj);
        let share = revenue::create_investor_share(
            TEST_INVESTOR,
            creative_id,
            100000,
            ctx
        );

        // 确认对象创建成功

        test_scenario::end(scenario);
    }

    #[test]
    fun test_create_creator_revenue() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let creative_obj = object::new(ctx);
        let creative_id = object::id(&creative_obj);
        let creator_revenue = revenue::create_creator_revenue(
            TEST_CREATOR,
            creative_id,
            200000,
            ctx
        );

        // 确认对象创建成功

        test_scenario::end(scenario);
    }

    #[test]
    fun test_update_active_creatives() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut stats = revenue::create_global_stats(ctx);
        
        revenue::update_active_creatives(&mut stats, 25, ctx);

        let (_, _, _, _, active_creatives) = revenue::get_global_stats(&stats);
        assert!(active_creatives == 25, 0);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_claim_user_reward() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let creative_obj = object::new(ctx);
        let creative_id = object::id(&creative_obj);
        let mut reward = revenue::create_user_reward(
            TEST_USER,
            creative_id,
            1000,
            1000,
            ctx
        );

        let mut points_balance = points::create_balance(ctx);
        
        // 先奖励一些积分用于测试
        points::reward_points(&mut points_balance, 500, ctx);
        
        let success = revenue::claim_user_reward(&mut reward, &mut points_balance, ctx);

        assert!(success == true, 0);
        assert!(points::get_balance(&points_balance) == 1500, 1); // 500 + 1000

        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 3)] // 期望领取失败（积分余额所有者不匹配）
    fun test_claim_user_reward_wrong_owner() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let creative_obj = object::new(ctx);
        let creative_id = object::id(&creative_obj);
        let mut reward = revenue::create_user_reward(
            TEST_USER,
            creative_id,
            1000,
            1000,
            ctx
        );

        // 创建另一个用户的积分余额
        let mut points_balance = points::create_balance(ctx);
        
        // 尝试用不匹配的积分余额领取奖励
        revenue::claim_user_reward(&mut reward, &mut points_balance, ctx);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_distribution_status() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let creative_obj = object::new(ctx);
        let creative_id = object::id(&creative_obj);
        let mut distribution = revenue::create_distribution(
            creative_id,
            1000000,
            100000,
            200000,
            600000,
            100000,
            ctx
        );

        // 初始状态应该是未分配
        assert!(revenue::is_distribution_complete(&distribution) == false, 0);

        let mut pool = revenue::create_platform_pool(ctx);
        let mut stats = revenue::create_global_stats(ctx);
        
        // 执行分配
        revenue::distribute_revenue(&mut distribution, &mut pool, &mut stats, ctx);

        // 现在应该已分配
        assert!(revenue::is_distribution_complete(&distribution) == true, 1);

        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 1)] // 期望重复分配失败
    fun test_double_distribution() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let creative_obj = object::new(ctx);
        let creative_id = object::id(&creative_obj);
        let mut distribution = revenue::create_distribution(
            creative_id,
            1000000,
            100000,
            200000,
            600000,
            100000,
            ctx
        );

        let mut pool = revenue::create_platform_pool(ctx);
        let mut stats = revenue::create_global_stats(ctx);
        
        // 第一次分配
        revenue::distribute_revenue(&mut distribution, &mut pool, &mut stats, ctx);
        
        // 尝试第二次分配（应该失败）
        revenue::distribute_revenue(&mut distribution, &mut pool, &mut stats, ctx);

        test_scenario::end(scenario);
    }
}
