#[test_only]
#[allow(unused_use,duplicate_alias,unused_const)]
module dgti::trade_tests {
    use dgti::trade::{Self, TradeOffer, TradeRequest};
    use dgti::asset::{Self, Asset};
    use sui::test_scenario;
    use std::string;

    const TEST_USER: address = @0x1;
    const TEST_USER2: address = @0x2;
    const TEST_USER3: address = @0x3;
    const TEST_ASSET_NAME: vector<u8> = b"Test Asset";
    const TEST_ASSET_DESC: vector<u8> = b"Test Description";
    const TEST_ASSET_META: vector<u8> = b"Test Metadata";
    const TEST_PRICE: u64 = 1000;
    const TEST_PRICE_UPDATED: u64 = 1500;
    const TEST_EXPIRATION: u64 = 10000;
    const TEST_DURATION: u64 = 86400;

    #[test]
    fun test_create_offer() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        // 创建资产
        let mut asset = asset::create(
            string::utf8(TEST_ASSET_NAME),
            string::utf8(TEST_ASSET_DESC),
            string::utf8(TEST_ASSET_META),
            ctx
        );

        // 创建交易要约
        let offer = trade::create_offer(&mut asset, TEST_PRICE, TEST_EXPIRATION, ctx);

        // 验证要约属性
        assert!(trade::get_price(&offer) == TEST_PRICE, 0);
        assert!(trade::get_expiration(&offer) == TEST_EXPIRATION, 1);
        assert!(trade::get_seller(&offer) == TEST_USER, 2);
        assert!(trade::get_asset_id(&offer) == asset::id(&asset), 3);
        assert!(trade::is_active(&offer) == true, 4);

        // 清理
        trade::remove(offer);
        asset::remove(asset);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_update_offer_price() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        // 创建资产
        let mut asset = asset::create(
            string::utf8(TEST_ASSET_NAME),
            string::utf8(TEST_ASSET_DESC),
            string::utf8(TEST_ASSET_META),
            ctx
        );

        // 创建交易要约
        let mut offer = trade::create_offer(&mut asset, TEST_PRICE, TEST_EXPIRATION, ctx);

        // 更新价格
        trade::update_price(&mut offer, TEST_PRICE_UPDATED);
        assert!(trade::get_price(&offer) == TEST_PRICE_UPDATED, 0);

        // 清理
        trade::remove(offer);
        asset::remove(asset);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_cancel_offer() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        // 创建资产
        let mut asset = asset::create(
            string::utf8(TEST_ASSET_NAME),
            string::utf8(TEST_ASSET_DESC),
            string::utf8(TEST_ASSET_META),
            ctx
        );

        // 创建交易要约
        let mut offer = trade::create_offer(&mut asset, TEST_PRICE, TEST_EXPIRATION, ctx);

        // 取消要约
        trade::cancel_offer(&mut offer);
        assert!(trade::is_active(&offer) == false, 0);

        // 清理
        trade::remove(offer);
        asset::remove(asset);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_create_request() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        // 创建交易请求
        let request = trade::create_request(TEST_USER2, TEST_PRICE, TEST_DURATION, ctx);

        // 验证请求属性
        assert!(trade::get_requester(&request) == TEST_USER, 0);
        assert!(trade::get_requested_price(&request) == TEST_PRICE, 1);
        assert!(trade::get_expiration(&request) == tx_context::epoch(ctx) + TEST_DURATION, 2);
        assert!(trade::is_active(&request) == true, 3);

        // 清理
        trade::remove(request);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_update_request_price() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        // 创建交易请求
        let mut request = trade::create_request(TEST_USER2, TEST_PRICE, TEST_DURATION, ctx);

        // 更新价格
        trade::update_request_price(&mut request, TEST_PRICE_UPDATED);
        assert!(trade::get_requested_price(&request) == TEST_PRICE_UPDATED, 0);

        // 清理
        trade::remove(request);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_cancel_request() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        // 创建交易请求
        let mut request = trade::create_request(TEST_USER2, TEST_PRICE, TEST_DURATION, ctx);

        // 取消请求
        trade::cancel_request(&mut request);
        assert!(trade::is_active(&request) == false, 0);

        // 清理
        trade::remove(request);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_offer_expiration() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        // 创建资产
        let mut asset = asset::create(
            string::utf8(TEST_ASSET_NAME),
            string::utf8(TEST_ASSET_DESC),
            string::utf8(TEST_ASSET_META),
            ctx
        );

        // 创建交易要约
        let offer = trade::create_offer(&mut asset, TEST_PRICE, TEST_EXPIRATION, ctx);

        // 验证过期时间
        assert!(trade::get_expiration(&offer) == TEST_EXPIRATION, 0);

