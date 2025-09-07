#[test_only]
module dgti::dgti_tests {
    use sui::test_scenario;
    use dgti::asset;
    use dgti::trade;
    use dgti::user;
    use dgti::governance;
    
    const TEST_USER: address = @0x1;
    const TEST_ASSET_NAME: vector<u8> = b"Test Asset";
    const TEST_ASSET_DESC: vector<u8> = b"Test Description";
    const TEST_ASSET_META: vector<u8> = b"Test Metadata";
    
    #[test]
    fun test_asset_creation() {
        let scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);
        
        // Create asset
        let asset = asset::create(
            std::string::utf8(TEST_ASSET_NAME),
            std::string::utf8(TEST_ASSET_DESC),
            std::string::utf8(TEST_ASSET_META),
            ctx
        );
        
        // Verify asset properties
          assert!(std::string::bytes(asset::get_name(&asset)) == TEST_ASSET_NAME, 0);
          assert!(std::string::bytes(asset::get_description(&asset)) == TEST_ASSET_DESC, 0);
        assert!(asset::get_owner(&asset) == TEST_USER, 0);
        
        test_scenario::end(scenario);
    }
    
    #[test]
    fun test_asset_transfer() {
        let scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);
        
        // Create asset
        let asset = asset::create(
            std::string::utf8(TEST_ASSET_NAME),
            std::string::utf8(TEST_ASSET_DESC),
            std::string::utf8(TEST_ASSET_META),
            ctx
        );
        
        // Transfer to new owner
        let new_owner = @0x2;
        asset::transfer(&mut asset, new_owner);
        assert!(asset::get_owner(&asset) == new_owner, 0);
        
        test_scenario::end(scenario);
    }
    
    #[test]
    fun test_trade_offer_creation() {
        let scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);
        
        // Create asset
        let asset = asset::create(
            std::string::utf8(TEST_ASSET_NAME),
            std::string::utf8(TEST_ASSET_DESC),
            std::string::utf8(TEST_ASSET_META),
            ctx
        );
        
        // Create trade offer
        let price = 1000;
        let expiration = 10000;
        let offer = trade::create_offer(&mut asset, price, expiration,ctx);
        
        // Verify offer properties
        assert!(trade::get_price(&offer) == price, 0);
        assert!(trade::get_expiration(&offer) == expiration, 0);
        assert!(trade::get_seller(&offer) == TEST_USER, 0);
        
        test_scenario::end(scenario);
    }
    
    #[test]
    fun test_user_profile_creation() {
        let scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);
        
        //const TEST_USERNAME: vector<u8> = b"test_user";
        
        // Create profile
        let profile = user::create(
            std::string::utf8(TEST_USERNAME),
            ctx
        );
        
        // Verify profile properties
        assert!(std::string::bytes(&profile.username) == TEST_USERNAME, 0);
        assert!(profile.reputation == 0, 0);
        assert!(profile.address == TEST_USER, 0);
        
        test_scenario::end(scenario);
    }
    
    #[test]
    fun test_user_reputation_update() {
        let scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);
        
        const TEST_USERNAME: vector<u8> = b"test_user";
        let REPUTATION_DELTA: u64 = 10;
        
        // Create profile
        let profile = user::create(
            std::string::utf8(TEST_USERNAME),
            ctx
        );
        
        // Update reputation
        user::update_reputation(&mut profile, REPUTATION_DELTA);
        assert!(profile.reputation == REPUTATION_DELTA, 0);
        
        test_scenario::end(scenario);
    }
    
    #[test]
    fun test_proposal_creation() {
        let scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);
        
        //const TEST_TITLE: vector<u8> = b"Test Proposal";
        const TEST_DESC: vector<u8> = b"Test Description";
        const DURATION: u64 = 86400; // 1 day in seconds
        
        // Create proposal
        let proposal = governance::create(
            std::string::utf8(TEST_TITLE),
            std::string::utf8(TEST_DESC),
            DURATION,
            ctx
        );
        
        // Verify proposal properties
        assert!(std::string::bytes(&proposal.title) == TEST_TITLE, 0);
        assert!(proposal.creator == TEST_USER, 0);
        assert!(proposal.votes_for == 0, 0);
        assert!(proposal.votes_against == 0, 0);
        
        test_scenario::end(scenario);
    }
    
    #[test]
    fun test_proposal_voting() {
        let scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);
        
        //const TEST_TITLE: vector<u8> = b"Test Proposal";
        const TEST_DESC: vector<u8> = b"Test Description";
        const DURATION: u64 = 86400;
        
        // Create proposal
        let proposal = governance::create(
            std::string::utf8(TEST_TITLE),
            std::string::utf8(TEST_DESC),
            DURATION,
            ctx
        );
        
        // Vote for proposal
        governance::vote(&mut proposal, true);
        assert!(proposal.votes_for == 1, 0);
        assert!(proposal.votes_against == 0, 0);
        
        // Vote against proposal
        governance::vote(&mut proposal, false);
        assert!(proposal.votes_for == 1, 0);
        assert!(proposal.votes_against == 1, 0);
        
        test_scenario::end(scenario);
    }
}