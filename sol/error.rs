use thiserror::Error;
use solana_program::program_error::ProgramError;

#[derive(Error, Debug, Copy, Clone)]
pub enum RuntimeError {
    #[error("Invalid Instruction")]
    InvalidInstruction
}

impl From<RuntimeError> for ProgramError {
    fn from(e: RuntimeError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
