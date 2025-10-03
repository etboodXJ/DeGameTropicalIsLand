#[test_only]
#[allow(unused_use,duplicate_alias,unused_const)]
module dgti::asset_tests {
    use dgti::asset::{Self, Asset};
    use sui::test_scenario;
    use std::string;

    const TEST_USER: address = @0x1;
    const TEST_USER2: address = @0x2;
    const TEST_ASSET_NAME: vector<u8> = b"Test Asset";
    const TEST_ASSET_DESC: vector<u8> = b"Test Description";
    const TEST_ASSET_META: vector<u8> = b"Test Metadata";
    const NEW_ASSET_NAME: vector<u8> = b"Updated Asset Name";
    const NEW_ASSET_META: vector<u8> = b"Updated Metadata";

    #[test]
    fun test_create_asset() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let asset = asset::create(
            string::utf8(TEST_ASSET_NAME),
            string::utf8(TEST_ASSET_DESC),
            string::utf8(TEST_ASSET_META),
            ctx
        );

        // 验证资产属性
        assert!(string::bytes(asset::get_name(&asset)) == TEST_ASSET_NAME, 0);
        assert!(string::bytes(asset::get_description(&asset)) == TEST_ASSET_DESC, 0);
        assert!(asset::get_owner(&asset) == TEST_USER, 0);

        // 清理
        asset::remove(asset);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_asset_transfer() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut asset = asset::create(
            string::utf8(TEST_ASSET_NAME),
            string::utf8(TEST_ASSET_DESC),
            string::utf8(TEST_ASSET_META),
            ctx
        );

        // 转移给新所有者
        let new_owner = TEST_USER2;
        asset::transfer(&mut asset, new_owner);
        assert!(asset::get_owner(&asset) == new_owner, 0);

        // 清理
        asset::remove(asset);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_update_metadata() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut asset = asset::create(
            string::utf8(TEST_ASSET_NAME),
            string::utf8(TEST_ASSET_DESC),
            string::utf8(TEST_ASSET_META),
            ctx
        );

        // 更新元数据
        let new_metadata = string::utf8(NEW_ASSET_META);
        asset::update_metadata(&mut asset, new_metadata);

        // 验证元数据已更新
        assert!(string::bytes(asset::get_description(&asset)) == NEW_ASSET_META, 0);

        // 清理
        asset::remove(asset);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_asset_ownership() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let asset = asset::create(
            string::utf8(TEST_ASSET_NAME),
            string::utf8(TEST_ASSET_DESC),
            string::utf8(TEST_ASSET_META),
            ctx
        );

        // 验证初始所有者
        assert!(asset::get_owner(&asset) == TEST_USER, 0);

        // 清理
        asset::remove(asset);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_asset_name_and_description() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let asset = asset::create(
            string::utf8(TEST_ASSET_NAME),
            string::utf8(TEST_ASSET_DESC),
            string::utf8(TEST_ASSET_META),
            ctx
        );

        // 验证名称和描述
        assert!(string::bytes(asset::get_name(&asset)) == TEST_ASSET_NAME, 0);
        assert!(string::bytes(asset::get_description(&asset)) == TEST_ASSET_DESC, 0);

        // 清理
        asset::remove(asset);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_multiple_assets() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        // 创建多个资产
        let asset1 = asset::create(
            string::utf8(b"Asset 1"),
            string::utf8(b"Description 1"),
            string::utf8(b"Metadata 1"),
            ctx
        );

        let asset2 = asset::create(
            string::utf8(b"Asset 2"),
            string::utf8(b"Description 2"),
            string::utf8(b"Metadata 2"),
            ctx
        );

        // 验证资产属性
        assert!(string::bytes(asset::get_name(&asset1)) == b"Asset 1", 0);
        assert!(string::bytes(asset::get_name(&asset2)) == b"Asset 2", 1);
        assert!(asset::get_owner(&asset1) == TEST_USER, 2);
        assert!(asset::get_owner(&asset2) == TEST_USER, 3);

        // 清理
        asset::remove(asset1);
        asset::remove(asset2);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_asset_transfer_to_self() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut asset = asset::create(
            string::utf8(TEST_ASSET_NAME),
            string::utf8(TEST_ASSET_DESC),
            string::utf8(TEST_ASSET_META),
            ctx
        );

        // 转移给自己
        asset::transfer(&mut asset, TEST_USER);
        assert!(asset::get_owner(&asset) == TEST_USER, 0);

        // 清理
        asset::remove(asset);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_empty_metadata() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let asset = asset::create(
            string::utf8(TEST_ASSET_NAME),
            string::utf8(TEST_ASSET_DESC),
            string::utf8(b""), // 空元数据
            ctx
        );

        // 验证空元数据
        assert!(string::bytes(asset::get_description(&asset)) == b"", 0);

        // 清理
        asset::remove(asset);

        test_scenario::end(scenario);
    }
}
