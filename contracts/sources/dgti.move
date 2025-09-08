/*
/// Module: dgti
module dgti::dgti;
*/
/// Asset module for managing game assets
#[allow(unused_use,duplicate_alias,unused_const)]
module dgti::asset {
    
    use std::string::{Self,utf8,String};
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;

    /// Game asset representation
    public struct Asset has key, store {
        id: UID,
        name: String,
        description: String,
        metadata: String,
        owner: address,
    }

    /// Create a new game asset
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

    /// Transfer asset ownership
    public fun transfer(asset: &mut Asset, new_owner: address) {
        asset.owner = new_owner;
    }

    /// Get asset owner
    public fun get_owner(asset: &Asset): address {
        asset.owner
    }

    /// Update asset metadata
    public fun update_metadata(asset: &mut Asset, new_metadata: String) {
        asset.metadata = new_metadata;
    }

    /// Get asset name
    public fun get_name(asset: &Asset): &String {
        &asset.name
    }

    /// Get asset description
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
/// Governance module for protocol decisions
#[allow(unused_use,duplicate_alias,unused_const)]
module dgti::governance {
    use std::string::String;
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;

    /// Proposal representation
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

    /// Create a new governance proposal
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

    /// Vote on a proposal
    public fun vote(proposal: &mut Proposal, is_for: bool) {
        if (is_for) {
            proposal.votes_for = proposal.votes_for + 1;
        } else {
            proposal.votes_against = proposal.votes_against + 1;
        }
    }
}
/// User module for managing player profiles
#[allow(unused_use,duplicate_alias,unused_const)]
module dgti::user {
    use std::string::String;
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;

    /// Player profile representation
    public struct Profile has key, store {
        id: UID,
        address: address,
        username: String,
        reputation: u64,
        joined_timestamp: u64,
    }

    /// Create a new player profile
    public fun create(username: String, ctx: &mut TxContext): Profile {
        Profile {
            id: object::new(ctx),
            address: tx_context::sender(ctx),
            username,
            reputation: 0,
            joined_timestamp: tx_context::epoch(ctx),
        }
    }

    /// Update player reputation
    public fun update_reputation(profile: &mut Profile, delta: u64) {
        profile.reputation = profile.reputation + delta;
    }
}
/// Trade module for handling asset transactions
#[allow(unused_use,duplicate_alias,unused_const)]
module dgti::trade {
    use dgti::asset::Asset;
    use std::string::String;
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;

    /// Trade offer representation
    public struct TradeOffer has key, store {
        id: UID,
        asset_id: ID,
        price: u64,
        seller: address,
        expiration: u64,
    }

    /// Create a new trade offer
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
