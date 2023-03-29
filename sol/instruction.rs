use solana_program::program_error::ProgramError;

pub enum Instruction {
    // Mint a specific amount of a jewl.app token by soring lamports in the vault.
    Mint { amount: u64 },
    // Burn a specific amount of a jewl.app token by taking lamports from the vault.
    Burn { amount: u64 },
    // Deposit a specific amount of lamports into the jewl.app vault.
    Deposit { amount: u64 },
    // Withdraw a specific amount of lamports from the jewl.app vault.
    Withdraw { amount: u64 },
    // Initialize the jewl.app program state.
    Initialize { },
    // Add a new jewl.app token to the program.
    Create { },
    // Remove an existing jewl.app token from the program.
    Destroy { }
}

impl Instruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (tag, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;

        Ok(match tag {
            0 => Self::Mint { amount: Self::unpack_amount(rest)? },
            1 => Self::Burn { amount: Self::unpack_amount(rest)? },
            2 => Self::Deposit { amount: Self::unpack_amount(rest)? },
            3 => Self::Withdraw { amount: Self::unpack_amount(rest)? },
            4 => Self::Initialize {  },
            5 => Self::Create {  },
            6 => Self::Destroy {  },
            _ => return Err(ProgramError::InvalidInstructionData)
        })
    }

    fn unpack_amount(input: &[u8]) -> Result<u64, ProgramError> {
        let amount = input
            .get(..8)
            .and_then(|slice| slice.try_into().ok())
            .map(u64::from_le_bytes)
            .ok_or(ProgramError::InvalidInstructionData)?;
        Ok(amount)
    }
}



