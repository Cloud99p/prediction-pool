#!/usr/bin/env node

/**
 * TxLINE Subscription Script
 * Subscribe to World Cup Premium Tier (FREE for hackathon)
 */

import { Connection, Keypair, Transaction, SystemProgram } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import fs from 'fs';
import axios from 'axios';

// Configuration
const RPC_URL = 'https://api.mainnet-beta.solana.com';
const TXLINE_PROGRAM_ID = '6pW64gN1s2uqjHkn1unFeEjAwJkPGHoppGvS715wyP2J';
const SERVICE_LEVEL_ID = 12; // World Cup Real-time (FREE)

async function subscribe() {
  console.log('🚀 Subscribing to TxLINE World Cup Premium Tier...\n');

  // Load wallet
  const keypairPath = './keypairs/mainnet.json';
  const secretKey = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'));
  const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKey));

  console.log('📝 Wallet:', wallet.publicKey.toBase58());

  // Connect to Solana
  const connection = new Connection(RPC_URL, 'confirmed');

  // Check balance
  const balance = await connection.getBalance(wallet.publicKey);
  console.log('💰 Balance:', balance / 1e9, 'SOL\n');

  if (balance === 0) {
    console.log('❌ Wallet has 0 SOL! Need SOL for gas fees.');
    return;
  }

  // Get guest JWT first
  console.log('📋 Step 1: Getting guest JWT...');
  const authResponse = await axios.post('https://txline.txodds.com/auth/guest/start');
  const guestJwt = authResponse.data.token;
  console.log('✅ Guest JWT received\n');

  // For hackathon, you can use guest JWT directly with World Cup endpoints
  // OR activate with on-chain subscription (requires more SOL)
  
  console.log('🎯 Option 1: Use Guest JWT (FREE - No on-chain tx needed)');
  console.log('   - Works for World Cup data during hackathon');
  console.log('   - Limited SSE access');
  console.log('   - Current JWT:', guestJwt.substring(0, 50) + '...\n');

  console.log('🎯 Option 2: Full Premium Activation (Requires on-chain tx)');
  console.log('   - Full SSE streaming access');
  console.log('   - Higher rate limits');
  console.log('   - Contact TxLINE support for activation code\n');

  console.log('📧 For full premium access, contact:');
  console.log('   Email: support@txline.txodds.com');
  console.log('   Discord: https://discord.gg/solanacollective');
  console.log('   Mention: Superteam World Cup Hackathon 2026\n');

  // Save the guest JWT
  const envPath = './.env';
  let envContent = fs.readFileSync(envPath, 'utf-8');
  envContent = envContent.replace(
    /TXLINE_JWT=.*/,
    `TXLINE_JWT=${guestJwt}`
  );
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Guest JWT saved to .env\n');

  console.log('✨ Done! Your backend now has updated JWT!');
  console.log('   Restart backend: npm run dev\n');
}

subscribe().catch(console.error);
