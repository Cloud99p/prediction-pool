/**
 * Debug: Check All Token Accounts
 * 
 * Shows all derived addresses and checks which ones exist
 * 
 * Usage: npx tsx scripts/debug-token-accounts.ts
 */

import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { 
  TOKEN_PROGRAM_ID, 
  TOKEN_2022_PROGRAM_ID, 
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync 
} from "@solana/spl-token";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Mainnet Configuration
const TXL_TOKEN_MINT = new PublicKey("Zhw9TVKp68a1QrftncMSd6ELXKDtpVMNuMGr1jNwdeL");
const RPC_URL = "https://api.mainnet-beta.solana.com";

async function main() {
  console.log("🔍 Debug: Token Account Checker");
  console.log("=".repeat(60));

  // Load wallet
  const keypairPath = process.env.ANCHOR_WALLET || path.join(__dirname, "../keypairs/mainnet.json");
  
  if (!fs.existsSync(keypairPath)) {
    console.error(`❌ Wallet not found at: ${keypairPath}`);
    process.exit(1);
  }

  const secretKey = JSON.parse(fs.readFileSync(keypairPath, "utf-8"));
  const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKey));
  
  console.log(`📝 Wallet: ${wallet.publicKey.toBase58()}`);

  // Connect
  const connection = new Connection(RPC_URL, "confirmed");

  console.log("\n📍 Deriving Token Accounts:");
  console.log("-".repeat(60));

  // Method 1: Using TOKEN_2022_PROGRAM_ID (what subscription script uses)
  const ata2022 = getAssociatedTokenAddressSync(
    TXL_TOKEN_MINT,
    wallet.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  console.log(`\n1. TOKEN_2022 (subscription script):`);
  console.log(`   ${ata2022.toBase58()}`);
  const info2022 = await connection.getAccountInfo(ata2022);
  console.log(`   Exists: ${!!info2022}`);

  // Method 2: Using TOKEN_PROGRAM_ID (legacy)
  const ataLegacy = getAssociatedTokenAddressSync(
    TXL_TOKEN_MINT,
    wallet.publicKey,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  console.log(`\n2. TOKEN_PROGRAM_ID (legacy):`);
  console.log(`   ${ataLegacy.toBase58()}`);
  const infoLegacy = await connection.getAccountInfo(ataLegacy);
  console.log(`   Exists: ${!!infoLegacy}`);

  // Method 3: anchor.utils.token.associatedAddress (what subscribe script uses)
  const anchorAta = await import("@coral-xyz/anchor");
  const ataAnchor = await anchorAta.utils.token.associatedAddress({
    mint: TXL_TOKEN_MINT,
    owner: wallet.publicKey,
  });
  console.log(`\n3. anchor.utils.token.associatedAddress:`);
  console.log(`   ${ataAnchor.toBase58()}`);
  const infoAnchor = await connection.getAccountInfo(ataAnchor);
  console.log(`   Exists: ${!!infoAnchor}`);

  // Check all token accounts owned by this wallet
  console.log(`\n📊 All Token Accounts for this wallet:`);
  console.log("-".repeat(60));
  
  const allAccounts = await connection.getTokenAccountsByOwner(wallet.publicKey, {
    programId: TOKEN_2022_PROGRAM_ID,
  });
  
  if (allAccounts.value.length === 0) {
    console.log("   No TOKEN_2022 accounts found");
  } else {
    allAccounts.value.forEach((account, i) => {
      const pubkey = account.pubkey.toBase58();
      console.log(`   [${i}] ${pubkey}`);
      if (pubkey === ata2022.toBase58()) {
        console.log(`       ↑ This is our derived ATA!`);
      }
    });
  }

  // Also check legacy token program
  const legacyAccounts = await connection.getTokenAccountsByOwner(wallet.publicKey, {
    programId: TOKEN_PROGRAM_ID,
  });
  
  if (legacyAccounts.value.length > 0) {
    console.log(`\n   Legacy TOKEN_PROGRAM accounts:`);
    legacyAccounts.value.forEach((account, i) => {
      const pubkey = account.pubkey.toBase58();
      console.log(`   [${i}] ${pubkey}`);
      if (pubkey === ataLegacy.toBase58()) {
        console.log(`       ↑ This is our legacy ATA!`);
      }
    });
  }

  console.log("\n" + "=".repeat(60));
  console.log("💡 CONCLUSION:");
  console.log("-".repeat(60));
  
  if (info2022) {
    console.log("✅ TOKEN_2022 account exists - use this for subscription");
  } else if (infoLegacy) {
    console.log("✅ Legacy account exists - script might be using wrong program");
  } else if (infoAnchor) {
    console.log("✅ Anchor-derived account exists - use this");
  } else {
    console.log("❌ No token account exists - need to create one!");
    console.log("\n   Run: npx tsx scripts/create-token-account.ts");
  }
}

main().catch(console.error);