        // 清理
        trade::remove(offer);
        asset::remove(asset);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_request_expiration() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        // 创建交易请求
        let request = trade::create_request(TEST_USER2, TEST_PRICE, TEST_DURATION, ctx);

        // 验证过期时间
        assert!(trade::get_expiration(&request) == tx_context::epoch(ctx) + TEST_DURATION, 0);

        // 清理
        trade::remove(request);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_multiple_offers() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        // 创建多个资产
        let mut asset1 = asset::create(
            string::utf8(b"Asset 1"),
            string::utf8(b"Description 1"),
            string::utf8(b"Metadata 1"),
            ctx
        );

        let mut asset2 = asset::create(
            string::utf8(b"Asset 2"),
            string::utf8(b"Description 2"),
            string::utf8(b"Metadata 2"),
            ctx
        );

        // 创建多个交易要约
        let offer1 = trade::create_offer(&mut asset1, 1000, TEST_EXPIRATION, ctx);
        let offer2 = trade::create_offer(&mut asset2, 2000, TEST_EXPIRATION, ctx);

        // 验证要约属性
        assert!(trade::get_price(&offer1) == 1000, 0);
        assert!(trade::get_price(&offer2) == 2000, 1);
        assert!(trade::get_seller(&offer1) == TEST_USER, 2);
        assert!(trade::get_seller(&offer2) == TEST_USER, 3);

        // 清理
        trade::remove(offer1);
        trade::remove(offer2);
        asset::remove(asset1);
        asset::remove(asset2);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_zero_price_offer() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        // 创建资产
        let mut asset = asset::create(
            string::utf8(TEST_ASSET_NAME),
            string::utf8(TEST_ASSET_DESC),
            string::utf8(TEST_ASSET_META),
            ctx
        );

        // 创建零价格交易要约
        let offer = trade::create_offer(&mut asset, 0, TEST_EXPIRATION, ctx);

        // 验证零价格
        assert!(trade::get_price(&offer) == 0, 0);

        // 清理
        trade::remove(offer);
        asset::remove(asset);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_zero_price_request() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        // 创建零价格交易请求
        let request = trade::create_request(TEST_USER2, 0, TEST_DURATION, ctx);

        // 验证零价格
        assert!(trade::get_requested_price(&request) == 0, 0);

        // 清理
        trade::remove(request);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_offer_ownership() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        // 创建资产
        let mut asset = asset::create(
            string::utf8(TEST_ASSET_NAME),
            string::utf8(TEST_ASSET_DESC),
            string::utf8(TEST_ASSET_META),
            ctx
        );

        // 创建交易要约
        let offer = trade::create_offer(&mut asset, TEST_PRICE, TEST_EXPIRATION, ctx);

        // 验证要约所有者
        assert!(trade::get_seller(&offer) == TEST_USER, 0);

        // 清理
        trade::remove(offer);
        asset::remove(asset);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_request_ownership() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        // 创建交易请求
        let request = trade::create_request(TEST_USER2, TEST_PRICE, TEST_DURATION, ctx);

        // 验证请求所有者
        assert!(trade::get_requester(&request) == TEST_USER, 0);

        // 清理
        trade::remove(request);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_offer_status() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        // 创建资产
        let mut asset = asset::create(
            string::utf8(TEST_ASSET_NAME),
            string::utf8(TEST_ASSET_DESC),
            string::utf8(TEST_ASSET_META),
            ctx
        );

        // 创建交易要约
        let mut offer = trade::create_offer(&mut asset, TEST_PRICE, TEST_EXPIRATION, ctx);

        // 验证初始状态
        assert!(trade::is_active(&offer) == true, 0);

        // 取消要约
        trade::cancel_offer(&mut offer);
        assert!(trade::is_active(&offer) == false, 1);

        // 清理
        trade::remove(offer);
        asset::remove(asset);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_request_status() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        // 创建交易请求
        let mut request = trade::create_request(TEST_USER2, TEST_PRICE, TEST_DURATION, ctx);

        // 验证初始状态
        assert!(trade::is_active(&request) == true, 0);

        // 取消请求
        trade::cancel_request(&mut request);
        assert!(trade::is_active(&request) == false, 1);

        // 清理
        trade::remove(request);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_short_expiration() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        // 创建资产
        let mut asset = asset::create(
            string::utf8(TEST_ASSET_NAME),
            string::utf8(TEST_ASSET_DESC),
            string::utf8(TEST_ASSET_META),
            ctx
        );

        // 创建短过期时间的交易要约
        let short_expiration = 100; // 很短的过期时间
        let offer = trade::create_offer(&mut asset, TEST_PRICE, short_expiration, ctx);

        // 验证过期时间
        assert!(trade::get_expiration(&offer) == short_expiration, 0);

        // 清理
        trade::remove(offer);
        asset::remove(asset);

        test_scenario::end(scenario);
    }
}
