import { TransactionInstruction, PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import BigNumber from "bn.js";

export const lamportsPerSol = new BigNumber(LAMPORTS_PER_SOL);
export const decimals = Math.log10(LAMPORTS_PER_SOL);

export const vaultAccount = (programId: PublicKey): PublicKey => {
    return PublicKey.findProgramAddressSync([Buffer.from("vault")], programId)[0];
};

export const associatedTokenAccount = (payer: PublicKey, mint: PublicKey): PublicKey => {
    return PublicKey.findProgramAddressSync([payer.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()], ASSOCIATED_TOKEN_PROGRAM_ID)[0];
};

export const initialize = (programId: PublicKey, payer: PublicKey, oracle: PublicKey): TransactionInstruction => {
    return new TransactionInstruction({
        keys: [
            { pubkey: payer, isSigner: true, isWritable: true },
            { pubkey: vaultAccount(programId), isSigner: false, isWritable: true },
            { pubkey: oracle, isSigner: false, isWritable: false },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
        ],
        data: Buffer.from([0]),
        programId
    });
};

export const create = (programId: PublicKey, payer: PublicKey, oracle: PublicKey, mint: PublicKey): TransactionInstruction => {
    return new TransactionInstruction({
        keys: [
            { pubkey: payer, isSigner: true, isWritable: true },
            { pubkey: vaultAccount(programId), isSigner: false, isWritable: true },
            { pubkey: oracle, isSigner: false, isWritable: false },
            { pubkey: mint, isSigner: false, isWritable: false }
        ],
        data: Buffer.from([1]),
        programId
    });
};

export const destroy = (programId: PublicKey, payer: PublicKey, oracle: PublicKey): TransactionInstruction => {
    return new TransactionInstruction({
        keys: [
            { pubkey: payer, isSigner: true, isWritable: true },
            { pubkey: vaultAccount(programId), isSigner: false, isWritable: true },
            { pubkey: oracle, isSigner: false, isWritable: false }
        ],
        data: Buffer.from([2]),
        programId
    });
};

export const mint = (programId: PublicKey, payer: PublicKey, tokenMint: PublicKey, solOracle: PublicKey, oracle: PublicKey, amount: number): TransactionInstruction => {
    const amountBytes = new BigNumber(amount).mul(lamportsPerSol).toBuffer("le", 8);
    return new TransactionInstruction({
        keys: [
            { pubkey: payer, isSigner: true, isWritable: true },
            { pubkey: vaultAccount(programId), isSigner: false, isWritable: true },
            { pubkey: tokenMint, isSigner: false, isWritable: true },
            { pubkey: associatedTokenAccount(payer, tokenMint), isSigner: false, isWritable: true },
            { pubkey: solOracle, isSigner: false, isWritable: false },
            { pubkey: oracle, isSigner: false, isWritable: false },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }
        ],
        data: Buffer.from([3, ...amountBytes]),
        programId
    });
};

export const burn = (programId: PublicKey, payer: PublicKey, tokenMint: PublicKey, solOracle: PublicKey, oracle: PublicKey, amount: number): TransactionInstruction => {
    const amountBytes = new BigNumber(amount).mul(lamportsPerSol).toBuffer("le", 8);
    return new TransactionInstruction({
        keys: [
            { pubkey: payer, isSigner: true, isWritable: true },
            { pubkey: vaultAccount(programId), isSigner: false, isWritable: true },
            { pubkey: tokenMint, isSigner: false, isWritable: true },
            { pubkey: associatedTokenAccount(payer, tokenMint), isSigner: false, isWritable: true },
            { pubkey: solOracle, isSigner: false, isWritable: false },
            { pubkey: oracle, isSigner: false, isWritable: false },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }
        ],
        data: Buffer.from([4, ...amountBytes]),
        programId
    });
};

export const deposit = (programId: PublicKey, payer: PublicKey, amount: number): TransactionInstruction => {
    const amountBytes = new BigNumber(amount).mul(lamportsPerSol).toBuffer("le", 8);
    return new TransactionInstruction({
        keys: [
            { pubkey: payer, isSigner: true, isWritable: true },
            { pubkey: vaultAccount(programId), isSigner: false, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
        ],
        data: Buffer.from([5, ...amountBytes]),
        programId
    });
};

export const withdraw = (programId: PublicKey, payer: PublicKey, amount: number): TransactionInstruction => {
    const amountBytes = new BigNumber(amount).mul(lamportsPerSol).toBuffer("le", 8);
    return new TransactionInstruction({
        keys: [
            { pubkey: payer, isSigner: true, isWritable: true },
            { pubkey: vaultAccount(programId), isSigner: false, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
        ],
        data: Buffer.from([6, ...amountBytes]),
        programId
    });
};
