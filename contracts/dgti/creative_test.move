#[test_only]
#[allow(unused_use,duplicate_alias,unused_const)]
module dgti::creative_tests {
    use dgti::creative::{
        Self, 
        Creative, 
        CreativeDetail, 
        CreativeInstance, 
        Expectation, 
        CreativeStats,
        SharedCreatives,
        CreativeType,
        Status
    };
    use sui::test_scenario;
    use std::string;
    use sui::object::{Self, UID, ID};

    const TEST_USER: address = @0x1;
    const TEST_USER2: address = @0x2;
    const TEST_USER3: address = @0x3;
    const TEST_TITLE: vector<u8> = b"Test Creative";
    const TEST_DESCRIPTION: vector<u8> = b"Test Description";
    const TEST_CONTENT: vector<u8> = b"Test Content";
    const TEST_CATEGORY: vector<u8> = b"Test Category";
    const TEST_TAG1: vector<u8> = b"tag1";
    const TEST_TAG2: vector<u8> = b"tag2";
    const TEST_ENCRYPTED_ID: vector<u8> = b"encrypted123";
    const EXPECTATION_VALUE: u64 = 500;
    const EXPECTATION_VALUE_UPDATED: u64 = 750;
    const EXPECTATION_COMMENT: vector<u8> = b"Great idea!";

    // 辅助函数：创建标签向量
    fun create_tags(): vector<String> {
        let tags = vector::empty<String>();
        vector::push_back(&mut tags, string::utf8(TEST_TAG1));
        vector::push_back(&mut tags, string::utf8(TEST_TAG2));
        tags
    }

