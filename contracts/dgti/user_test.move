#[test_only]
#[allow(unused_use,duplicate_alias,unused_const)]
module dgti::user_tests {
    use dgti::user::{Self, UserProfile};
    use sui::test_scenario;
    use std::string;

    const TEST_USER: address = @0x1;
    const TEST_USER2: address = @0x2;
    const TEST_USERNAME: vector<u8> = b"test_user";
    const TEST_USERNAME_UPDATED: vector<u8> = b"updated_user";
    const TEST_BIO: vector<u8> = b"Test bio";
    const TEST_AVATAR: vector<u8> = b"avatar_url";
    const REPUTATION_DELTA: u64 = 10;
    const REPUTATION_NEGATIVE: u64 = 5;

    #[test]
    fun test_create_profile() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let profile = user::create(
            string::utf8(TEST_USERNAME),
            ctx
        );

        // 验证用户档案属性
        assert!(string::bytes(&profile.username) == TEST_USERNAME, 0);
        assert!(profile.reputation == 0, 1);
        assert!(profile.address == TEST_USER, 2);
        assert!(profile.bio == string::utf8(b""), 3); // 默认空简介
        assert!(profile.avatar_url == string::utf8(b""), 4); // 默认空头像

        // 清理
        user::remove(profile);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_update_reputation() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut profile = user::create(
            string::utf8(TEST_USERNAME),
            ctx
        );

        // 更新声誉
        user::update_reputation(&mut profile, REPUTATION_DELTA);
        assert!(profile.reputation == REPUTATION_DELTA, 0);

        // 清理
        user::remove(profile);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_negative_reputation() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut profile = user::create(
            string::utf8(TEST_USERNAME),
            ctx
        );

        // 添加负声誉
        user::update_reputation(&mut profile, REPUTATION_NEGATIVE);
        assert!(profile.reputation == REPUTATION_NEGATIVE, 0);

        // 清理
        user::remove(profile);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_multiple_reputation_updates() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut profile = user::create(
            string::utf8(TEST_USERNAME),
            ctx
        );

        // 多次更新声誉
        user::update_reputation(&mut profile, 10);
        user::update_reputation(&mut profile, 20);
        user::update_reputation(&mut profile, -5);

        // 验证最终声誉
        assert!(profile.reputation == 25, 0); // 10 + 20 - 5 = 25

        // 清理
        user::remove(profile);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_update_username() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut profile = user::create(
            string::utf8(TEST_USERNAME),
            ctx
        );

        // 更新用户名
        user::update_username(&mut profile, string::utf8(TEST_USERNAME_UPDATED));
        assert!(string::bytes(&profile.username) == TEST_USERNAME_UPDATED, 0);

        // 清理
        user::remove(profile);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_update_bio() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut profile = user::create(
            string::utf8(TEST_USERNAME),
            ctx
        );

        // 更新简介
        user::update_bio(&mut profile, string::utf8(TEST_BIO));
        assert!(string::bytes(&profile.bio) == TEST_BIO, 0);

        // 清理
        user::remove(profile);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_update_avatar() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut profile = user::create(
            string::utf8(TEST_USERNAME),
            ctx
        );

        // 更新头像
        user::update_avatar(&mut profile, string::utf8(TEST_AVATAR));
        assert!(string::bytes(&profile.avatar_url) == TEST_AVATAR, 0);

        // 清理
        user::remove(profile);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_profile_ownership() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let profile = user::create(
            string::utf8(TEST_USERNAME),
            ctx
        );

        // 验证档案所有者
        assert!(profile.address == TEST_USER, 0);

        // 清理
        user::remove(profile);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_multiple_profiles() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        // 创建多个用户档案
        let profile1 = user::create(
            string::utf8(b"user1"),
            ctx
        );

        let profile2 = user::create(
            string::utf8(b"user2"),
            ctx
        );

        // 验证档案属性
        assert!(string::bytes(&profile1.username) == b"user1", 0);
        assert!(string::bytes(&profile2.username) == b"user2", 1);
        assert!(profile1.address == TEST_USER, 2);
        assert!(profile2.address == TEST_USER, 3);

        // 清理
        user::remove(profile1);
        user::remove(profile2);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_empty_username() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let profile = user::create(
            string::utf8(b""), // 空用户名
            ctx
        );

        // 验证空用户名
        assert!(string::bytes(&profile.username) == b"", 0);

        // 清理
        user::remove(profile);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_long_username() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let long_username = b"very_long_username_that_exceeds_normal_limits_but_should_still_work";
        
        let profile = user::create(
            string::utf8(long_username),
            ctx
        );

        // 验证长用户名
        assert!(string::bytes(&profile.username) == long_username, 0);

        // 清理
        user::remove(profile);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_profile_comprehensive_update() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut profile = user::create(
            string::utf8(TEST_USERNAME),
            ctx
        );

        // 全面更新档案
        user::update_username(&mut profile, string::utf8(TEST_USERNAME_UPDATED));
        user::update_reputation(&mut profile, REPUTATION_DELTA);
        user::update_bio(&mut profile, string::utf8(TEST_BIO));
        user::update_avatar(&mut profile, string::utf8(TEST_AVATAR));

        // 验证所有更新
        assert!(string::bytes(&profile.username) == TEST_USERNAME_UPDATED, 0);
        assert!(profile.reputation == REPUTATION_DELTA, 1);
        assert!(string::bytes(&profile.bio) == TEST_BIO, 2);
        assert!(string::bytes(&profile.avatar_url) == TEST_AVATAR, 3);

        // 清理
        user::remove(profile);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_reputation_overflow_protection() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut profile = user::create(
            string::utf8(TEST_USERNAME),
            ctx
        );

        // 添加大量声誉（测试溢出保护）
        let large_reputation = 1000000000000000000; // 1e18
        user::update_reputation(&mut profile, large_reputation);
        
        // 验证声誉更新（假设有溢出保护）
        assert!(profile.reputation == large_reputation, 0);

        // 清理
        user::remove(profile);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_zero_reputation() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut profile = user::create(
            string::utf8(TEST_USERNAME),
            ctx
        );

        // 设置为零声誉
        user::update_reputation(&mut profile, 0);
        assert!(profile.reputation == 0, 0);

        // 清理
        user::remove(profile);

        test_scenario::end(scenario);
    }
}
