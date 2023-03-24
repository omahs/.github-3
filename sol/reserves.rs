use solana_program::{
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    pubkey::Pubkey
};

pub struct Reserves;

impl Reserves {
    pub fn create(_accounts: &[AccountInfo], _program_id: &Pubkey) -> ProgramResult {

        Ok(())
    }

    pub fn destroy(_accounts: &[AccountInfo], _program_id: &Pubkey) -> ProgramResult {

        Ok(())
    }

    pub fn increase_supply(_accounts: &[AccountInfo], _amount: u64, _program_id: &Pubkey) -> ProgramResult {
        // self.supply += amount;
        Ok(())
    }

    pub fn decrease_supply(_accounts: &[AccountInfo], _amount: u64, _program_id: &Pubkey) -> ProgramResult {
        // self.supply -= amount;
        Ok(())
    }

    pub fn deposit(_accounts: &[AccountInfo], _amount: u64, _program_id: &Pubkey) -> ProgramResult {
        // self.balance += amount;
        Ok(())
    }

    pub fn withdraw(_accounts: &[AccountInfo], _amount: u64, _program_id: &Pubkey) -> ProgramResult {
        // self.balance -= amount;
        Ok(())
    }
}
