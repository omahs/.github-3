use solana_program::{
    program_error::ProgramError,
    pubkey::Pubkey,
    entrypoint::ProgramResult,
    account_info::AccountInfo
};

use crate::processor::Processor;

pub enum Instruction {
    // Initialize the jewl.app program state.
    // 0. [signer, writable] Account that takes authority.
    // 1. [writable] Program vault.
    // 2. [] Sol price oracle.
    // 3. [] The system program.
    Initialize { },

    // Add a new jewl.app token to the program.
    // 0. [signer, writable] Authority account.
    // 1. [writable] Program vault.
    // 2. [] Price oracle.
    // 3. [] Token mint.
    Create { },

    // Remove an existing jewl.app token from the program.
    // 0. [signer, writable] Authority account.
    // 1. [writable] Program vault.
    // 2. [] Price oracle.
    Destroy { },

    // Mint a specific amount of a jewl.app token by soring lamports in the vault.
    // 0. [signer, writable] Signer account.
    // 1. [writable] Program vault.
    // 2. [writable] Token mint.
    // 3. [writable] Token account.
    // 4. [] Sol price oracle.
    // 5. [] Token price oracle.
    // 6. [] The system program.
    // 7. [] The token program.
    // 8. [] The associated token program.
    Mint { amount: u64 },

    // Burn a specific amount of a jewl.app token by taking lamports from the vault.
    // 0. [signer, writable] Signer account.
    // 1. [writable] Program vault.
    // 2. [writable] Token mint.
    // 3. [writable] Token account.
    // 4. [] Sol price oracle.
    // 5. [] Token price oracle.
    // 6. [] The system program.
    // 7. [] The token program.
    // 8. [] The associated token program.
    Burn { amount: u64 },

    // Deposit a specific amount of lamports into the jewl.app vault.
    // 0. [signer, writable] Authority account.
    // 1. [writable] Program vault.
    // 2. [] The system program.
    Deposit { amount: u64 },

    // Withdraw a specific amount of lamports from the jewl.app vault.
    // 0. [signer, writable] Authority account.
    // 1. [writable] Program vault.
    // 2. [] The system program.
    Withdraw { amount: u64 }
}

impl Instruction {
    pub fn process<'a>(program_id: &'a Pubkey, accounts: &'a [AccountInfo<'a>], instruction_data: &[u8]) -> ProgramResult {
        let instruction = Self::unpack(instruction_data)?;

        match instruction {
            Self::Initialize { } => Processor::initialize_vault(program_id, accounts),
            Self::Create { } => Processor::create_token(program_id, accounts),
            Self::Destroy { } => Processor::destroy_token(program_id, accounts),
            Self::Mint { amount } => Processor::mint(program_id, accounts, amount),
            Self::Burn { amount } => Processor::burn(program_id, accounts, amount),
            Self::Deposit { amount } => Processor::deposit_lamports(program_id, accounts, amount),
            Self::Withdraw { amount } => Processor::withdraw_lamports(program_id, accounts, amount)
        }
    }

    fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (tag, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;

        Ok(match tag {
            0 => Self::Initialize {  },
            1 => Self::Create {  },
            2 => Self::Destroy {  },
            3 => Self::Mint { amount: Self::unpack_amount(rest)? },
            4 => Self::Burn { amount: Self::unpack_amount(rest)? },
            5 => Self::Deposit { amount: Self::unpack_amount(rest)? },
            6 => Self::Withdraw { amount: Self::unpack_amount(rest)? },
            _ => return Err(ProgramError::InvalidInstructionData)
        })
    }

    fn unpack_amount(input: &[u8]) -> Result<u64, ProgramError> {
        let amount = input
            .get(..8)
            .and_then(|slice| slice.try_into().ok())
            .map(u64::from_le_bytes)
            .ok_or(ProgramError::InvalidArgument)?;
        Ok(amount)
    }
}



