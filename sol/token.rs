use solana_program::{
    entrypoint::ProgramResult,
    program::invoke_signed
};

use spl_token::{
    instruction::{ mint_to_checked, burn_checked }
};

use crate::{
    pyth::Pyth,
    accounts::Accounts
};


pub struct Token;

impl Token {
    pub fn mint(accounts: &Accounts, amount: u64) -> ProgramResult {
        let instruction = mint_to_checked(
            accounts.token_program.key,
            accounts.token_mint.key,
            accounts.user_token.key,
            accounts.mint_authority.key, // <-
            &[],
            amount,
            Pyth::DECIMALS
        )?;

        let invoke_accounts = [
            accounts.user_token.clone(),
            accounts.token_mint.clone(),
            accounts.mint_authority.clone(),
            accounts.token_program.clone()
        ];

        let seeds: &[&[&[u8]]] = &[&[
            b"mint",
            &[accounts.authority_seed]
        ]];

        invoke_signed(&instruction,&invoke_accounts, seeds)

    }

    pub fn burn(accounts: &Accounts, amount: u64) -> ProgramResult {
        let instruction = burn_checked(
            accounts.token_program.key,
            accounts.user_token.key,
            accounts.token_mint.key,
            accounts.mint_authority.key,
            &[],
            amount,
            Pyth::DECIMALS
        )?;

        let invoke_accounts = [
            accounts.user_token.clone(),
            accounts.token_mint.clone(),
            accounts.mint_authority.clone(),
            accounts.token_program.clone()
        ];

        let seeds: &[&[&[u8]]] = &[&[
            b"burn",
            &[accounts.authority_seed]
        ]];

        invoke_signed(&instruction, &invoke_accounts, seeds)
    }
}
