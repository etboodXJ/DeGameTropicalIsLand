/*
// 模块: dgti
module dgti::dgti;
*/
//游戏资源模块
#[allow(unused_use,duplicate_alias,unused_const)]
module dgti::asset {
    
    use std::string::{Self,utf8,String};
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;

    // 游戏资源对象
    public struct Asset has key, store {
        id: UID,
        name: String,
        description: String,
        metadata: String,
        owner: address,
    }

    // 创建新游戏资产
    public fun create(
        name: String,
        description: String,
        metadata: String,
        ctx: &mut TxContext,
    ): Asset {
        Asset {
            id: object::new(ctx),
            name,
            description,
            metadata,
            owner: tx_context::sender(ctx),
        }
    }

    // 转移资产所有权
    public fun transfer(asset: &mut Asset, new_owner: address) {
        asset.owner = new_owner;
    }

    // 获取资产所有者
    public fun get_owner(asset: &Asset): address {
        asset.owner
    }

    // 更新资产元数据
    public fun update_metadata(asset: &mut Asset, new_metadata: String) {
        asset.metadata = new_metadata;
    }

    // 获取资产名称
    public fun get_name(asset: &Asset): &String {
        &asset.name
    }

    // 获取资产描述
    public fun get_description(asset: &Asset): &String {
        &asset.description
    }

    // public fun remove(ctx: &mut TxContext) {
    //     let asset = Asset{
    //         id: object::new(ctx),
    //         name:utf8(b"test"),
    //         description:utf8(b"test"),
    //         metadata:utf8(b"test"),
    //         owner: tx_context::sender(ctx),
    //     };

    //     let Asset {
    //         id,
    //         name: _,
    //         description: _,
    //         metadata: _,
    //         owner: _,
    //     } = asset;
    //     object::delete(id);
    // }

    public fun remove(asset: Asset) {
        let Asset {
            id,
            name: _,
            description: _,
            metadata: _,
            owner: _,
        } = asset;
        object::delete(id);
    }
}
// 治理模块 - 协议决策
#[allow(unused_use,duplicate_alias,unused_const)]
module dgti::governance {
    use std::string::String;
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;

    // 提案表示
    public struct Proposal has key, store {
        id: UID,
        creator: address,
        title: String,
        description: String,
        start_time: u64,
        end_time: u64,
        votes_for: u64,
        votes_against: u64,
    }

    // 创建新治理提案
    public fun create(
        title: String,
        description: String,
        duration: u64,
        ctx: &mut TxContext,
    ): Proposal {
        let now = tx_context::epoch(ctx);
        Proposal {
            id: object::new(ctx),
            creator: tx_context::sender(ctx),
            title,
            description,
            start_time: now,
            end_time: now + duration,
            votes_for: 0,
            votes_against: 0,
        }
    }

    // 对提案进行投票
    public fun vote(proposal: &mut Proposal, is_for: bool) {
        if (is_for) {
            proposal.votes_for = proposal.votes_for + 1;
        } else {
            proposal.votes_against = proposal.votes_against + 1;
        }
    }
}
// 用户模块 - 管理玩家档案
#[allow(unused_use,duplicate_alias,unused_const)]
module dgti::user {
    use std::string::String;
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;

    // 玩家档案表示
    public struct Profile has key, store {
        id: UID,
        address: address,
        username: String,
        reputation: u64,
        joined_timestamp: u64,
    }

    // 创建新玩家档案
    public fun create(username: String, ctx: &mut TxContext): Profile {
        Profile {
            id: object::new(ctx),
            address: tx_context::sender(ctx),
            username,
            reputation: 0,
            joined_timestamp: tx_context::epoch(ctx),
        }
    }

    // 更新玩家声誉
    public fun update_reputation(profile: &mut Profile, delta: u64) {
        profile.reputation = profile.reputation + delta;
    }
}
// 交易模块 - 处理资产交易
#[allow(unused_use,duplicate_alias,unused_const)]
module dgti::trade {
    use dgti::asset::Asset;
    use std::string::String;
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;

    // 交易报价表示
    public struct TradeOffer has key, store {
        id: UID,
        asset_id: ID,
        price: u64,
        seller: address,
        expiration: u64,
    }

    // 创建新交易报价
    public fun create_offer(
        asset: &mut Asset,
        price: u64,
        expiration: u64,
        ctx: &mut TxContext,
    ): TradeOffer {
        TradeOffer {
            id: object::new(ctx),
            asset_id: object::id(asset),
            price,
            seller: tx_context::sender(ctx),
            expiration,
        }
    }
}
