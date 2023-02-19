import { ClusterLink, IDL } from "./IDL";
import { AnchorProvider, BN, Program, Provider, utils } from "@project-serum/anchor";
import { AccountInfo, ConfirmOptions, Connection, Finality, GetProgramAccountsFilter, PublicKey, Transaction, TransactionInstruction, TransactionSignature } from "@solana/web3.js"
import { Keypair, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { token } from "@project-serum/anchor/dist/cjs/utils";
import { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
const CLUSTER_LINK_PROGRAM_ID = new PublicKey("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
export class ClusterLinkSDK {
    private program: Program<ClusterLink>;
    private wallet: Wallet;
    private mainConnection: Connection;
    private devConnection: Connection;

    constructor(
        program: Program<ClusterLink>,
        wallet: Wallet,
        mainConnection: Connection,
        devConnection: Connection
    ) {
        this.program = program;
        this.wallet = wallet;
        this.mainConnection = mainConnection;
        this.devConnection = devConnection;
    }
    
    static async init(
        wallet: Wallet,
        mainConnection: Connection,
        devConnection: Connection
    ): Promise<ClusterLinkSDK> {
        const provider = new AnchorProvider(
            devConnection,
            wallet,
            // new NodeWallet(Keypair.generate()),
            { preflightCommitment: "confirmed", commitment: "confirmed" }
        );
        const program = new Program(IDL, CLUSTER_LINK_PROGRAM_ID, provider);
        return new ClusterLinkSDK(program, wallet, mainConnection, devConnection);
    }

    async copyAllProgramAccounts(
        programId: PublicKey,
    ): Promise<any> {
        const accounts = await this.mainConnection.getProgramAccounts(programId);
        
        return await this.copyMainnetAccounts(accounts.map((account) => account.pubkey));
    }

    async copyMainnetAccounts(
        accounts: PublicKey[],
    ): Promise<Keypair[]> {
        let infos = await ClusterLinkSDK.customGetMultipleAccountInfos(this.mainConnection, accounts);
        let promises = [];
        let copiedAccounts = [];
        for(let i=0; i<accounts.length; i++){
            let accountinfo = infos[i];
            let u8array = Uint8Array.from(accountinfo.account.data);
            let copiedAccount = Keypair.generate();
            copiedAccounts.push(copiedAccount);
            promises.push(
                this.program.methods.initialize(
                    new BN(u8array.length),
                    new BN(accountinfo.account.lamports),
                ).accounts({
                    signer: this.wallet.publicKey,
                    account: copiedAccount.publicKey,
                    systemProgram: SystemProgram.programId,
                }).signers(
                    [copiedAccount]
                ).rpc()
            );
        }
        await Promise.all(promises);
        promises = [];
        for(let i=0; i<accounts.length; i++){
            let accountinfo = infos[i];
            let u8array = Uint8Array.from(accountinfo.account.data);
            let copiedAccount = copiedAccounts[i];
            let index = 0;
            while(index < u8array.length){
                let current: Uint8Array;
                if(index + 1024 < u8array.length)
                    current = u8array.slice(index, index + 1024);
                else
                    current = u8array.slice(index, u8array.length);
                let cur: number[] = [];
                for(let j=0; j<current.length; j++)cur.push(current[i]);
                promises.push(
                await this.program.methods.fill(
                    new BN(index),
                    new BN(index + current.length),
                    cur,
                ).accounts({
                    signer: this.wallet.publicKey,
                    account: copiedAccount.publicKey,
                    systemProgram: SystemProgram.programId,
                }).signers(
                    [copiedAccount]
                ).rpc()
                );
                index += 1024;
            }
        }

        await Promise.all(promises);

        return copiedAccounts;
    }

    static async customGetMultipleAccountInfos(
        connection: Connection,
        accounts: PublicKey[],
    ) {
        let promises: any = [];
        let current: PublicKey[] = [];
        for(let i=0; i<accounts.length; i++){
            current.push(accounts[i]);
            if(current.length == 100 || i + 1 == accounts.length){
                promises.push(
                    connection.getMultipleAccountsInfo(current)
                );
                current = [];
            }
        }
        let pro = await Promise.all(promises);
        let results: any = [];
        for(let i=0; i<pro.length; i++){
            for(let j=0; j<pro[i].length; j++)
                results.push({
                    account: pro[i][j],
                    publicKey: accounts[i * 100 + j]
                });
        }
        return results;
    }
}