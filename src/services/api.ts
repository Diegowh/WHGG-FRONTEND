import type {AccountData, LeagueEntryData, ChampionStatsData, MatchData } from "../types";

const API_BASE_URL = 'http://localhost:8080/api';

export async function searchAccount(
    server: string,
    gameName: string,
    tagLine: string
): Promise<AccountData> {

    const response = await fetch(
        `${API_BASE_URL}/v1/account/${server.toLowerCase()}/${encodeURIComponent(gameName.toLowerCase())}-${encodeURIComponent(tagLine.toLowerCase())}`
    );

    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
}

export const fetchLeagueEntries = async (
    server: string,
    gameName: string,
    tagLine: string
): Promise<LeagueEntryData[]> => {
    const response = await fetch(
        `${API_BASE_URL}/v1/ranked/${server.toLowerCase()}/${encodeURIComponent(gameName.toLowerCase())}-${encodeURIComponent(tagLine.toLowerCase())}`
    )

    if (!response.ok) {
        throw new Error(`Failed to fetch league entries ${response.status}: ${response.statusText}`);
    }

    return response.json();
};

export const fetchChampionStats = async (
    gameName: string,
    tagLine: string
): Promise<ChampionStatsData[]> => {

    const response = await fetch(
        `${API_BASE_URL}/v1/champion/stats/${encodeURIComponent(gameName.toLowerCase())}-${encodeURIComponent(tagLine.toLowerCase())}/ranked`
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch champion stats: ${response.statusText}`);
    }

    return response.json();
};


export const fetchMatches = async (
    server: string,
    gameName: string,
    tagLine: string
): Promise<MatchData[]> => {

    const response = await fetch(
        `${API_BASE_URL}/v1/matches/${server.toLowerCase()}/${encodeURIComponent(gameName.toLowerCase())}-${encodeURIComponent(tagLine.toLowerCase())}`
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch matches: ${response.statusText}`);
    }

    return response.json();
};