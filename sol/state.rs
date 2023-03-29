use std::collections::HashSet;

use solana_program::{
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack, Sealed},
    pubkey::Pubkey,
    entrypoint::ProgramResult,
};

use crate::accounts::Accounts;

pub struct State {
    pub is_initialized: bool,
    pub authority: Pubkey,
    pub filter: HashSet<Pubkey>
}

impl Sealed for State { }

impl IsInitialized for State {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl Pack for State {
    const LEN: usize = 8225;

    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        if src.len() != Self::LEN { return Err(ProgramError::InvalidAccountData); }
        if src[0] == 0 { return Ok(Self { is_initialized: false, authority: Pubkey::default(), filter: HashSet::new() }); }
        if src[0] != 1 { return Err(ProgramError::InvalidAccountData); }
        let authority_bytes = <[u8; 32]>::try_from(&src[1..33])
            .map_err(|_| ProgramError::InvalidAccountData)?;
        let authority = Pubkey::new_from_array(authority_bytes);
        let mut filter = HashSet::new();
        for i in 0..256 {
            let index = i * 32 + 33;
            let pubkey_bytes = <[u8; 32]>::try_from(&src[index..index + 32])
                .map_err(|_| ProgramError::InvalidAccountData)?;
            let pubkey = Pubkey::new_from_array(pubkey_bytes);
            if pubkey == Pubkey::default() { break; }
            filter.insert(pubkey);
        }
        Ok(Self { is_initialized: true, authority, filter })
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        dst[0] = self.is_initialized as u8;
        dst[1..33].copy_from_slice(self.authority.as_ref());
        for i in 0..self.filter.len() {
            let index = i * 32 + 33;
            let pubkey = self.filter.iter().nth(i).unwrap();
            dst[index..index + 32].copy_from_slice(&pubkey.as_ref());
        }
    }
}

impl State {
    pub fn initialize(accounts: &Accounts) -> ProgramResult {
        let mut state_data = accounts.vault.try_borrow_mut_data()?;
        let mut state = Self::unpack_unchecked(*state_data)?;
        state.authority = *accounts.user.key;
        state.filter = HashSet::new();
        state.is_initialized = true;
        Self::pack(state, *state_data)?;
        Ok(())
    }
}
