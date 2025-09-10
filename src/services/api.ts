import type {ProfileData} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function searchAccount(
    server: string,
    gameName: string,
    tagLine: string
): Promise<ProfileData> {

    const response = await fetch(
        `${API_BASE_URL}/api/profile/${server}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
    );

    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
}