use solana_program::{
    entrypoint::ProgramResult,
    program_error::ProgramError,
    program_pack::Pack,
    rent::Rent,
    sysvar::Sysvar
};

use crate::{
    accounts::Accounts,
    state::State
};

pub struct Vault;

impl Vault {

    pub fn deposit(accounts: &Accounts, amount: u64) -> ProgramResult {
        let user_data = accounts.user.try_borrow_data()?;
        let rent = Rent::from_account_info(accounts.user)?;
        let rent_balance = rent.minimum_balance(user_data.len());
        let min_balance = amount.checked_add(rent_balance).ok_or(ProgramError::InvalidArgument)?;

        if accounts.user.lamports() <= min_balance {
            return Err(ProgramError::InsufficientFunds);
        }

        **accounts.user.try_borrow_mut_lamports()? -= amount;
        **accounts.vault.try_borrow_mut_lamports()? += amount;
        Ok(())
    }

    pub fn withdraw(accounts: &Accounts, amount: u64) -> ProgramResult {
        let state_data = accounts.vault.try_borrow_data()?;
        let state = State::unpack(*state_data)?;

        if accounts.user.key != &state.authority {
            return Err(ProgramError::InvalidAccountData);
        }

        let rent = Rent::from_account_info(accounts.vault)?;
        let rent_balance = rent.minimum_balance(state_data.len());
        let min_balance = amount.checked_add(rent_balance).ok_or(ProgramError::InvalidArgument)?;

        if accounts.vault.lamports() <= min_balance {
            return Err(ProgramError::InsufficientFunds);
        }

        **accounts.vault.try_borrow_mut_lamports()? -= amount;
        **accounts.user.try_borrow_mut_lamports()? += amount;
        Ok(())
    }

}
