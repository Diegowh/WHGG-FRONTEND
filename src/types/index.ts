
export interface SearchFormData {
    gameName: string;
    tagLine: string;
    server: string;
}

export interface AccountData {
    puuid: string;
    gameName: string;
    tagLine: string;
    summonerLevel: number;
    profileIconId: number;
}

export interface ChampionStatsData {

    championId: number;
    championName: string;
    kda: number;
    killAvg: number;
    deathAvg: number;
    assistAvg: number;
    winrate: number;
    totalGames: number;
}


export interface ProfileData {
    puuid: string;
    gameName: string;
    tagLine: string;
    profileIconId: number;
    summonerLevel: number;
    lastUpdated: string;
}

export const SERVERS = [
    { value: 'euw1', label: 'EUW' },
    { value: 'eun1', label: 'EUNE' },
    { value: 'na1', label: 'NA' },
    { value: 'br1', label: 'BR' },
    { value: 'ru', label: 'RU' },
    { value: 'kr', label: 'KR' },
    { value: 'jp1', label: 'JP' },
    { value: 'tw2', label: 'TW' },
    { value: 'tr1', label: 'TR' },
    { value: 'ph2', label: 'PH' },
    { value: 'vn2', label: 'VN' },
    { value: 'la1', label: 'LAN' },
    { value: 'la2', label: 'LAS' },
    { value: 'oc1', label: 'OC' },
    { value: 'sg2', label: 'SG' },
    { value: 'th2', label: 'TH' },
] as const;

export type ServerValue = typeof SERVERS[number]['value'];