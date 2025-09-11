import React from "react";
import type {LeagueEntryData} from "../types";

export const  RankedStats: React.FC<{
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


    const soloQueueData = data?.find(entry => 
        entry.queueType === 'RANKED_SOLO_5x5' || 
        entry.queueType?.includes('SOLO') ||
        entry.queueType?.toLowerCase().includes('solo')
    );
    const flexQueueData = data?.find(entry => 
        entry.queueType === 'RANKED_FLEX_SR' || 
        entry.queueType?.includes('FLEX') ||
        entry.queueType?.toLowerCase().includes('flex')
    );
    
    const renderQueueCard = (queueData: LeagueEntryData | undefined, queueName: string) => (
        <div className="bg-gray-700 p-4 rounded">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-white font-semibold">{queueName}</h3>
                    {queueData ? (
                        <p className="text-gray-300">{queueData.tier} {queueData.rank}</p>
                    ) : (
                        <p className="text-gray-400">Unranked</p>
                    )}
                </div>
                <div className="text-right">
                    {queueData ? (
                        <>
                            <p className="text-white">{queueData.leaguePoints} LP</p>
                            <p className="text-sm text-gray-400">
                                {queueData.wins}W / {queueData.losses}L ({Math.round(queueData.winRatio || 0)}%)
                            </p>
                        </>
                    ) : (
                        <p className="text-gray-400">0 LP</p>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Ranked Stats</h2>
            <div className="space-y-3">
                {renderQueueCard(soloQueueData, "Ranked Solo")}
                {renderQueueCard(flexQueueData, "Ranked Flex")}
            </div>
        </div>
    );
}