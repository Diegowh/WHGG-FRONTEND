import React from "react";
import type {AccountData} from "../types";

interface AccountDataComponentProps {
    data: AccountData | null;
    loading?: boolean;
    error?: string | null;
}

export const PlayerProfile: React.FC<AccountDataComponentProps> = ({ data, loading, error }) => {

    if (error) {
        return (
            <div className="bg-gray-800 rounded-lg p-6">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-red-400 mb-2">Error loading profile</h2>
                    <p className="text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-gray-800 rounded-lg p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <h1 className="text-3xl font-bold text-white mb-2">
                {data.gameName} #{data.tagLine}
            </h1>
            <p className="text-gray-400">Level {data.summonerLevel}</p>
        </div>
    );
};