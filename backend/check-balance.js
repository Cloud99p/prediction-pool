import { Connection, Keypair } from '@solana/web3.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function checkBalance() {
  try {
    const keypairPath = join(__dirname, '../keypairs/mainnet.json');
    console.log('Loading keypair from:', keypairPath);
    
    const sk = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'));
    console.log('Keypair bytes:', sk.length);
    
    const kp = Keypair.fromSecretKey(Uint8Array.from(sk));
    console.log('Public Key:', kp.publicKey.toBase58());
    
    const conn = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
    const balance = await conn.getBalance(kp.publicKey);
    console.log('Balance:', balance / 1e9, 'SOL');
    
    if (balance === 0) {
      console.log('\n❌ This keypair has 0 SOL');
    } else if (Math.abs((balance / 1e9) - 0.0288) < 0.001) {
      console.log('\n✅ MATCH! This is your tx-stack keypair (0.0288 SOL)');
    } else {
      console.log('\n⚠️ Different keypair');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkBalance();
