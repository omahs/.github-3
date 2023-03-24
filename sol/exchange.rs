use solana_program::{
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    pubkey::Pubkey
};

pub struct Exchange;

impl Exchange {

    pub fn buy(_accounts: &[AccountInfo], _amount: u64, _program_id: &Pubkey) -> ProgramResult {

        Ok(())
    }

    pub fn sell(_accounts: &[AccountInfo], _amount: u64, _program_id: &Pubkey) -> ProgramResult {

        Ok(())
    }

}
