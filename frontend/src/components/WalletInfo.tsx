import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react-ui';
import { Keypair } from '@solana/web3.js';

interface WalletInfoProps {
  onWalletChange?: () => void;
}

export const WalletInfo: React.FC<WalletInfoProps> = ({ onWalletChange }) => {
  const { publicKey, connected, disconnect, wallet } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch balance when connected
  useEffect(() => {
    if (!connected || !publicKey) {
      setBalance(0);
      return;
    }

    const fetchBalance = async () => {
      try {
        const bal = await connection.getBalance(publicKey);
        setBalance(bal / 1e9);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 5000); // Refresh every 5s

    return () => clearInterval(interval);
  }, [connected, publicKey, connection]);

  // Copy public key to clipboard
  const copyAddress = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Generate QR code URL (using a simple API)
  const qrCodeUrl = publicKey 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${publicKey.toBase58()}`
    : '';

  if (!connected || !publicKey) {
    return (
      <div className="p-6 bg-secondary/20 rounded-lg text-center">
        <p className="text-gray-400 mb-4">Connect wallet to view details</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-secondary/20 rounded-lg space-y-4">
      {/* Wallet Name */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {wallet?.icon && (
            <img src={wallet.icon} alt={wallet.name} className="w-6 h-6" />
          )}
          <span className="text-white font-semibold">{wallet?.name || 'Wallet'}</span>
        </div>
        <button
          onClick={async () => {
            await disconnect();
            onWalletChange?.();
          }}
          className="text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          Disconnect
        </button>
      </div>

      {/* Balance */}
      <div className="text-center py-4">
        <div className="text-3xl font-bold text-white">
          {balance.toFixed(4)} SOL
        </div>
        <div className="text-sm text-gray-400 mt-1">
          ≈ ${(balance * 20).toFixed(2)} USD
        </div>
      </div>

      {/* Public Key */}
      <div className="space-y-2">
        <label className="text-xs text-gray-400 uppercase font-semibold">
          Public Key (Address)
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={publicKey.toBase58()}
            readOnly
            className="flex-1 bg-dark border border-gray-700 rounded px-3 py-2 text-sm text-gray-300 font-mono"
          />
          <button
            onClick={copyAddress}
            className="px-3 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded transition-colors"
            title="Copy address"
          >
            {copied ? '✓' : '📋'}
          </button>
        </div>
        {copied && (
          <div className="text-xs text-green-400">Address copied!</div>
        )}
      </div>

      {/* QR Code */}
      <div className="text-center">
        <label className="text-xs text-gray-400 uppercase font-semibold block mb-2">
          Receive SOL
        </label>
        <img 
          src={qrCodeUrl} 
          alt="QR Code" 
          className="mx-auto w-32 h-32 border-2 border-primary rounded-lg"
        />
        <p className="text-xs text-gray-500 mt-2">
          Scan to send SOL to this wallet
        </p>
      </div>

      {/* Network Info */}
      <div className="pt-4 border-t border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Network:</span>
          <span className="text-white">
            {connection.rpcEndpoint.includes('devnet') ? 'Devnet' : 
             connection.rpcEndpoint.includes('testnet') ? 'Testnet' : 'Mainnet'}
          </span>
        </div>
      </div>
    </div>
  );
};
