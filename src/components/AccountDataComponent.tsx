import React from "react";
import type {AccountData} from "../types";

export const AccountDataComponent: React.FC<{ data: AccountData | null }> = ({ data }) => {

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