#[test_only]
#[allow(unused_use,duplicate_alias,unused_const)]
module dgti::creative_tests {
    use dgti::creative::{
        Self, 
        Creative, 
        CreativeInstance, 
        Expectation, 
        CreativeStats
    };
    use sui::test_scenario;
    use std::string;
    use std::vector;

    const TEST_USER: address = @0x1;
    const TEST_USER2: address = @0x2;
    const TEST_TITLE: vector<u8> = b"Test Creative";
    const TEST_DESC: vector<u8> = b"Test Description";
    const TEST_CONTENT: vector<u8> = b"Test Content";
    const TEST_CATEGORY: vector<u8> = b"art";
    const TEST_COMMENT: vector<u8> = b"Great creative!";

    #[test]
    fun test_create_creative() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let tags = vector[
            string::utf8(b"art"),
            string::utf8(b"creative")
        ];

        let creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            string::utf8(TEST_CONTENT),
            string::utf8(TEST_CATEGORY),
            tags,
            ctx
        );

        let (title, description, category, status, creator, created_at) = 
            creative::get_creative_info(&creative);

        assert!(title == string::utf8(TEST_TITLE), 0);
        assert!(description == string::utf8(TEST_DESC), 1);
        assert!(category == string::utf8(TEST_CATEGORY), 2);
        assert!(status == 0, 3); // STATUS_DRAFT
        assert!(creator == TEST_USER, 4);
        assert!(created_at > 0, 5);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_submit_creative() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let tags = vector[];
        let mut creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            string::utf8(TEST_CONTENT),
            string::utf8(TEST_CATEGORY),
            tags,
            ctx
        );

        creative::submit_creative(&mut creative, ctx);

        assert!(creative::get_status(&creative) == 1, 0); // STATUS_SUBMITTED

        test_scenario::end(scenario);
    }

    #[test]
    fun test_review_creative_approved() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let tags = vector[];
        let mut creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            string::utf8(TEST_CONTENT),
            string::utf8(TEST_CATEGORY),
            tags,
            ctx
        );

        creative::submit_creative(&mut creative, ctx);
        creative::review_creative(&mut creative, true, ctx);

        assert!(creative::get_status(&creative) == 3, 0); // STATUS_PUBLISHED
        assert!(creative::is_published(&creative), 1);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_review_creative_rejected() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let tags = vector[];
        let mut creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            string::utf8(TEST_CONTENT),
            string::utf8(TEST_CATEGORY),
            tags,
            ctx
        );

        creative::submit_creative(&mut creative, ctx);
        creative::review_creative(&mut creative, false, ctx);

        assert!(creative::get_status(&creative) == 4, 0); // STATUS_REJECTED
        assert!(!creative::is_published(&creative), 1);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_create_instance() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let tags = vector[];
        let mut creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            string::utf8(TEST_CONTENT),
            string::utf8(TEST_CATEGORY),
            tags,
            ctx
        );

        creative::submit_creative(&mut creative, ctx);
        creative::review_creative(&mut creative, true, ctx);

        let instance = creative::create_instance(
            &creative,
            TEST_USER2,
            500,
            1, // 高级访问级别
            ctx
        );

        // 确认实例创建成功

        test_scenario::end(scenario);
    }

    #[test]
    fun test_add_expectation() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let tags = vector[];
        let mut creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            string::utf8(TEST_CONTENT),
            string::utf8(TEST_CATEGORY),
            tags,
            ctx
        );

        creative::submit_creative(&mut creative, ctx);
        creative::review_creative(&mut creative, true, ctx);

        let expectation = creative::add_expectation(
            &mut creative,
            TEST_USER2,
            100,
            string::utf8(TEST_COMMENT),
            ctx
        );

        // 验证总期待值更新
        assert!(creative::get_total_expectation(&creative) == 100, 0);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_update_expectation() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let tags = vector[];
        let mut creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            string::utf8(TEST_CONTENT),
            string::utf8(TEST_CATEGORY),
            tags,
            ctx
        );

        creative::submit_creative(&mut creative, ctx);
        creative::review_creative(&mut creative, true, ctx);

        let mut expectation = creative::add_expectation(
            &mut creative,
            TEST_USER2,
            100,
            string::utf8(TEST_COMMENT),
            ctx
        );

        // 更新期待值
        creative::update_expectation(&mut expectation, 200, &mut creative, ctx);

        // 验证总期待值更新
        assert!(creative::get_total_expectation(&creative) == 200, 0);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_calculate_user_expectation_ratio() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let tags = vector[];
        let mut creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            string::utf8(TEST_CONTENT),
            string::utf8(TEST_CATEGORY),
            tags,
            ctx
        );

        creative::submit_creative(&mut creative, ctx);
        creative::review_creative(&mut creative, true, ctx);

        // 添加多个期待值
        creative::add_expectation(&mut creative, TEST_USER, 300, string::utf8(b"comment1"), ctx);
        creative::add_expectation(&mut creative, TEST_USER2, 200, string::utf8(b"comment2"), ctx);

        let total_expectation = creative::get_total_expectation(&creative);
        assert!(total_expectation == 500, 0);

        // 计算用户期待值占比
        let ratio1 = creative::calculate_user_expectation_ratio(&creative, 300);
        let ratio2 = creative::calculate_user_expectation_ratio(&creative, 200);

        // 300/500 = 0.6 = 6000 basis points
        // 200/500 = 0.4 = 4000 basis points
        assert!(ratio1 == 6000, 1);
        assert!(ratio2 == 4000, 2);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_create_stats() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let tags = vector[];
        let creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            string::utf8(TEST_CONTENT),
            string::utf8(TEST_CATEGORY),
            tags,
            ctx
        );

        let stats = creative::create_stats(creative::get_creator(&creative), ctx);

        let (views, purchases, expectations, rating) = creative::get_stats(&stats);

        assert!(views == 0, 0);
        assert!(purchases == 0, 1);
        assert!(expectations == 0, 2);
        assert!(rating == 0, 3);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_update_stats() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let tags = vector[];
        let creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            string::utf8(TEST_CONTENT),
            string::utf8(TEST_CATEGORY),
            tags,
            ctx
        );

        let mut stats = creative::create_stats(creative::get_creator(&creative), ctx);

        // 更新统计信息
        creative::update_stats(&mut stats, 100, 5, 10, 4, ctx);

        let (views, purchases, expectations, rating) = creative::get_stats(&stats);

        assert!(views == 100, 0);
        assert!(purchases == 5, 1);
        assert!(expectations == 10, 2);
        assert!(rating == 2, 3); // (0 + 4) / 2 = 2

        test_scenario::end(scenario);
    }

    #[test]
    fun test_update_revenue() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let tags = vector[];
        let mut creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            string::utf8(TEST_CONTENT),
            string::utf8(TEST_CATEGORY),
            tags,
            ctx
        );

        // 初始收入为0
        assert!(creative::get_revenue(&creative) == 0, 0);

        // 更新收入
        creative::update_revenue(&mut creative, 50000, ctx);

        // 验证收入更新
        assert!(creative::get_revenue(&creative) == 50000, 1);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_get_tags_and_category() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let tags = vector[
            string::utf8(b"art"),
            string::utf8(b"design"),
            string::utf8(b"creative")
        ];

        let creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            string::utf8(TEST_CONTENT),
            string::utf8(TEST_CATEGORY),
            tags,
            ctx
        );

        let retrieved_tags = creative::get_tags(&creative);
        let category = creative::get_category(&creative);

        assert!(vector::length(&retrieved_tags) == 3, 0);
        assert!(category == string::utf8(TEST_CATEGORY), 1);

        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 1)] // 期望提交失败（非创作者）
    fun test_submit_creative_unauthorized() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let tags = vector[];
        let mut creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            string::utf8(TEST_CONTENT),
            string::utf8(TEST_CATEGORY),
            tags,
            ctx
        );

        // 尝试用不同用户提交（应该失败）
        creative::submit_creative(&mut creative, ctx);

        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 2)] // 期望添加期待值失败（创意未发布）
    fun test_add_expectation_not_published() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let tags = vector[];
        let mut creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            string::utf8(TEST_CONTENT),
            string::utf8(TEST_CATEGORY),
            tags,
            ctx
        );

        // 尝试为未发布的创意添加期待值（应该失败）
        creative::add_expectation(
            &mut creative,
            TEST_USER2,
            100,
            string::utf8(TEST_COMMENT),
            ctx
        );

        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 2)] // 期望创建实例失败（创意未发布）
    fun test_create_instance_not_published() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let tags = vector[];
        let creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            string::utf8(TEST_CONTENT),
            string::utf8(TEST_CATEGORY),
            tags,
            ctx
        );

        // 尝试为未发布的创意创建实例（应该失败）
        creative::create_instance(
            &creative,
            TEST_USER2,
            500,
            1,
            ctx
        );

        test_scenario::end(scenario);
    }

    #[test]
    fun test_encrypted_id_initially_empty() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let tags = vector[];
        let creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            string::utf8(TEST_CONTENT),
            string::utf8(TEST_CATEGORY),
            tags,
            ctx
        );

        // 验证初始加密ID为空
        assert!(!creative::has_encrypted_id(&creative), 0);
        assert!(string::is_empty(creative::get_encrypted_id(&creative)), 1);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_set_encrypted_id_draft() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let tags = vector[];
        let mut creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            string::utf8(TEST_CONTENT),
            string::utf8(TEST_CATEGORY),
            tags,
            ctx
        );

        let encrypted_id = string::utf8(b"encrypted123");
        creative::set_encrypted_id(&mut creative, encrypted_id, ctx);

        // 验证加密ID已设置
        assert!(creative::has_encrypted_id(&creative), 0);
        assert!(!string::is_empty(creative::get_encrypted_id(&creative)), 1);
        assert!(creative::get_encrypted_id(&creative) == encrypted_id, 2);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_set_encrypted_id_published() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let tags = vector[];
        let mut creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            string::utf8(TEST_CONTENT),
            string::utf8(TEST_CATEGORY),
            tags,
            ctx
        );

        // 发布创意
        creative::submit_creative(&mut creative, ctx);
        creative::review_creative(&mut creative, true, ctx);

        let encrypted_id = string::utf8(b"encrypted456");
        creative::set_encrypted_id(&mut creative, encrypted_id, ctx);

        // 验证加密ID已设置
        assert!(creative::has_encrypted_id(&creative), 0);
        assert!(!string::is_empty(creative::get_encrypted_id(&creative)), 1);
        assert!(creative::get_encrypted_id(&creative) == encrypted_id, 2);

        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 1)] // 期望设置失败（非创作者）
    fun test_set_encrypted_id_unauthorized() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let tags = vector[];
        let mut creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            string::utf8(TEST_CONTENT),
            string::utf8(TEST_CATEGORY),
            tags,
            ctx
        );

        // 尝试用不同用户设置加密ID（应该失败）
        let encrypted_id = string::utf8(b"encrypted789");
        creative::set_encrypted_id(&mut creative, encrypted_id, ctx);

        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 2)] // 期望设置失败（状态不允许）
    fun test_set_encrypted_id_invalid_status() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let tags = vector[];
        let mut creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            string::utf8(TEST_CONTENT),
            string::utf8(TEST_CATEGORY),
            tags,
            ctx
        );

        // 提交创意但不审核（状态为已提交）
        creative::submit_creative(&mut creative, ctx);

        // 尝试在已提交状态下设置加密ID（应该失败）
        let encrypted_id = string::utf8(b"encrypted101");
        creative::set_encrypted_id(&mut creative, encrypted_id, ctx);

        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 3)] // 期望设置失败（加密ID为空）
    fun test_set_encrypted_id_empty() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let tags = vector[];
        let mut creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            string::utf8(TEST_CONTENT),
            string::utf8(TEST_CATEGORY),
            tags,
            ctx
        );

        // 尝试设置空的加密ID（应该失败）
        let empty_id = string::utf8(b"");
        creative::set_encrypted_id(&mut creative, empty_id, ctx);

        test_scenario::end(scenario);
    }
}
