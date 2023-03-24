use solana_program::program_error::ProgramError;
use crate::error::RuntimeError::InvalidInstruction;


pub enum Instruction {
    /// Increase the supply of a specific jewl token in the reserves. Can only be called by the Upgrade Authority.
    ///
    /// Accounts expected:
    /// 0. `[signer]` The account of the Upgrade Authority.
    /// 1. `[]` The token program
    Mint {
        /// The amount by which to increase the supply of the token.
        amount: u64
    },
    /// Decrease the supply of a specific jewl token out of the reserves. Can only be called by the Upgrade Authority.
    ///
    /// Accounts expected:
    /// 0. `[signer]` The account of the Upgrade Authority.
    /// 1. `[]` The token program.
    Burn {
        /// The amount by which to decrease the supply of the token.
        amount: u64
    },
    /// Create a new jewl token. Can only be called by the Upgrade Authority.
    ///
    /// Accounts expected:
    /// 0. `[signer]` The account of the Upgrade Authority.
    Create { },
    /// Destroy an existing jewl token. Can only be called by the Upgrade Authority.
    ///
    /// Accounts expected:
    /// 0. `[signer]` The account of the Upgrade Authority.
    /// 1. `[]` The token program to destroy.
    Destroy { },
    /// Buy a specific amount of a specific jewl token from the reserves.
    ///
    /// Accounts expected:
    /// 0. `[signer]` The account of the buyer.
    /// 1. `[]` The token program.
    Buy {
        /// The amount of the token to buy.
        amount: u64
    },
    /// Sell a specific amount of a specific jewl token to the reserves.
    ///
    /// Accounts expected:
    /// 0. `[signer]` The account of the seller.
    /// 1. `[]` The token program.
    Sell {
        /// The amount of the token to sell.
        amount: u64
    },
    /// Deposit Lamports into the reserves. Should only be called by the Upgrade Authority.
    ///
    /// Accounts expected:
    /// 0. `[signer]` The account of the depositor (Upgrade Authoritiy).
    Deposit {
        /// The amount of Lamports to deposit.
        amount: u64
    },
    /// Withdraw Lamports from the reserves. Can only be called by the Upgrade Authority.
    ///
    /// Accounts expected:
    /// 0. `[signer]` The account of the Upgrade Authority.
    Withdraw {
        /// The amount of Lamports to withdraw.
        amount: u64
    }
}

impl Instruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (tag, rest) = input.split_first().ok_or(InvalidInstruction)?;

        Ok(match tag {
            0 => Self::Mint { amount: Self::unpack_amount(rest)? },
            1 => Self::Burn { amount: Self::unpack_amount(rest)? },
            2 => Self::Create { },
            3 => Self::Destroy { },
            4 => Self::Buy { amount: Self::unpack_amount(rest)? },
            5 => Self::Sell { amount: Self::unpack_amount(rest)? },
            6 => Self::Deposit { amount: Self::unpack_amount(rest)? },
            7 => Self::Withdraw { amount: Self::unpack_amount(rest)? },
            _ => return Err(InvalidInstruction.into()),
        })
    }

    fn unpack_amount(input: &[u8]) -> Result<u64, ProgramError> {
        let amount = input
            .get(..8)
            .and_then(|slice| slice.try_into().ok())
            .map(u64::from_le_bytes)
            .ok_or(InvalidInstruction)?;
        Ok(amount)
    }
}



