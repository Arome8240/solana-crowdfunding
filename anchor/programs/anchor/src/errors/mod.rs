use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("This program has already been initialized-")]
    AlreadyInitialized,
}
