use solana_program::{
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    pubkey::Pubkey
};

use crate::{
    instruction::Instruction,
    exchange::Exchange,
    accounts::Accounts,
    vault::Vault,
    state::State,
    filter::Filter
};

pub struct Processor;

impl<'a> Processor {
    pub fn process_instruction(program_id: &Pubkey, accounts: &'a [AccountInfo<'a>], instruction_data: &[u8]) -> ProgramResult {
        let instruction = Instruction::unpack(instruction_data)?;
        let accounts = Accounts::unpack(program_id, accounts)?;

        match instruction {
            Instruction::Mint { amount } => Exchange::mint(&accounts, amount),
            Instruction::Burn { amount } => Exchange::burn(&accounts, amount),
            Instruction::Deposit { amount } => Vault::deposit(&accounts, amount),
            Instruction::Withdraw { amount } => Vault::withdraw(&accounts, amount),
            Instruction::Initialize { } => State::initialize(&accounts),
            Instruction::Create { } => Filter::create(&accounts),
            Instruction::Destroy { } => Filter::destroy(&accounts)
        }
    }
}
