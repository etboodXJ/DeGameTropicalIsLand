#[test_only]
#[allow(unused_use,duplicate_alias,unused_const)]
module dgti::governance_tests {
    use dgti::governance::{Self, Proposal, Vote};
    use sui::test_scenario;
    use std::string;

    const TEST_USER: address = @0x1;
    const TEST_USER2: address = @0x2;
    const TEST_USER3: address = @0x3;
    const TEST_TITLE: vector<u8> = b"Test Proposal";
    const TEST_DESC: vector<u8> = b"Test Description";
    const TEST_DESC_UPDATED: vector<u8> = b"Updated Description";
    const DURATION: u64 = 86400; // 1 day in seconds
    const VOTE_WEIGHT: u64 = 100;

    #[test]
    fun test_create_proposal() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let proposal = governance::create(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            DURATION,
            ctx
        );

        // 验证提案属性
        assert!(string::bytes(&proposal.title) == TEST_TITLE, 0);
        assert!(string::bytes(&proposal.description) == TEST_DESC, 1);
        assert!(proposal.creator == TEST_USER, 2);
        assert!(proposal.votes_for == 0, 3);
        assert!(proposal.votes_against == 0, 4);
        assert!(proposal.total_weight == 0, 5);
        assert!(proposal.is_active == true, 6);
        assert!(proposal.expiration == tx_context::epoch(ctx) + DURATION, 7);

        // 清理
        governance::remove(proposal);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_vote_for_proposal() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut proposal = governance::create(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            DURATION,
            ctx
        );

        // 投票支持
        governance::vote(&mut proposal, true, VOTE_WEIGHT);
        assert!(proposal.votes_for == 1, 0);
        assert!(proposal.votes_against == 0, 1);
        assert!(proposal.total_weight == VOTE_WEIGHT, 2);

        // 清理
        governance::remove(proposal);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_vote_against_proposal() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut proposal = governance::create(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            DURATION,
            ctx
        );

        // 投票反对
        governance::vote(&mut proposal, false, VOTE_WEIGHT);
        assert!(proposal.votes_for == 0, 0);
        assert!(proposal.votes_against == 1, 1);
        assert!(proposal.total_weight == VOTE_WEIGHT, 2);

        // 清理
        governance::remove(proposal);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_multiple_votes() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut proposal = governance::create(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            DURATION,
            ctx
        );

        // 多个用户投票
        governance::vote(&mut proposal, true, VOTE_WEIGHT);
        governance::vote(&mut proposal, false, VOTE_WEIGHT);
        governance::vote(&mut proposal, true, VOTE_WEIGHT);

        // 验证投票结果
        assert!(proposal.votes_for == 2, 0);
        assert!(proposal.votes_against == 1, 1);
        assert!(proposal.total_weight == VOTE_WEIGHT * 3, 2);

        // 清理
        governance::remove(proposal);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_proposal_expiration() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut proposal = governance::create(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            DURATION,
            ctx
        );

        // 验证过期时间
        assert!(proposal.expiration == tx_context::epoch(ctx) + DURATION, 0);

        // 清理
        governance::remove(proposal);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_update_proposal_description() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut proposal = governance::create(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            DURATION,
            ctx
        );

        // 更新描述
        governance::update_description(&mut proposal, string::utf8(TEST_DESC_UPDATED));
        assert!(string::bytes(&proposal.description) == TEST_DESC_UPDATED, 0);

        // 清理
        governance::remove(proposal);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_proposal_creator_only() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut proposal = governance::create(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            DURATION,
            ctx
        );

        // 只有创建者可以更新描述
        governance::update_description(&mut proposal, string::utf8(TEST_DESC_UPDATED));
        assert!(string::bytes(&proposal.description) == TEST_DESC_UPDATED, 0);

        // 清理
        governance::remove(proposal);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_vote_weight_accumulation() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut proposal = governance::create(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            DURATION,
            ctx
        );

        // 不同权重的投票
        governance::vote(&mut proposal, true, 100);
        governance::vote(&mut proposal, true, 200);
        governance::vote(&mut proposal, false, 50);

        // 验证权重累积
        assert!(proposal.votes_for == 2, 0);
        assert!(proposal.votes_against == 1, 1);
        assert!(proposal.total_weight == 350, 2);

        // 清理
        governance::remove(proposal);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_proposal_status() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut proposal = governance::create(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            DURATION,
            ctx
        );

        // 验证初始状态
        assert!(proposal.is_active == true, 0);

        // 清理
        governance::remove(proposal);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_multiple_proposals() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        // 创建多个提案
        let proposal1 = governance::create(
            string::utf8(b"Proposal 1"),
            string::utf8(b"Description 1"),
            DURATION,
            ctx
        );

        let proposal2 = governance::create(
            string::utf8(b"Proposal 2"),
            string::utf8(b"Description 2"),
            DURATION,
            ctx
        );

        // 验证提案属性
        assert!(string::bytes(&proposal1.title) == b"Proposal 1", 0);
        assert!(string::bytes(&proposal2.title) == b"Proposal 2", 1);
        assert!(proposal1.creator == TEST_USER, 2);
        assert!(proposal2.creator == TEST_USER, 3);

        // 清理
        governance::remove(proposal1);
        governance::remove(proposal2);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_empty_description() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let proposal = governance::create(
            string::utf8(TEST_TITLE),
            string::utf8(b""), // 空描述
            DURATION,
            ctx
        );

        // 验证空描述
        assert!(string::bytes(&proposal.description) == b"", 0);

        // 清理
        governance::remove(proposal);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_zero_duration() {
        let mut scenario = test_scenario::begin(TEST_USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let proposal = governance::create(
            string::utf8(TEST_TITLE),
            string::utf8(TEST_DESC),
            0, // 零持续时间
            ctx
        );

        // 验证过期时间
        assert!(proposal.expiration == tx_context::epoch(ctx), 0);

        // 清理
        governance::remove(proposal);

        test_scenario::end(scenario);
    }
}
