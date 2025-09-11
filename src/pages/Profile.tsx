import React, {useEffect, useState} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type {AccountData, ChampionStatsData, MatchData, LeagueEntryData} from "../types";
import {PlayerProfile} from "../components/PlayerProfile.tsx";
import {RankedStats} from "../components/RankedStats.tsx";
import {ChampionStats} from "../components/ChampionStats.tsx";
import {MatchHistory} from "../components/MatchHistory.tsx";
import { searchAccount, fetchLeagueEntries, fetchChampionStats, fetchMatches } from "../services/api";

interface LoadingStates {
    account: boolean;
    leagueEntries: boolean;
    championStats: boolean;
    matches: boolean;
}

interface ErrorStates {
    account: string | null;
    leagueEntries: string | null;
    championStats: string | null;
    matches: string| null;

}

interface ProfileData {
    account: AccountData | null;
    leagueEntries: LeagueEntryData[] | null;
    championStats: ChampionStatsData[] | null;
    matches: MatchData[] | null;
}


const Profile: React.FC = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams<{
        server: string;
        riotId: string;
        view: string;
    }>();

    // Extract searchParams from URL params or state
    const searchParams = React.useMemo(() => {
        if (params.server && params.riotId) {
            // Parse riotId format: gameName-tagLine
            const riotIdParts = params.riotId.split('-');
            if (riotIdParts.length >= 2) {
                const tagLine = riotIdParts.pop()!;
                const gameName = riotIdParts.join('-');
                return {
                    server: params.server,
                    gameName,
                    tagLine
                };
            }
        }
        return location.state?.searchParams;
    }, [params, location.state]);

    const initialAccountData = location.state?.profileData;

    const [data, setData] = useState<ProfileData>({
        account: initialAccountData || null,
        leagueEntries: null,
        championStats: null,
        matches: null
    })

    const [loading, setLoading] = useState<LoadingStates>({
        account: !initialAccountData, // True if we need to load account data
        leagueEntries: true,
        championStats: true,
        matches: true
    });

    const [errors, setErrors] = useState<ErrorStates>({
        account: null,
        leagueEntries: null,
        championStats: null,
        matches: null
    });

    useEffect(() => {
        if (!searchParams) {
            return;
        }
        
        // If we don't have account data, load it first
        if (!initialAccountData) {
            loadAccountData();
        } else {
            // carga los datos asincronamente
            loadLeagueEntries();
            loadChampionStats();
            loadMatches();
        }
    }, []);

    // redirecciona si no hay parámetros válidos
    if (!searchParams) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Invalid profile URL</h2>
                    <button
                        onClick={() => navigate("/")}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Search
                    </button>
                </div>
            </div>
        );
    }
    
    const loadAccountData = async () => {
        try {
            setLoading(prev => ({ ...prev, account: true }));
            setErrors(prev => ({ ...prev, account: null }));
            
            const accountData = await searchAccount(
                searchParams.server,
                searchParams.gameName,
                searchParams.tagLine
            );
            
            setData(prev => ({ ...prev, account: accountData }));
            
            // Once account data is loaded, load other data
            loadLeagueEntries();
            loadChampionStats();
            loadMatches();
            
        } catch (error) {
            setErrors(prev => ({ ...prev, account: 'Failed to load account data' }));
            console.error(error);
        } finally {
            setLoading(prev => ({ ...prev, account: false }));
        }
    };

    const loadLeagueEntries = async () => {
        try {
            setLoading(prevState => ({ ...prevState, leagueEntries: true}));
            setErrors(prevState => ({ ...prevState, leagueEntries: null}));
            
            const leagueData = await fetchLeagueEntries(
                searchParams.server,
                searchParams.gameName,
                searchParams.tagLine
            );
            
            setData(prevState => ({ ...prevState, leagueEntries: leagueData }));

        } catch (error) {
            setErrors(prevState => ({ ...prevState, leagueEntries: "Failed to load league entries"}));
            console.error(error);
        } finally {
            setLoading(prevState => ({ ...prevState, leagueEntries: false}));
        }
    };

    const loadChampionStats = async () => {
        try {
            setLoading(prev => ({ ...prev, championStats: true }));
            setErrors(prev => ({ ...prev, championStats: null }));
            
            const champData = await fetchChampionStats(
                searchParams.gameName,
                searchParams.tagLine
            );
            
            setData(prev => ({ ...prev, championStats: champData }));

        } catch (error) {
            setErrors(prev => ({ ...prev, championStats: 'Failed to load champion stats' }));
            console.error(error);
        } finally {
            setLoading(prev => ({ ...prev, championStats: false }));
        }
    };

    const loadMatches = async () => {
        try {
            setLoading(prev => ({ ...prev, matches: true }));
            setErrors(prev => ({ ...prev, matches: null }));
            
            const matchData = await fetchMatches(
                searchParams.server,
                searchParams.gameName,
                searchParams.tagLine
            );
            
            setData(prev => ({ ...prev, matches: matchData }));

        } catch (error) {
            setErrors(prev => ({ ...prev, matches: 'Failed to load matches' }));
            console.error(error);
        } finally {
            setLoading(prev => ({ ...prev, matches: false }));
        }
    };


    return (
        <div className="min-h-screen bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        ← Back
                    </button>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Account Info - Always visible */}
                    <div className="lg:col-span-3">
                        <PlayerProfile
                            data={data.account} 
                            loading={loading.account}
                            error={errors.account}
                        />
                    </div>

                    {/* Left Column */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Ranked Section */}
                        <RankedStats
                            data={data.leagueEntries}
                            loading={loading.leagueEntries}
                            error={errors.leagueEntries}
                        />
                        
                        {/* Champion Stats Section */}
                        <ChampionStats
                            data={data.championStats}
                            loading={loading.championStats}
                            error={errors.championStats}
                        />
                    </div>

                    {/* Matches Section */}
                    <div className="lg:col-span-2">
                        <MatchHistory
                            data={data.matches}
                            loading={loading.matches}
                            error={errors.matches}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};



export default Profile;