    #[test]
    fun test_create_creative() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESCRIPTION),
            string::utf8(TEST_CONTENT),
            CreativeType::ImageText,
            string::utf8(TEST_CATEGORY),
            create_tags(),
            ctx
        );

        // 验证创意属性
        let (title, desc, cat, status, creator, created_at) = creative::get_creative_info(&creative);
        assert!(string::bytes(&title) == TEST_TITLE, 0);
        assert!(string::bytes(&desc) == TEST_DESCRIPTION, 1);
        assert!(string::bytes(&cat) == TEST_CATEGORY, 2);
        assert!(status == 0, 3); // STATUS_DRAFT
        assert!(creator == TEST_USER, 4);
        assert!(created_at > 0, 5);
        assert!(creative::get_total_expectation(&creative) == 0, 6);
        assert!(creative::get_revenue(&creative) == 0, 7);

        // 清理
        creative::delete_creative(creative, ctx);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_submit_creative() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESCRIPTION),
            string::utf8(TEST_CONTENT),
            CreativeType::ImageText,
            string::utf8(TEST_CATEGORY),
            create_tags(),
            ctx
        );

        // 提交创意
        creative::submit_creative(&mut creative, ctx);
        assert!(creative::get_status(&creative) == 1, 0); // STATUS_SUBMITTED

        // 清理
        creative::delete_creative(creative, ctx);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_update_creative() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESCRIPTION),
            string::utf8(TEST_CONTENT),
            CreativeType::ImageText,
            string::utf8(TEST_CATEGORY),
            create_tags(),
            ctx
        );

        // 更新创意信息
        let new_title = string::utf8(b"Updated Title");
        let new_tags = vector::singleton<String>(string::utf8(b"new_tag"));
        
        creative::update_creative(
            &mut creative,
            option::some(new_title),
            option::none<String>(),
            option::none<String>(),
            option::none<String>(),
            option::some(new_tags),
            ctx
        );

        // 验证更新
        let (title, _, _, _, _, _) = creative::get_creative_info(&creative);
        assert!(string::bytes(&title) == b"Updated Title", 0);

        // 清理
        creative::delete_creative(creative, ctx);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_review_creative_approved() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESCRIPTION),
            string::utf8(TEST_CONTENT),
            CreativeType::ImageText,
            string::utf8(TEST_CATEGORY),
            create_tags(),
            ctx
        );

        // 先提交
        creative::submit_creative(&mut creative, ctx);
        
        // 审核通过
        creative::review_creative(&mut creative, true, ctx);
        assert!(creative::get_status(&creative) == 3, 0); // STATUS_PUBLISHED

        // 清理
        creative::delete_creative(creative, ctx);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_review_creative_rejected() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESCRIPTION),
            string::utf8(TEST_CONTENT),
            CreativeType::ImageText,
            string::utf8(TEST_CATEGORY),
            create_tags(),
            ctx
        );

        // 先提交
        creative::submit_creative(&mut creative, ctx);
        
        // 审核拒绝
        creative::review_creative(&mut creative, false, ctx);
        assert!(creative::get_status(&creative) == 4, 0); // STATUS_REJECTED

        // 清理
        creative::delete_creative(creative, ctx);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_create_instance() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESCRIPTION),
            string::utf8(TEST_CONTENT),
            CreativeType::ImageText,
            string::utf8(TEST_CATEGORY),
            create_tags(),
            ctx
        );

        // 先发布创意
        creative::review_creative(&mut creative, true, ctx);

        // 创建实例
        let instance = creative::create_instance(
            &creative,
            TEST_USER2,
            EXPECTATION_VALUE,
            1, // 高级访问级别
            ctx
        );

        // 验证实例属性
        assert!(creative::get_instance_owner(&instance) == TEST_USER2, 0);
        assert!(creative::get_instance_expectation_value(&instance) == EXPECTATION_VALUE, 1);
        assert!(creative::get_instance_access_level(&instance) == 1, 2);

        // 清理
        creative::delete_creative(creative, ctx);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_add_expectation() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESCRIPTION),
            string::utf8(TEST_CONTENT),
            CreativeType::ImageText,
            string::utf8(TEST_CATEGORY),
            create_tags(),
            ctx
        );

        // 先发布创意
        creative::review_creative(&mut creative, true, ctx);

        // 添加期待值
        let expectation = creative::add_expectation(
            &mut creative,
            TEST_USER2,
            EXPECTATION_VALUE,
            string::utf8(EXPECTATION_COMMENT),
            ctx
        );

        // 验证期待值
        assert!(creative::get_total_expectation(&creative) == EXPECTATION_VALUE, 0);
        assert!(expectation::get_value(&expectation) == EXPECTATION_VALUE, 1);

        // 清理
        creative::delete_creative(creative, ctx);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_update_expectation() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESCRIPTION),
            string::utf8(TEST_CONTENT),
            CreativeType::ImageText,
            string::utf8(TEST_CATEGORY),
            create_tags(),
            ctx
        );

        // 先发布创意
        creative::review_creative(&mut creative, true, ctx);

        // 添加期待值
        let mut expectation = creative::add_expectation(
            &mut creative,
            TEST_USER2,
            EXPECTATION_VALUE,
            string::utf8(EXPECTATION_COMMENT),
            ctx
        );

        // 更新期待值
        creative::update_expectation(
            &mut expectation,
            EXPECTATION_VALUE_UPDATED,
            &mut creative,
            ctx
        );

        // 验证更新
        assert!(creative::get_total_expectation(&creative) == EXPECTATION_VALUE_UPDATED, 0);
        assert!(expectation::get_value(&expectation) == EXPECTATION_VALUE_UPDATED, 1);

        // 清理
        creative::delete_creative(creative, ctx);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_calculate_user_expectation_ratio() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESCRIPTION),
            string::utf8(TEST_CONTENT),
            CreativeType::ImageText,
            string::utf8(TEST_CATEGORY),
            create_tags(),
            ctx
        );

        // 先发布创意
        creative::review_creative(&mut creative, true, ctx);

        // 添加多个期待值
        creative::add_expectation(
            &mut creative,
            TEST_USER2,
            1000,
            string::utf8(b"Comment 1"),
            ctx
        );
        creative::add_expectation(
            &mut creative,
            TEST_USER3,
            2000,
            string::utf8(b"Comment 2"),
            ctx
        );

        // 计算用户期待值占比
        let ratio1 = creative::calculate_user_expectation_ratio(&creative, 1000);
        let ratio2 = creative::calculate_user_expectation_ratio(&creative, 2000);
        
        // 验证占比计算 (basis points)
        assert!(ratio1 == 3333, 0); // 1000/3000 * 10000 = 3333
        assert!(ratio2 == 6666, 1); // 2000/3000 * 10000 = 6666

        // 清理
        creative::delete_creative(creative, ctx);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_set_encrypted_id() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESCRIPTION),
            string::utf8(TEST_CONTENT),
            CreativeType::ImageText,
            string::utf8(TEST_CATEGORY),
            create_tags(),
            ctx
        );

        // 设置加密ID
        creative::set_encrypted_id(
            &mut creative,
            string::utf8(TEST_ENCRYPTED_ID),
            ctx
        );

        // 验证加密ID
        assert!(string::bytes(creative::get_encrypted_id(&creative)) == TEST_ENCRYPTED_ID, 0);
        assert!(creative::has_encrypted_id(&creative) == true, 1);

        // 清理
        creative::delete_creative(creative, ctx);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_create_stats() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESCRIPTION),
            string::utf8(TEST_CONTENT),
            CreativeType::ImageText,
            string::utf8(TEST_CATEGORY),
            create_tags(),
            ctx
        );

        let creative_id = object::id(&creative);
        let stats = creative::create_stats(creative_id, ctx);

        // 验证统计信息
        let (views, purchases, expectations, rating) = creative::get_stats(&stats);
        assert!(views == 0, 0);
        assert!(purchases == 0, 1);
        assert!(expectations == 0, 2);
        assert!(rating == 0, 3);

        // 清理
        creative::delete_creative(creative, ctx);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_update_stats() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESCRIPTION),
            string::utf8(TEST_CONTENT),
            CreativeType::ImageText,
            string::utf8(TEST_CATEGORY),
            create_tags(),
            ctx
        );

        let creative_id = object::id(&creative);
        let mut stats = creative::create_stats(creative_id, ctx);

        // 更新统计信息
        creative::update_stats(
            &mut stats,
            100,  // views
            10,   // purchases
            50,   // expectations
            5,    // rating
            ctx
        );

        // 验证更新
        let (views, purchases, expectations, rating) = creative::get_stats(&stats);
        assert!(views == 100, 0);
        assert!(purchases == 10, 1);
        assert!(expectations == 50, 2);
        assert!(rating == 2, 3); // (0 + 5) / 2 = 2

        // 清理
        creative::delete_creative(creative, ctx);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_create_shared_creatives() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let shared = creative::create_shared_creatives(ctx);

        // 验证共享对象
        assert!(creative::get_creative_count(&shared) == 0, 0);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_add_creative_to_shared() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut shared = creative::create_shared_creatives(ctx);
        let creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESCRIPTION),
            string::utf8(TEST_CONTENT),
            CreativeType::ImageText,
            string::utf8(TEST_CATEGORY),
            create_tags(),
            ctx
        );

        let creative_id = object::id(&creative);
        
        // 添加到共享对象
        creative::add_creative_to_shared(&mut shared, creative_id, ctx);

        // 验证添加
        assert!(creative::get_creative_count(&shared) == 1, 0);
        assert!(creative::is_creative_in_shared(&shared, creative_id) == true, 1);

        // 清理
        creative::delete_creative(creative, ctx);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_creative_type_conversion() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        // 测试创意类型转换
        let image_text = CreativeType::ImageText;
        let video = CreativeType::Video;
        let game = CreativeType::Game;

        assert!(string::bytes(&creative::creative_type_to_string(&image_text)) == b"图文创意", 0);
        assert!(string::bytes(&creative::creative_type_to_string(&video)) == b"视频创意", 1);
        assert!(string::bytes(&creative::creative_type_to_string(&game)) == b"游戏", 2);

        // 测试字符串到创意类型转换
        let str_image = string::utf8(b"图文创意");
        let str_game = string::utf8(b"游戏");
        
        assert!(creative::string_to_creative_type(&str_image) == CreativeType::ImageText, 3);
        assert!(creative::string_to_creative_type(&str_game) == CreativeType::Game, 4);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_multiple_expectations() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESCRIPTION),
            string::utf8(TEST_CONTENT),
            CreativeType::ImageText,
            string::utf8(TEST_CATEGORY),
            create_tags(),
            ctx
        );

        // 先发布创意
        creative::review_creative(&mut creative, true, ctx);

        // 添加多个期待值
        creative::add_expectation(
            &mut creative,
            TEST_USER2,
            1000,
            string::utf8(b"Comment 1"),
            ctx
        );
        creative::add_expectation(
            &mut creative,
            TEST_USER3,
            2000,
            string::utf8(b"Comment 2"),
            ctx
        );
        creative::add_expectation(
            &mut creative,
            TEST_USER,
            500,
            string::utf8(b"Comment 3"),
            ctx
        );

        // 验证总期待值
        assert!(creative::get_total_expectation(&creative) == 3500, 0);

        // 清理
        creative::delete_creative(creative, ctx);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_creative_lifecycle() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESCRIPTION),
            string::utf8(TEST_CONTENT),
            CreativeType::ImageText,
            string::utf8(TEST_CATEGORY),
            create_tags(),
            ctx
        );

        // 验证初始状态
        assert!(creative::get_status(&creative) == 0, 0); // STATUS_DRAFT
        assert!(creative::is_published(&creative) == false, 1);

        // 提交创意
        creative::submit_creative(&mut creative, ctx);
        assert!(creative::get_status(&creative) == 1, 2); // STATUS_SUBMITTED

        // 审核通过
        creative::review_creative(&mut creative, true, ctx);
        assert!(creative::get_status(&creative) == 3, 3); // STATUS_PUBLISHED
        assert!(creative::is_published(&creative) == true, 4);

        // 更新收入
        creative::update_revenue(&mut creative, 1000, ctx);
        assert!(creative::get_revenue(&creative) == 1000, 5);

        // 清理
        creative::delete_creative(creative, ctx);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_edge_cases() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut creative = creative::create_creative(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESCRIPTION),
            string::utf8(TEST_CONTENT),
            CreativeType::ImageText,
            string::utf8(TEST_CATEGORY),
            create_tags(),
            ctx
        );

        // 测试零期待值占比
        let ratio = creative::calculate_user_expectation_ratio(&creative, 100);
        assert!(ratio == 0, 0); // 当总期待值为0时，占比应为0

        // 测试最大期待值
        creative::add_expectation(
            &mut creative,
            TEST_USER2,
            1000,
            string::utf8(b"Max expectation"),
            ctx
        );

        // 测试空标签
        let empty_tags = vector::empty<String>();
        creative::update_creative(
            &mut creative,
            option::none<String>(),
            option::none<String>(),
            option::none<String>(),
            option::none<String>(),
            option::some(empty_tags),
            ctx
        );
        let tags = creative::get_tags(&creative);
        assert!(vector::length(&tags) == 0, 1);

        // 清理
        creative::delete_creative(creative, ctx);

        test_scenario::end(scenario);
    }
}
