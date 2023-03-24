use solana_program::{
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    pubkey::Pubkey
};

use crate::{
    instruction::Instruction,
    reserves::Reserves,
    exchange::Exchange
};

pub fn process_instruction(program_id: &Pubkey, accounts: &[AccountInfo], instruction_data: &[u8]) -> ProgramResult {
    let instruction = Instruction::unpack(instruction_data)?;

    match instruction {
        Instruction::Mint { amount } => { Reserves::increase_supply(accounts, amount, program_id) },
        Instruction::Burn { amount } => { Reserves::decrease_supply(accounts, amount, program_id) },
        Instruction::Create { } => { Reserves::create(accounts, program_id) },
        Instruction::Destroy { } => { Reserves::destroy(accounts, program_id) },
        Instruction::Buy { amount } => { Exchange::buy(accounts, amount, program_id) },
        Instruction::Sell { amount } => { Exchange::sell(accounts, amount, program_id) },
        Instruction::Deposit { amount } => { Reserves::deposit(accounts, amount, program_id) },
        Instruction::Withdraw { amount } => { Reserves::withdraw(accounts, amount, program_id) }
    }
}
