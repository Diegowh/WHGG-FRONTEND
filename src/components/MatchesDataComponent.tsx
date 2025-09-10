import type {MatchData} from "../types";
import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

export const MatchesDataComponent: React.FC<{
    data: MatchData[] | null;
    loading: boolean;
    error: string | null;
    minMatches?: number;
}> = ({ data, loading, error, minMatches = 20 }) => {
    // Show loading if still loading OR if we have data but less than minimum matches
    const isStillLoading = loading || (data && data.length > 0 && data.length < minMatches);
    
    if (isStillLoading) {
        const currentCount = data?.length || 0;
        
        return (
            <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-center space-x-3 py-8">
                    <LoadingSpinner size="lg" />
                    <div className="text-gray-300">
                        {currentCount > 0 
                            ? `Loading matches... ${currentCount}/${minMatches}` 
                            : 'Loading matches...'
                        }
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Match History</h2>
            {data && data.length > 0 ? (
                <div className="space-y-2">
                    {data.map((match, index) => (
                        <div key={index} className="bg-gray-700 rounded flex overflow-hidden">
                            {/* Victory/Defeat indicator bar */}
                            <div className={`w-1 ${match.participantWon ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            
                            {/* Match content */}
                            <div className="p-3 flex-1">
                                <p className="text-white font-medium">
                                    Champion ID: {match.championId}
                                </p>
                                <p className="text-sm text-gray-300">
                                    KDA: {match.kills}/{match.deaths}/{match.assists}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400">No matches yet</p>
            )}
        </div>
    );
};