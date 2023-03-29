use std::{
    collections::HashSet,
    str::FromStr, ops::Neg
};

use solana_program::{
    pubkey::Pubkey,
    program_error::ProgramError,
    clock::Clock, sysvar::Sysvar, account_info::AccountInfo
};

use pyth_sdk_solana::{
    load_price_feed_from_account_info,
    Price
};

use crate::accounts::Accounts;

pub struct Pyth;

impl Pyth {
    pub const DECIMALS: u8 = 9;
    const STALE_THRESHOLD: u64 = 60;

    pub fn ids() -> HashSet<Pubkey> {
        HashSet::from([
            Pubkey::from_str("gSbePebfvPy7tRqimPoVecS2UsBvYv46ynrzWocc92s").unwrap(), //devnet
            Pubkey::from_str("8tfDNiaEyrV6Q1U4DEXrEigs9DoDtkugzFbybENEbCDz").unwrap(), //testnet
            Pubkey::from_str("FsJ3A3u2vn5cTVofAjvy6y5kwABJAqYWpe4975bi2epH").unwrap() //mainnet
        ])
    }

    pub fn sol_ids() -> HashSet<Pubkey> {
        HashSet::from([
            Pubkey::from_str("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix").unwrap(), //devnet
            Pubkey::from_str("7VJsBtJzgTftYzEeooSDYyjKXvYRWJHdwvbwfBvTg9K").unwrap(), //testnet
            Pubkey::from_str("H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG").unwrap(), //mainnet
        ])
    }

    pub fn get_price_feed(accounts: &Accounts) -> Result<Price, ProgramError> {
        let sol_feed = Self::get_single_feed(accounts.sol_oracle)?;
        let asset_feed = Self::get_single_feed(accounts.price_oracle)?;
        let expo = (Self::DECIMALS as i32).neg();
        let feed = asset_feed.get_price_in_quote(&sol_feed, expo)
            .ok_or(ProgramError::InvalidAccountData)?;
        Ok(feed)
    }

    fn get_single_feed(account: &AccountInfo) -> Result<Price, ProgramError> {
        let feed = load_price_feed_from_account_info(account)?;
        let timestamp = Clock::get()?.unix_timestamp;
        let current = feed.get_price_no_older_than(timestamp, Self::STALE_THRESHOLD)
            .ok_or(ProgramError::Custom(90210))?;
        Ok(current)
    }
}

