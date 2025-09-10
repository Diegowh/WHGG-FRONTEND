
export interface SearchFormData {
    gameName?: string;
    tagLine?: string;
    server?: string;
}

export interface AccountData {
    puuid?: string;
    gameName?: string;
    tagLine?: string;
    summonerLevel?: number;
    profileIconId?: number;
}

export interface ChampionStatsData {
    championId?: number;
    championName?: string;
    kda?: number;
    killAvg?: number;
    deathAvg?: number;
    assistAvg?: number;
    winrate?: number;
    totalGames?: number;
}

export interface MatchData {

    queueId?: number;
    gameEndTime?: number;
    gameDuration?: number;

    participantWon?: boolean;
    championId?: number;
    championLevel?: number;

    summonerSpellIds?: number[];
    runes?: RuneSetData;

    kills?: number;
    deaths?: number;
    assists?: number;

    kda?: number;
    totalMinionsKilled?: number;
    minionsPerMinuteAvg?: number;
    visionScore?: number;

    itemIds?: number[];

    teamComposition?: TeamCompositionData
}

export interface RuneSetData {

    primaryRuneId?: number;
    primaryTreeId?: number;
    secondaryTreeId?: number;
}

export interface TeamCompositionData {

    blueTeam?: TeamData;
    redTeam?: TeamData;
}

export interface TeamData {

    teamNumber?: number;
    participants?: ParticipantData[];
}

export interface ParticipantData {

    puuid?: string;
    gameName?: string;
    tagLine?: string;
    championId?: number;
    individualPosition?: string;
    championLevel?: number;
    kills?: number;
    deaths?: number;
    assists?: number;
    totalMinionsKilled?: number;
    visionScore?: number;
}

export interface LeagueEntryData {

    queueType?: string;
    tier?: string;
    rank?: string;
    leaguePoints?: number;
    wins?: number;
    losses?: number;
    winRatio?: number;
}



