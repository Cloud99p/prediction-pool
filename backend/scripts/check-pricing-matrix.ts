/**
 * Check if pricing_matrix is initialized on mainnet
 * 
 * Usage: npx tsx scripts/check-pricing-matrix.ts
 */

import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

const TXLINE_PROGRAM_ID = new PublicKey("9ExbZjAapQww1vfcisDmrngPinHTEfpjYRWMunJgcKaA");
const RPC_URL = "https://api.mainnet-beta.solana.com";

async function main() {
  console.log("🔍 Checking pricing_matrix on Mainnet");
  console.log("=".repeat(60));

  const connection = new Connection(RPC_URL, "confirmed");

  // Try different PDA derivations
  const possibleSeeds = [
    [Buffer.from("pricing_matrix")],
    [Buffer.from("pricing_matrix"), Buffer.from("free_tier")],
    [Buffer.from("pricing_matrix"), Buffer.from("world_cup")],
  ];

  for (const seeds of possibleSeeds) {
    const [pda, bump] = PublicKey.findProgramAddressSync(seeds, TXLINE_PROGRAM_ID);
    
    console.log(`\n📊 Trying PDA: ${pda.toBase58()}`);
    console.log(`   Seeds: ${JSON.stringify(seeds.map(s => s.toString()))}`);
    console.log(`   Bump: ${bump}`);

    try {
      const accountInfo = await connection.getAccountInfo(pda);
      
      if (accountInfo) {
        console.log(`   ✅ Account EXISTS (${accountInfo.data.length} bytes)`);
        console.log(`   Owner: ${accountInfo.owner.toBase58()}`);
        
        // Try to decode the account data
        if (accountInfo.data.length > 0) {
          console.log(`   Data (first 100 bytes): ${accountInfo.data.slice(0, 100).toString('hex')}`);
        }
      } else {
        console.log(`   ❌ Account does NOT exist`);
      }
    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  // Also check the program itself
  console.log("\n" + "=".repeat(60));
  console.log("📊 Checking TxLINE Program:");
  const programInfo = await connection.getAccountInfo(TXLINE_PROGRAM_ID);
  if (programInfo) {
    console.log(`   ✅ Program exists (${programInfo.data.length} bytes)`);
  } else {
    console.log(`   ❌ Program not found!`);
  }
}

main().catch(console.error);
