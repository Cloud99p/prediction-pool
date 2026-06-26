'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import MatchList from '@/components/MatchList';
import BetSlip from '@/components/BetSlip';
import Header from '@/components/Header';
import { WalletInfo } from '@/components/WalletInfo';
import { ImportWallet } from '@/components/ImportWallet';
import { ExportWallet } from '@/components/ExportWallet';
import { Keypair } from '@solana/web3.js';

export default function Home() {
  const { connected, publicKey, connect, disconnect } = useWallet();
  const [showWalletInfo, setShowWalletInfo] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showExport, setShowExport] = useState(false);

  return (
    <div className="min-h-screen bg-dark">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Match List - Main Content */}
          <div className="lg:col-span-2">
            <MatchList />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Wallet Connection */}
            {!connected ? (
              <div className="p-6 bg-secondary/20 rounded-lg text-center space-y-4">
                <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
                <p className="text-gray-400 text-sm">
                  Connect your Solana wallet to place bets and view your balance
                </p>
                <WalletMultiButton className="!bg-primary !hover:bg-primary-dark !text-white !font-semibold !py-3 !px-6 !rounded-lg" />
                
                <div className="pt-4 border-t border-gray-700">
                  <button
                    onClick={() => setShowImport(true)}
                    className="text-sm text-primary hover:text-primary-light transition-colors"
                  >
                    📥 Import Wallet
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Wallet Info Card */}
                <div className="relative">
                  <WalletInfo onWalletChange={() => setShowWalletInfo(!showWalletInfo)} />
                  
                  {/* Quick Actions */}
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => setShowImport(true)}
                      className="p-2 bg-dark/80 hover:bg-primary/30 rounded text-xs text-gray-300 hover:text-white transition-colors"
                      title="Import Wallet"
                    >
                      📥
                    </button>
                    <button
                      onClick={() => setShowExport(true)}
                      className="p-2 bg-dark/80 hover:bg-primary/30 rounded text-xs text-gray-300 hover:text-white transition-colors"
                      title="Export Wallet"
                    >
                      📤
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bet Slip */}
            <div className="sticky top-8">
              <BetSlip />
            </div>
          </div>
        </div>
      </main>

      {/* Import Wallet Modal */}
      {showImport && (
        <ImportWallet
          onImport={(keypair) => {
            console.log('Wallet imported:', keypair.publicKey.toBase58());
            setShowImport(false);
            // In production: integrate with wallet adapter
          }}
          onCancel={() => setShowImport(false)}
        />
      )}

      {/* Export Wallet Modal */}
      {showExport && (
        <ExportWallet onClose={() => setShowExport(false)} />
      )}
    </div>
  );
}
