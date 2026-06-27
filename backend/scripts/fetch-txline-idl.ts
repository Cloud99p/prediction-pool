/**
 * Fetch the latest TxLINE IDL from the program
 * 
 * Usage: npx tsx scripts/fetch-txline-idl.ts
 */

import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

const TXLINE_PROGRAM_ID = new PublicKey("9ExbZjAapQww1vfcisDmrngPinHTEfpjYRWMunJgcKaA");
const RPC_URL = "https://api.mainnet-beta.solana.com";

async function main() {
  console.log("🔍 Fetching TxLINE IDL from Mainnet Program");
  console.log("=".repeat(60));

  const connection = new Connection(RPC_URL, "confirmed");

  // Fetch the program account
  const programAccount = await connection.getAccountInfo(TXLINE_PROGRAM_ID);
  
  if (!programAccount) {
    console.error("❌ Program not found!");
    return;
  }

  console.log(`✅ Program found (${programAccount.data.length} bytes)`);
  console.log(`   Owner: ${programAccount.owner.toBase58()}`);

  // Try to decode the IDL
  try {
    // Anchor programs store IDL at a special address
    const [idlAddress] = PublicKey.findProgramAddressSync(
      [],
      TXLINE_PROGRAM_ID
    );
    
    console.log(`\n📄 Checking IDL address: ${idlAddress.toBase58()}`);
    
    const idlAccount = await connection.getAccountInfo(idlAddress);
    if (idlAccount) {
      console.log(`✅ IDL account exists (${idlAccount.data.length} bytes)`);
      
      // Try to parse the IDL
      const idlData = anchor.IdlAccount.decode(idlAccount.data);
      const idl = anchor.Idl.parse(idlData.data);
      
      console.log("\n📋 IDL Instructions:");
      idl.instructions.forEach((ix: any) => {
        console.log(`\n   ${ix.name}(`);
        ix.args.forEach((arg: any) => {
          console.log(`      ${arg.name}: ${arg.type}`);
        });
        console.log(`   )`);
        
        console.log(`   Accounts:`);
        ix.accounts.forEach((acc: any) => {
          console.log(`      - ${acc.name} (${acc.isMut ? 'mutable' : 'readonly'}, ${acc.isSigner ? 'signer' : 'not signer'})`);
        });
      });
      
      // Save to file
      const fs = await import('fs');
      fs.writeFileSync('./idl/txoracle-latest.json', JSON.stringify(idl, null, 2));
      console.log("\n💾 IDL saved to: ./idl/txoracle-latest.json");
      
    } else {
      console.log("❌ IDL account not found");
      console.log("💡 The program might not be an Anchor program, or IDL is stored elsewhere");
    }
  } catch (error: any) {
    console.error("❌ Error fetching IDL:", error.message);
    console.log("\n💡 Trying alternative method...");
    
    // Check if it's a raw program (not Anchor)
    console.log("\n📊 Program data (first 100 bytes):");
    console.log(programAccount.data.slice(0, 100).toString('hex'));
  }
}

main().catch(console.error);
