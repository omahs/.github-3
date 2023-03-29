use solana_program::{
    entrypoint::ProgramResult,
    program_error::ProgramError,
    rent::Rent,
    sysvar::Sysvar,
    program_pack::Pack
};

use spl_token::state::Account;

use crate::{
    accounts::Accounts,
    filter::Filter,
    pyth::Pyth,
    token::Token,
    vault::Vault
};

pub struct Exchange;

impl Exchange {
    // 1 / FEE_DENOM = 1%
    const FEE_DENOM: u64 = 100;

    pub fn mint(accounts: &Accounts, amount: u64) -> ProgramResult {
        Filter::validate(accounts)?;

        let feed = Pyth::get_price_feed(accounts)?; // 1 asset = x lamports
        let base = <u64>::try_from(feed.price).map_err(|_| ProgramError::InvalidAccountData)?;
        let upper = base.checked_add(feed.conf).ok_or(ProgramError::InvalidAccountData)?;

        let price = upper.checked_mul(amount).ok_or(ProgramError::InvalidAccountData)?;
        let fee = price.checked_div(Self::FEE_DENOM).ok_or(ProgramError::InvalidAccountData)?;
        let cost = price.checked_add(fee).ok_or(ProgramError::InvalidAccountData)?;

        Vault::deposit(accounts, cost);
        Token::mint(accounts, amount)?;

        Ok(())
    }

    pub fn burn(accounts: &Accounts, amount: u64) -> ProgramResult {
        Filter::validate(accounts)?;

        let token_account = Account::unpack(&accounts.user_token.try_borrow_data()?)?;
        if token_account.amount < amount {
            return Err(ProgramError::InsufficientFunds);
        }

        let feed = Pyth::get_price_feed(accounts)?; // 1 asset = x lamports
        let base = <u64>::try_from(feed.price).map_err(|_| ProgramError::InvalidAccountData)?;
        let lower = base.checked_sub(feed.conf).ok_or(ProgramError::InvalidAccountData)?;

        let price = lower.checked_mul(amount).ok_or(ProgramError::InvalidAccountData)?;
        let fee = price.checked_div(Self::FEE_DENOM).ok_or(ProgramError::InvalidAccountData)?;
        let cost = price.checked_sub(fee).ok_or(ProgramError::InvalidAccountData)?;

        Vault::withdraw(accounts, cost);
        Token::burn(accounts, amount)?;

        Ok(())
    }

}
