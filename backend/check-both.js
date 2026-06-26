import { Connection, Keypair } from '@solana/web3.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function checkKeypair(name, filename) {
  try {
    const keypairPath = join(__dirname, filename);
    const sk = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'));
    
    console.log(`\n=== ${name} ===`);
    console.log('Bytes:', sk.length);
    
    const kp = Keypair.fromSecretKey(Uint8Array.from(sk));
    console.log('Public Key:', kp.publicKey.toBase58());
    
    const conn = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
    const balance = await conn.getBalance(kp.publicKey);
    console.log('Balance:', balance / 1e9, 'SOL');
    
    if (balance === 0) {
      console.log('Status: ❌ 0 SOL');
    } else if (Math.abs((balance / 1e9) - 0.0288) < 0.001) {
      console.log('Status: ✅ MATCH! Your tx-stack keypair!');
    } else {
      console.log('Status: ⚠️ Different keypair');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function main() {
  console.log('🔍 Checking both keypairs on mainnet...\n');
  await checkKeypair('Keypair 1 (213,3,46...)', '../keypairs/keypair1.json');
  await checkKeypair('Keypair 2 (69,199,65...)', '../keypairs/keypair2.json');
  console.log('\n✅ Done!');
}

main();
