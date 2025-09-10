import type {MatchData} from "../types";
import React from "react";

export const MatchesDataComponent: React.FC<{
    data: MatchData[] | null;
    loading: boolean;
    error: string | null;
}> = ({ data, loading, error }) => {
    if (loading) {
        return (
            <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-20 bg-gray-700 rounded"></div>
                    ))}
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
                                    Champion {match.championId}
                                </p>
                                <p className="text-sm text-gray-300">
                                    {match.participantWon ? 'Victory' : 'Defeat'} - 
                                    K/D/A: {match.kills}/{match.deaths}/{match.assists}
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