use std::collections::HashMap;

use solana_program::{
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack, Sealed},
    pubkey::Pubkey
};

#[derive(Default)]
pub struct State {
    pub authority: Pubkey,
    pub oracle: Pubkey,
    pub tokens: HashMap<Pubkey, Pubkey>
}

impl State {
    pub const MAX_TOKENS: usize = 128;
}

impl Sealed for State { }

impl IsInitialized for State {
    fn is_initialized(&self) -> bool {
        self.authority != Pubkey::default()
    }
}

impl Pack for State {
    const LEN: usize = 8256;

    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        if src.len() != Self::LEN { return Err(ProgramError::InvalidAccountData); }
        let authority_bytes = <[u8; 32]>::try_from(&src[0..32])
            .map_err(|_| ProgramError::InvalidAccountData)?;
        let authority = Pubkey::new_from_array(authority_bytes);
        let oracle_bytes = <[u8; 32]>::try_from(&src[32..64])
            .map_err(|_| ProgramError::InvalidAccountData)?;
        let oracle = Pubkey::new_from_array(oracle_bytes);
        let mut tokens = HashMap::new();
        for i in 0..Self::MAX_TOKENS {
            let index = i * 64 + 64;
            let key_bytes = <[u8; 32]>::try_from(&src[index..index + 32])
                .map_err(|_| ProgramError::InvalidAccountData)?;
            let key = Pubkey::new_from_array(key_bytes);
            let value_bytes = <[u8; 32]>::try_from(&src[index + 32..index + 64])
                .map_err(|_| ProgramError::InvalidAccountData)?;
            let value = Pubkey::new_from_array(value_bytes);
            if key == Pubkey::default() { break; }
            if value == Pubkey::default() { break; }
            tokens.insert(key, value);
        }
        Ok(Self { authority, oracle, tokens  })
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        dst[0..32].copy_from_slice(self.authority.as_ref());
        dst[32..64].copy_from_slice(self.oracle.as_ref());
        for i in 0..self.tokens.len() {
            let index = i * 64 + 64;
            let (key, value) = self.tokens.iter().nth(i).unwrap();
            dst[index..index + 32].copy_from_slice(&key.to_bytes());
            dst[index + 32..index + 64].copy_from_slice(&value.to_bytes());
        }
        for i in self.tokens.len()..Self::MAX_TOKENS {
            let index = i * 64 + 64;
            dst[index..index + 32].copy_from_slice(&Pubkey::default().to_bytes());
            dst[index + 32..index + 64].copy_from_slice(&Pubkey::default().to_bytes());
        }
    }
}
