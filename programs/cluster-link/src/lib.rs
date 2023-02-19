use anchor_lang::{AccountsClose, prelude::*};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    program_error::ProgramError,
    pubkey::Pubkey,
    program_pack::Pack,
};
use bytemuck::{cast_slice_mut, from_bytes_mut, try_cast_slice_mut, Pod, Zeroable};
use std::cell::{RefMut};
use anchor_spl::token::*;
use anchor_spl::associated_token::get_associated_token_address;
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod cluster_link {
    use super::*;
    
    pub fn initialize(
        ctx: Context<Initialize>,
        size: u64,
        lamports: u64,
    ) -> Result<()> {
        let acc = &mut ctx.accounts.account;

        let ix = solana_program::system_instruction::create_account(
            ctx.accounts.signer.key,
            ctx.accounts.account.key,
            lamports,
            size,
            &ID,
        );
        let signer_seeds = &[&ctx.accounts.signer.key.as_ref()[..], &ctx.accounts.account.key.as_ref()[..]];
        solana_program::program::invoke_signed(&ix, &[ctx.accounts.signer.clone(), ctx.accounts.account.clone()], &[&signer_seeds[..]])?;
        Ok(())
    }

    pub fn fill(
        ctx: Context<Fill>,
        l: u64,
        r: u64,
        data: [u8; 1024],
    ) -> Result<()> {
        let mut all_data = &mut ctx.accounts.account.try_borrow_mut_data()?;
        let mut interval_data = &mut all_data[l as usize..r as usize];
        let mut full_data = vec![];
        for i in 0..r - l{
            full_data.push(data[i as usize]);
        }
        interval_data.copy_from_slice(&data);

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(size: u64)]
pub struct Initialize<'info> {
    /// CHECK:: 
    #[account(signer)]
    pub signer: AccountInfo<'info>,
    /// CHECK:
    #[account(mut)]
    pub account: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Fill<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    /// CHECK:
    #[account(mut)]
    pub account: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}