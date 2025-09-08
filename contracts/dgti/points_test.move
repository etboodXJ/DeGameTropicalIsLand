#[test_only]
#[allow(unused_use,duplicate_alias,unused_const)]
module dgti::points_tests {
    use dgti::points::{Self, PointsBalance, Leaderboard, ExchangeConfig, LeaderboardEntry};
    use sui::test_scenario;
    use std::string;

    const TEST_USER: address = @0x1;
    const TEST_USER2: address = @0x2;
    const TEST_USERNAME: vector<u8> = b"test_user";
    const TEST_USERNAME2: vector<u8> = b"test_user2";

    #[test]
    fun test_create_balance() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let balance = points::create_balance(ctx);

        assert!(points::get_balance(&balance) == 0, 0);
        assert!(points::get_owner(&balance) == TEST_USER, 1);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_create_exchange_config() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let config = points::create_exchange_config(1000, ctx);

        assert!(points::get_exchange_rate(&config) == 1000, 0);
        assert!(points::is_exchange_enabled(&config) == true, 1);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_update_exchange_config() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut config = points::create_exchange_config(1000, ctx);
        
        points::update_exchange_config(&mut config, 2000, false, ctx);

        assert!(points::get_exchange_rate(&config) == 2000, 0);
        assert!(points::is_exchange_enabled(&config) == false, 1);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_reward_points() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut balance = points::create_balance(ctx);
        
        points::reward_points(&mut balance, 500, ctx);

        assert!(points::get_balance(&balance) == 500, 0);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_deduct_points() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut balance = points::create_balance(ctx);
        
        // 先奖励积分
        points::reward_points(&mut balance, 1000, ctx);
        
        // 扣除积分
        points::deduct_points(&mut balance, 300, ctx);

        assert!(points::get_balance(&balance) == 700, 0);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_transfer_points() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut from_balance = points::create_balance(ctx);
        let mut to_balance = points::create_balance(ctx);
        
        // 先奖励积分
        points::reward_points(&mut from_balance, 1000, ctx);
        
        // 转移积分
        points::transfer_points(&mut from_balance, &mut to_balance, 400, ctx);

        assert!(points::get_balance(&from_balance) == 600, 0);
        assert!(points::get_balance(&to_balance) == 400, 1);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_exchange_for_asset_success() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut balance = points::create_balance(ctx);
        
        // 先奖励积分
        points::reward_points(&mut balance, 1000, ctx);
        
        // 兑换资产
        let success = points::exchange_for_asset(&mut balance, 500, ctx);

        assert!(success == true, 0);
        assert!(points::get_balance(&balance) == 500, 1);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_exchange_for_asset_insufficient_balance() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut balance = points::create_balance(ctx);
        
        // 只奖励少量积分
        points::reward_points(&mut balance, 200, ctx);
        
        // 尝试兑换需要更多积分的资产
        let success = points::exchange_for_asset(&mut balance, 500, ctx);

        assert!(success == false, 0);
        assert!(points::get_balance(&balance) == 200, 1);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_create_leaderboard() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let leaderboard = points::create_leaderboard(ctx);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_update_leaderboard() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut leaderboard = points::create_leaderboard(ctx);
        
        points::update_leaderboard(
            &mut leaderboard,
            TEST_USER,
            string::utf8(TEST_USERNAME),
            1000,
            ctx
        );

        let user_points = points::get_user_points(&leaderboard, TEST_USER);
        assert!(user_points == 1000, 0);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_get_user_rank() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut leaderboard = points::create_leaderboard(ctx);
        
        // 添加多个用户
        points::update_leaderboard(
            &mut leaderboard,
            TEST_USER,
            string::utf8(TEST_USERNAME),
            1000,
            ctx
        );
        
        points::update_leaderboard(
            &mut leaderboard,
            TEST_USER2,
            string::utf8(TEST_USERNAME2),
            1500,
            ctx
        );

        let (rank, total) = points::get_user_rank(&leaderboard, TEST_USER);
        assert!(rank == 2, 0); // 应该是第二名
        assert!(total == 2, 1); // 总共两个用户

        let (rank2, _) = points::get_user_rank(&leaderboard, TEST_USER2);
        assert!(rank2 == 1, 2); // 应该是第一名

        test_scenario::end(scenario);
    }

    #[test]
    fun test_get_user_points_nonexistent() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let leaderboard = points::create_leaderboard(ctx);
        
        let points = points::get_user_points(&leaderboard, TEST_USER);
        assert!(points == 0, 0);

        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 2)] // 期望扣除积分失败
    fun test_deduct_points_insufficient_balance() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut balance = points::create_balance(ctx);
        
        // 尝试扣除比余额更多的积分
        points::deduct_points(&mut balance, 1000, ctx);

        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 1)] // 期望转移积分失败（所有者验证）
    fun test_transfer_points_unauthorized() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut from_balance = points::create_balance(ctx);
        let mut to_balance = points::create_balance(ctx);
        
        // 先奖励积分
        points::reward_points(&mut from_balance, 1000, ctx);
        
        // 尝试转移积分（应该失败，因为需要验证发送者）
        points::transfer_points(&mut from_balance, &mut to_balance, 400, ctx);

        test_scenario::end(scenario);
    }
}
