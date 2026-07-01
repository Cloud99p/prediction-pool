'use client';

import { MatchFixture } from '@/types';
import MatchCard from './MatchCard';

interface MatchListProps {
  matches: MatchFixture[];
  loading: boolean;
  onRefresh: () => void;
}

export default function MatchList({ matches, loading, onRefresh }: MatchListProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Football Matches</h2>
        
        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-600 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading matches...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && matches.length === 0 && (
        <div className="bg-gray-800/50 rounded-lg p-6 text-center">
          <p className="text-gray-400">No matches found</p>
        </div>
      )}

      {/* Match Cards */}
      {!loading && matches.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {matches.map((match) => (
            <MatchCard key={match.fixtureId} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
