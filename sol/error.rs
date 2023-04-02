use solana_program::program_error::ProgramError;

#[allow(non_upper_case_globals)]
pub trait RuntimeError {
    const AccountNotWritable: ProgramError = ProgramError::Custom(0x90200);
    const UnexpectedAccount: ProgramError = ProgramError::Custom(0x90201);
    const ArrithmicOverflow: ProgramError = ProgramError::Custom(0x90202);
    const Forbidden: ProgramError = ProgramError::Custom(0x90203);
    const TokenAlreadyInitialized: ProgramError = ProgramError::Custom(0x90204);
    const TokenNotInitialized: ProgramError = ProgramError::Custom(0x90205);

    const OracleNotUpToDate: ProgramError = ProgramError::Custom(0x90210);
}

impl RuntimeError for ProgramError { }
