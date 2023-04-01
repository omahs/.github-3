use solana_program::{
    program_error::ProgramError,
    clock::Clock,
    sysvar::Sysvar,
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    program::{invoke, invoke_signed},
    system_instruction::{transfer, create_account},
    rent::Rent,
    pubkey::Pubkey,
    program_pack::Pack
};

use spl_token::{
    instruction::{ mint_to, burn }
};

use pyth_sdk_solana::{
    load_price_feed_from_account_info,
    Price
};

use crate::{error::RuntimeError, state::State};

pub struct Pyth;

impl<'a> Pyth {
    const STALE_THRESHOLD: u64 = 60;
    const FEE_DENOM: u64 = 100;

    pub fn get_mint_cost(amount: u64, sol_oracle: &'a AccountInfo<'a>, price_oracle: &'a AccountInfo<'a>) -> Result<u64, ProgramError> {
        let feed = Self::get_price_feed(sol_oracle, price_oracle)?;
        let base = <u64>::try_from(feed.price).map_err(|_| ProgramError::ArrithmicOverflow)?;
        let upper = base.checked_add(feed.conf).ok_or(ProgramError::ArrithmicOverflow)?;
        let price = upper.checked_mul(amount).ok_or(ProgramError::ArrithmicOverflow)?;
        let fee = price.checked_div(Self::FEE_DENOM).ok_or(ProgramError::ArrithmicOverflow)?;
        let cost = price.checked_add(fee).ok_or(ProgramError::ArrithmicOverflow)?;
        Ok(cost)
    }

    pub fn get_burn_cost(amount: u64, sol_oracle: &'a AccountInfo<'a>, price_oracle: &'a AccountInfo<'a>) -> Result<u64, ProgramError> {
        let feed = Self::get_price_feed(sol_oracle, price_oracle)?;
        let base = <u64>::try_from(feed.price).map_err(|_| ProgramError::ArrithmicOverflow)?;
        let lower = base.checked_sub(feed.conf).ok_or(ProgramError::ArrithmicOverflow)?;
        let price = lower.checked_mul(amount).ok_or(ProgramError::ArrithmicOverflow)?;
        let fee = price.checked_div(Self::FEE_DENOM).ok_or(ProgramError::ArrithmicOverflow)?;
        let cost = price.checked_sub(fee).ok_or(ProgramError::ArrithmicOverflow)?;
        Ok(cost)
    }

    fn get_price_feed(sol_oracle: &'a AccountInfo<'a>, price_oracle: &'a AccountInfo<'a>) -> Result<Price, ProgramError> {
        let sol_feed = Self::get_single_feed(sol_oracle)?;
        let asset_feed = Self::get_single_feed(price_oracle)?;
        let feed = asset_feed.get_price_in_quote(&sol_feed, -9)
            .ok_or(ProgramError::ArrithmicOverflow)?;
        Ok(feed)
    }

    fn get_single_feed(account: &'a AccountInfo<'a>) -> Result<Price, ProgramError> {
        let feed = load_price_feed_from_account_info(account)?;
        let timestamp = Clock::get()?.unix_timestamp;
        let current = feed.get_price_no_older_than(timestamp, Self::STALE_THRESHOLD)
            .ok_or(ProgramError::OracleNotUpToDate)?;
        Ok(current)
    }
}

pub struct Token;
impl<'a> Token {
    pub fn mint(mint: &'a AccountInfo<'a>, token: &'a AccountInfo<'a>, authority: &'a AccountInfo<'a>, amount: u64) -> ProgramResult {
        let instruction = mint_to(
            &spl_token::id(),
            mint.key,
            token.key,
            authority.key,
            &[],
            amount,
        )?;

        let invoke_accounts = [
            mint.clone(),
            token.clone(),
            authority.clone()
        ];

        invoke_signed(&instruction,&invoke_accounts, &[]) //TODO: <- add seeds
    }

    pub fn burn(mint: &'a AccountInfo<'a>, token: &'a AccountInfo<'a>, authority: &'a AccountInfo<'a>, amount: u64) -> ProgramResult {
        let instruction = burn(
            &spl_token::id(),
            token.key,
            mint.key,
            authority.key,
            &[],
            amount,
        )?;

        let invoke_accounts = [
            token.clone(),
            mint.clone(),
            authority.clone()
        ];

        invoke_signed(&instruction, &invoke_accounts, &[]) //TODO: <- add seeds
    }
}

pub struct Lamports;
impl<'a> Lamports {

    pub fn deposit(signer: &'a AccountInfo<'a>, vault: &'a AccountInfo<'a>, amount: u64) -> ProgramResult {
        let instruction = transfer(
            signer.key,
            vault.key,
            amount
        );

        let invoke_accounts = [
            signer.clone(),
            vault.clone()
        ];

        invoke(&instruction, &invoke_accounts)
    }

    pub fn withdraw(signer: &'a AccountInfo<'a>, vault: &'a AccountInfo<'a>, amount: u64) -> ProgramResult {
        **vault.try_borrow_mut_lamports()? -= amount;
        **signer.try_borrow_mut_lamports()? += amount;
        Ok(())
    }
}

pub struct Vault;
impl<'a> Vault {

    pub fn create(program_id: &'a Pubkey, signer: &'a AccountInfo<'a>, vault: &'a AccountInfo<'a>) -> ProgramResult {
        let balance = Rent::default().minimum_balance(State::LEN);

        let seed: &[u8] = b"vault";
        let (_expected_vault, bump_seed) = Pubkey::find_program_address(&[seed], program_id);

        let instruction = create_account(
            signer.key,
            vault.key,
            balance,
            State::LEN as u64,
            program_id
        );

        let accounts = [
            signer.clone(),
            vault.clone()
        ];

        let seeds: &[&[&[u8]]] = &[
            &[seed, &[bump_seed]]
        ];

        invoke_signed(&instruction, &accounts, seeds)
    }
}
