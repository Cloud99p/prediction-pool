#!/usr/bin/env node

/**
 * Simple TxLINE JWT Getter
 * No Anchor dependencies - just gets guest JWT
 */

import axios from 'axios';
import fs from 'fs';

async function getJWT() {
  console.log('🚀 Getting TxLINE Guest JWT...\n');

  try {
    // Get guest JWT
    const response = await axios.post('https://txline.txodds.com/auth/guest/start');
    const jwt = response.data.token;
    
    console.log('✅ Guest JWT received!\n');
    console.log('JWT:', jwt);
    console.log('\n---\n');

    // Save to .env
    const envPath = './.env';
    let envContent = fs.readFileSync(envPath, 'utf-8');
    envContent = envContent.replace(
      /TXLINE_JWT=.*/,
      `TXLINE_JWT=${jwt}`
    );
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ JWT saved to .env\n');
    console.log('📋 Next Steps:');
    console.log('1. Restart backend: npm run dev');
    console.log('2. For real-time World Cup data, subscribe on-chain:');
    console.log('   Service Level 12 = Real-time (FREE)');
    console.log('   Service Level 1 = 60s delay (FREE)');
    console.log('3. See: https://txline-docs.txodds.com/documentation/worldcup\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Tip: Check your internet connection and try again.');
  }
}

getJWT();
