use solana_program::entrypoint;
use crate::processor::process_instruction;

#[cfg(not(feature = "no-entrypoint"))]
entrypoint!(process_instruction);
