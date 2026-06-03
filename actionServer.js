const express = require('express');
const { PublicKey, Transaction, SystemProgram, Connection } = require('@solana/web3.js');
require('dotenv').config();

const app = express();
app.use(express.json());

// Enable mandatory CORS configurations allowing client wallets to scan endpoints safely
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept-Encoding');
    next();
});

const HOST_URL = process.env.HOST_URL || "https://myblinkapi.dev";

/**
 * Action Metadata Gateway (GET)
 * Returns the compliant payload architecture describing the interaction parameters to the client wallet.
 */
app.get('/api/actions/donate', (req, res) => {
    return res.status(200).json({
        icon: `${HOST_URL}/assets/donation-banner.png`,
        title: "Support Decentralized OSS Builders",
        description: "Contribute native SOL directly to open-source core infrastructure tools.",
        label: "Donate",
        links: {
            actions: [
                { label: "0.1 SOL", href: "/api/actions/donate?amount=0.1" },
                { label: "0.5 SOL", href: "/api/actions/donate?amount=0.5" }
            ]
        }
    });
});

/**
 * Transaction Formulation Endpoint (POST)
 * Dynamically constructs the unsigned transaction layout based on selected parameter options.
 */
app.post('/api/actions/donate', async (req, res) => {
    const { account } = req.body; // The public key of the user wallet interacting with the Blink
    const amount = req.query.amount || "0.1";

    if (!account) {
        return res.status(400).json({ error: "Missing account signature parameter validation" });
    }

    try {
        const userPubKey = new PublicKey(account);
        const destinationPubKey = new PublicKey(process.env.DONATION_DESTINATION_WALLET);
        
        const connection = new Connection(process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com");
        const { blockhash } = await connection.getLatestBlockhash();

        // Assemble the native runtime instruction framework
        const transaction = new Transaction({
            feePayer: userPubKey,
            recentBlockhash: blockhash
        }).add(
            SystemProgram.transfer({
                fromPubkey: userPubKey,
                toPubkey: destinationPubKey,
                lamports: parseFloat(amount) * 1_000_000_000 // Convert SOL parameter settings to Lamports
            })
        );

        // Serialize the un-signed transaction payload structure into a wire-format Base64 string
        const serializedTx = transaction.serialize({ requireAllSignatures: false, verifySignatures: false }).toString('base64');

        return res.status(200).json({
            transaction: serializedTx,
            message: `Thank you for choosing to support open-source development loops!`
        });
    } catch (err) {
        console.error("[Action Blueprint Error]", err.message);
        return res.status(500).json({ error: "Internal transaction formulation failure" });
    }
});

// Support standard preflight options queries
app.options('*', (req, res) => res.sendStatus(200));

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => console.log(`Solana Actions Engine streaming cleanly on port: ${PORT}`));
