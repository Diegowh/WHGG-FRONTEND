import React from "react";
import type {ChampionStatsData} from "../types";

export const ChampionStatsComponent: React.FC<{
    data: ChampionStatsData[] | null;
    loading: boolean;
    error: string | null;
}> = ({ data, loading, error }) => {
    if (loading) {
        return (
            <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="grid grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-700 rounded"></div>
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
            <h2 className="text-xl font-bold text-white mb-4">Champion Statistics</h2>
            {data && data.length > 0 ? (
                <div className="space-y-3">
                    {data.slice(0, 5).map((champion, index) => (
                        <div key={index} className="bg-gray-700 p-4 rounded">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-white font-semibold">
                                        {champion.championName || `Champion ID: ${champion.championId}`}
                                    </h3>
                                    <p className="text-gray-300">KDA: {champion.kda?.toFixed(2) || 'N/A'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white">{champion.winrate ? `${Math.round(champion.winrate * 100)}%` : 'N/A'}</p>
                                    <p className="text-sm text-gray-400">{champion.totalGames || 0} games</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400">No champion data yet</p>
            )}
        </div>
    );
};