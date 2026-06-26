import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Keypair } from '@solana/web3.js';

interface ExportWalletProps {
  onClose: () => void;
}

export const ExportWallet: React.FC<ExportWalletProps> = ({ onClose }) => {
  const { wallet } = useWallet();
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  // Note: Most wallet adapters don't expose private keys for security
  // This is a placeholder for wallets that support export
  const handleExport = () => {
    // In production, you'd need to access the actual wallet's private key
    // This depends on the wallet adapter implementation
    alert('For security reasons, private key export is only available for locally-generated wallets.');
  };

  const copyWarning = () => {
    navigator.clipboard.writeText('⚠️ Never share your private key!');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-secondary rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-white mb-4">Export Wallet</h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-red-900/50 rounded border border-red-700">
            <p className="text-red-400 font-semibold mb-2">⚠️ Security Warning!</p>
            <ul className="text-sm text-red-300 space-y-1">
              <li>• Never share your private key with anyone</li>
              <li>• Store it in a secure location</li>
              <li>• Anyone with this key can access your funds</li>
              <li>• We recommend using a hardware wallet for large amounts</li>
            </ul>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleExport}
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded transition-colors"
            >
              Export Private Key
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
            >
              Cancel
            </button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            <p>Only export your private key if you absolutely need to.</p>
            <p className="mt-1">Most users should keep their keys secure in their wallet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
