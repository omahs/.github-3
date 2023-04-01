use solana_program::{
    account_info::{ AccountInfo, next_account_info },
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    program_error::ProgramError,
    program_pack::Pack
};

use crate::{
    state::State,
    error::RuntimeError,
    util::{Lamports, Pyth, Token, Vault}
};

pub struct Processor;

impl Processor {

    pub fn initialize_vault<'a>(program_id: &'a Pubkey, accounts: &'a [AccountInfo<'a>]) -> ProgramResult {
        let accounts_info = &mut accounts.iter();
        let signer = next_account_info(accounts_info)?;
        let vault = next_account_info(accounts_info)?;
        let sol_oracle = next_account_info(accounts_info)?;

        let state = State {
            authority: *signer.key,
            oracle: *sol_oracle.key,
            ..Default::default()
        };
        Vault::create(program_id, signer, vault)?;
        State::pack(state, &mut vault.try_borrow_mut_data()?)
    }

    pub fn create_token<'a>(_program_id: &'a Pubkey, accounts: &'a [AccountInfo<'a>]) -> ProgramResult {
        let accounts_info = &mut accounts.iter();
        let signer = next_account_info(accounts_info)?;
        if !signer.is_signer { return Err(ProgramError::MissingRequiredSignature); }
        let vault = next_account_info(accounts_info)?;
        let price_oracle = next_account_info(accounts_info)?;
        let token_mint = next_account_info(accounts_info)?;

        let mut state_data = vault.try_borrow_mut_data()?;
        let mut state = State::unpack(*state_data)?;
        if signer.key != &state.authority { return Err(ProgramError::Forbidden); }
        if state.tokens.get(price_oracle.key).is_some() { return Err(ProgramError::TokenAlreadyInitialized); }
        if state.tokens.len() >= State::MAX_TOKENS { return Err(ProgramError::AccountDataTooSmall); }
        state.tokens.insert(*price_oracle.key, *token_mint.key);
        State::pack(state, *state_data)
    }

    pub fn destroy_token<'a>(_program_id: &'a Pubkey, accounts: &'a [AccountInfo<'a>]) -> ProgramResult {
        let accounts_info = &mut accounts.iter();
        let signer = next_account_info(accounts_info)?;
        if !signer.is_signer { return Err(ProgramError::MissingRequiredSignature); }
        let vault = next_account_info(accounts_info)?;
        let price_oracle = next_account_info(accounts_info)?;

        let mut state_data = vault.try_borrow_mut_data()?;
        let mut state = State::unpack(*state_data)?;
        if signer.key != &state.authority { return Err(ProgramError::Forbidden); }
        state.tokens.remove(price_oracle.key)
            .ok_or(ProgramError::TokenNotInitialized)?;
        State::pack(state, *state_data)
    }

    pub fn deposit_lamports<'a>(program_id: &'a Pubkey, accounts: &'a [AccountInfo<'a>], amount: u64) -> ProgramResult {
        let accounts_info = &mut accounts.iter();
        let signer = next_account_info(accounts_info)?;
        if !signer.is_signer { return Err(ProgramError::MissingRequiredSignature); }
        let vault = next_account_info(accounts_info)?;
        if vault.owner != program_id { return Err(ProgramError::IllegalOwner); }

        Lamports::deposit(signer, vault, amount)
    }

    pub fn withdraw_lamports<'a>(program_id: &'a Pubkey, accounts: &'a [AccountInfo<'a>], amount: u64) -> ProgramResult {
        let accounts_info = &mut accounts.iter();
        let signer = next_account_info(accounts_info)?;
        if !signer.is_signer { return Err(ProgramError::MissingRequiredSignature); }
        let vault = next_account_info(accounts_info)?;
        if vault.owner != program_id { return Err(ProgramError::IllegalOwner); }

        let state_data = vault.try_borrow_data()?;
        let state = State::unpack(*state_data)?;
        if signer.key != &state.authority { return Err(ProgramError::InvalidAccountData); }

        Lamports::withdraw(signer, vault, amount)
    }

    pub fn mint<'a>(program_id: &'a Pubkey, accounts: &'a [AccountInfo<'a>], amount: u64) -> ProgramResult {
        let accounts_info = &mut accounts.iter();
        let signer = next_account_info(accounts_info)?;
        if !signer.is_signer { return Err(ProgramError::MissingRequiredSignature); }
        let vault = next_account_info(accounts_info)?;
        if vault.owner != program_id { return Err(ProgramError::IllegalOwner); }
        let token_mint = next_account_info(accounts_info)?;
        let token_account = next_account_info(accounts_info)?;
        let sol_oracle = next_account_info(accounts_info)?;
        let price_oracle = next_account_info(accounts_info)?;

        let state_data = vault.try_borrow_data()?;
        let state = State::unpack(*state_data)?;

        if sol_oracle.key != &state.oracle { return Err(ProgramError::UnexpectedAccount); }
        if state.tokens.get(price_oracle.key) != Some(token_mint.key) { return Err(ProgramError::UnexpectedAccount); }

        let cost = Pyth::get_mint_cost(amount, sol_oracle, price_oracle)?;

        Lamports::deposit(signer, vault, cost)?;
        Token::mint(token_mint, token_account, vault, amount)
    }

    pub fn burn<'a>(program_id: &'a Pubkey, accounts: &'a [AccountInfo<'a>], amount: u64) -> ProgramResult {
        let accounts_info = &mut accounts.iter();
        let signer = next_account_info(accounts_info)?;
        if !signer.is_signer { return Err(ProgramError::MissingRequiredSignature); }
        let vault = next_account_info(accounts_info)?;
        if vault.owner != program_id { return Err(ProgramError::IllegalOwner); }
        let token_mint = next_account_info(accounts_info)?;
        let token_account = next_account_info(accounts_info)?;
        //TODO: < check if token_account belongs to signer
        let sol_oracle = next_account_info(accounts_info)?;
        let price_oracle = next_account_info(accounts_info)?;

        let state_data = vault.try_borrow_data()?;
        let state = State::unpack(*state_data)?;

        if sol_oracle.key != &state.oracle { return Err(ProgramError::UnexpectedAccount); }
        if state.tokens.get(price_oracle.key) != Some(token_mint.key) { return Err(ProgramError::UnexpectedAccount); }

        let cost = Pyth::get_burn_cost(amount, sol_oracle, price_oracle)?;

        Token::burn(token_mint, token_account, vault, amount)?;
        Lamports::withdraw(signer, vault, cost)
    }

}
