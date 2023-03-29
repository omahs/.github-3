
use solana_program::{
    pubkey::Pubkey,
    account_info::{ AccountInfo, next_account_info },
    program_error::ProgramError
};

use crate::pyth::Pyth;

pub struct Accounts<'a> {
    // 0. `[signer, writable]` The account of the signer of this transaction.
    pub user: &'a AccountInfo<'a>,
    // 1. `[writable]` The jewl.app SOL account.
    pub vault: &'a AccountInfo<'a>,
    // 2. `[]` The spl token program.
    pub token_program: &'a AccountInfo<'a>,
    // 3. `[]` The jewl.app token mint program.
    pub token_mint: &'a AccountInfo<'a>,
    // 4. `[]` The spl token account for the signer.
    pub user_token: &'a AccountInfo<'a>,
    // 5. `[]` The solana pyth price feed oracle program.
    pub mint_authority: &'a AccountInfo<'a>,
    // 6. `[]` The spl token account for the signer.
    pub sol_oracle: &'a AccountInfo<'a>,
    // 7. `[]` The asset pyth price feed oracle program.
    pub price_oracle: &'a AccountInfo<'a>,
    // A nonce used to access the vault.
    pub vault_seed: u8,
    // A nonce used to mint or burn.
    pub authority_seed: u8
}

impl<'a> Accounts<'a> {

    pub fn unpack(program_id: &Pubkey, accounts: &'a [AccountInfo<'a>]) -> Result<Self, ProgramError> {
        let accounts_info = &mut accounts.iter();

        let user = next_account_info(accounts_info)?;
        if !user.is_signer { return Err(ProgramError::MissingRequiredSignature); }
        if !user.is_writable { return Err(ProgramError::InvalidAccountData); }

        let vault = next_account_info(accounts_info)?;
        let (expected_vault, vault_seed) = Pubkey::find_program_address(&[b"vault"], program_id);
        if vault.key != &expected_vault { return Err(ProgramError::InvalidAccountData); }
        if vault.owner != program_id { return Err(ProgramError::IllegalOwner); }
        if !vault.is_writable { return Err(ProgramError::InvalidAccountData); }

        let token_program = next_account_info(accounts_info)?;
        if token_program.key != &spl_token::id() { return Err(ProgramError::InvalidAccountData); }

        let token_mint = next_account_info(accounts_info)?;
        if token_mint.owner != token_program.key { return Err(ProgramError::IllegalOwner); }

        let user_token = next_account_info(accounts_info)?;
        if user_token.owner != token_program.key { return Err(ProgramError::IllegalOwner); }

        let mint_authority = next_account_info(accounts_info)?;
        let (expected_authority, authority_seed) = Pubkey::find_program_address(&[b"authority"], program_id);
        if mint_authority.key != &expected_authority { return Err(ProgramError::InvalidAccountData); }

        let sol_oracle = next_account_info(accounts_info)?;
        if !Pyth::sol_ids().contains(sol_oracle.key) { return Err(ProgramError::InvalidAccountData); }
        if !Pyth::ids().contains(sol_oracle.owner) { return Err(ProgramError::IllegalOwner); }

        let price_oracle = next_account_info(accounts_info)?;
        if !Pyth::ids().contains(price_oracle.owner) { return Err(ProgramError::IllegalOwner); }

        Ok(Self { user, vault, token_program, token_mint, user_token, mint_authority, sol_oracle, price_oracle, vault_seed, authority_seed })
    }

}
