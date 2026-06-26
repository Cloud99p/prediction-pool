import React, { useState } from 'react';
import { Keypair } from '@solana/web3.js';

interface ImportWalletProps {
  onImport: (keypair: Keypair) => void;
  onCancel: () => void;
}

export const ImportWallet: React.FC<ImportWalletProps> = ({ onImport, onCancel }) => {
  const [privateKey, setPrivateKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const handleImport = () => {
    try {
      // Try different formats
      let secretKey: Uint8Array;

      // Format 1: Base58 string
      try {
        const decoded = bs58.decode(privateKey.trim());
        if (decoded.length === 64) {
          secretKey = decoded;
        } else {
          throw new Error('Invalid key length');
        }
      } catch {
        // Format 2: JSON array
        try {
          const keyArray = JSON.parse(privateKey);
          if (Array.isArray(keyArray) && keyArray.length === 64) {
            secretKey = Uint8Array.from(keyArray);
          } else {
            throw new Error('Invalid JSON array');
          }
        } catch {
          // Format 3: Hex string
          if (privateKey.startsWith('0x')) {
            secretKey = Uint8Array.from(Buffer.from(privateKey.slice(2), 'hex'));
          } else {
            secretKey = Uint8Array.from(Buffer.from(privateKey, 'hex'));
          }
        }
      }

      // Validate the key
      const keypair = Keypair.fromSecretKey(secretKey);
      onImport(keypair);
      setError(null);
    } catch (err: any) {
      setError('Invalid private key format. Please check and try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-secondary rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-white mb-4">Import Wallet</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Private Key (Base58, JSON, or Hex)
            </label>
            <textarea
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              placeholder="Paste your private key here..."
              rows={4}
              className="w-full bg-dark border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm resize-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/50 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handleImport}
              disabled={!privateKey.trim()}
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white rounded transition-colors"
            >
              Import Wallet
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
            >
              Cancel
            </button>
          </div>

          <div className="text-xs text-gray-500">
            <p>⚠️ Never share your private key with anyone!</p>
            <p className="mt-1">Supported formats: Base58, JSON array, Hex</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Base58 decode (for client-side only)
const bs58 = {
  decode: (input: string) => {
    const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const BASE = BigInt(58);
    const buffer = Buffer.from(input, 'utf8');
    let num = BigInt(0);
    for (let i = 0; i < buffer.length; i++) {
      const char = buffer[i];
      num = num * BASE + BigInt(ALPHABET.indexOf(String.fromCharCode(char)));
    }
    const bytes: number[] = [];
    while (num > BigInt(0)) {
      bytes.unshift(Number(num % BigInt(256)));
      num = num / BigInt(256);
    }
    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i] === 49) {
        bytes.unshift(0);
      } else {
        break;
      }
    }
    return Uint8Array.from(bytes);
  }
};
