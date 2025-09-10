import React from "react";
import type {LeagueEntryData} from "../types";

export const  LeagueEntriesDataComponent: React.FC<{
    data: LeagueEntryData[] | null;
    loading: boolean;
    error: string | null;
}> = ({ data, loading, error }) => {
    if (loading) {
        return (
            <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-20 bg-gray-700 rounded"></div>
            </div>
        )
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
            <h2 className="text-xl font-bold text-white mb-4">Ranked Stats</h2>
            {data && data.length > 0 ? (
                <div className="space-y-3">
                    {data.map((entry, index) => (
                        <div key={index} className="bg-gray-700 p-4 rounded">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-white font-semibold">{entry.queueType}</h3>
                                    <p className="text-gray-300">{entry.tier} {entry.rank}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white">{entry.leaguePoints} LP</p>
                                    <p className="text-sm text-gray-400">
                                        {entry.wins}W / {entry.losses}L ({Math.round(entry.winRatio)}%)
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400">No ranked data yet</p>
            )}
        </div>
    );
}