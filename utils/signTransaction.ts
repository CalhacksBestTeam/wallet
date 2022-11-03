export {}
const web3 =  require("@solana/web3.js");

export function signTransaction(privateKey : any, transaction : any) {
    const keypair = web3.Keypair.fromSecretKey(privateKey);
    return web3.Transaction.populate({
        ...transaction,
        feePayer: keypair.publicKey,
    }).then((tx : any) => {
        tx.partialSign(keypair);
        return tx.serialize();
    });
}



(async () => {
    // Connect to cluster
    console.log(web3.clusterApiUrl('devnet'))
    const connection = new web3.Connection(
        web3.clusterApiUrl('devnet'),
        'confirmed',
    );
    // Uncomment the below command to test your connection to your node
    //console.log(await connection.getEpochInfo())

    // Generate a new random public key
    const from = web3.Keypair.generate();
    const airdropSignature = await connection.requestAirdrop(
        from.publicKey,
        web3.LAMPORTS_PER_SOL,
    );
    await connection.confirmTransaction(airdropSignature);

    // Generate a new random public key
    const to = web3.Keypair.generate();

    // Add transfer instruction to transaction
    const transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: web3.LAMPORTS_PER_SOL / 100,
        }),
    );

    // Sign transaction, broadcast, and confirm
    const signature = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [from],
    );
    console.log('SIGNATURE', signature);
})();
