import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type {ProfileData} from "../types";

const Profile: React.FC = () => {


    const location = useLocation();
    const navigate = useNavigate();
    const profileData: ProfileData = location.state?.profileData;

    if (!profileData) {

        return (
            <div className="p-8 text-center">

                <h2 className="text-2xl font-bold mb-4">No profile data found</h2>
                <button
                    onClick={() => navigate("/")}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                    Back
                </button>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <button
                onClick={() => navigate('/')}
                className="mb-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
                ← Back to Search
            </button>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    {profileData.gameName}#{profileData.tagLine}
                </h1>

                <div className="space-y-4">
                    <div className="flex items-center">
                        <span className="font-semibold text-gray-700 w-40">Summoner Level:</span>
                        <span className="text-lg font-bold text-blue-600">{profileData.summonerLevel}</span>
                    </div>

                    <div className="flex items-center">
                        <span className="font-semibold text-gray-700 w-40">Profile Icon ID:</span>
                        <span className="text-gray-900">{profileData.profileIconId}</span>
                    </div>

                    <div className="flex items-center">
                        <span className="font-semibold text-gray-700 w-40">Last Updated:</span>
                        <span className="text-gray-900">{formatDate(profileData.lastUpdated)}</span>
                    </div>

                    <div>
                        <span className="font-semibold text-gray-700 block mb-2">PUUID:</span>
                        <code className="bg-gray-200 px-2 py-1 rounded text-xs break-all block">
                            {profileData.puuid}
                        </code>
                    </div>
                </div>

                <details className="mt-6">
                    <summary className="cursor-pointer font-bold text-gray-700 hover:text-gray-900">
                        Raw JSON Data
                    </summary>
                    <pre className="bg-gray-200 p-4 rounded mt-2 overflow-auto text-xs">
            {JSON.stringify(profileData, null, 2)}
          </pre>
                </details>
            </div>
        </div>
    );
};



export default Profile;