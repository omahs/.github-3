use solana_program::{
    entrypoint::ProgramResult,
    program_error::ProgramError,
    program_pack::Pack,
    pubkey::Pubkey,
    hash::hash
};

use crate::{
    accounts::Accounts,
    state::State
};

pub struct Filter;

impl Filter {
    pub fn create(accounts: &Accounts) -> ProgramResult {
        let mut state_data = accounts.vault.try_borrow_mut_data()?;
        let mut state = State::unpack(*state_data)?;

        if accounts.user.key != &state.authority {
            return Err(ProgramError::InvalidAccountData);
        }

        if state.filter.len() >= 256 {
            return Err(ProgramError::InvalidAccountData);
        }

        let digest = Self::sha256(accounts.token_mint.key, accounts.price_oracle.key);
        state.filter.insert(digest);
        State::pack(state, *state_data)?;

        Ok(())
    }

    pub fn destroy(accounts: &Accounts) -> ProgramResult {
        let mut state_data = accounts.vault.try_borrow_mut_data()?;
        let mut state = State::unpack(*state_data)?;

        if accounts.user.key != &state.authority {
            return Err(ProgramError::InvalidAccountData);
        }

        let digest = Self::sha256(accounts.token_mint.key, accounts.price_oracle.key);
        state.filter.remove(&digest);
        State::pack(state, *state_data)?;

        Ok(())
    }

    pub fn validate(accounts: &Accounts) -> ProgramResult {
        let state_data = accounts.vault.try_borrow_data()?;
        let state = State::unpack(*state_data)?;
        let digest = Self::sha256(accounts.token_mint.key, accounts.price_oracle.key);

        if !state.filter.contains(&digest) {
            return Err(ProgramError::InvalidAccountData);
        }

        Ok(())
    }

    fn sha256(a: &Pubkey, b: &Pubkey) -> Pubkey {
        let preimage = [a.to_bytes(), b.to_bytes()].concat();
        let digest = hash(&preimage).to_bytes();
        Pubkey::new_from_array(digest)
    }

}
