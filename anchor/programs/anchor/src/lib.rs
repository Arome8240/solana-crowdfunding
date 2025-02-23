use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod states;

use instructions::*;
#[allow(unused_imports)]
use states::*;

declare_id!("59Q4NYzHnFopBEMKnYLBjWJwmWLeJ5JFtKTujNEkoGp6");

#[program]
pub mod anchor {
    use super::*;

    pub fn initialize(ctx: Context<InitializeCtx>) -> Result<()> {
        instructions::initialize(ctx)?;
        Ok(())
    }
}
