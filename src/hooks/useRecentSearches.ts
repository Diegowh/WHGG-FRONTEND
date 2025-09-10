import { useLocalStorage } from './useLocalStorage';
import type {SearchFormData} from '../types';

export interface RecentSearch extends SearchFormData {
  id: string;
  timestamp: number;
}

const MAX_RECENT_SEARCHES = 10;

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useLocalStorage<RecentSearch[]>('whgg-recent-searches', []);

  const addRecentSearch = (search: SearchFormData) => {
    if (!search.gameName || !search.tagLine || !search.server) return;

    const newSearch: RecentSearch = {
      ...search,
      id: `${search.server}-${search.gameName}-${search.tagLine}`,
      timestamp: Date.now()
    };

    const updatedSearches = [
      newSearch,
      ...recentSearches.filter(s => s.id !== newSearch.id)
    ].slice(0, MAX_RECENT_SEARCHES);

    setRecentSearches(updatedSearches);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const removeRecentSearch = (id: string) => {
    setRecentSearches(recentSearches.filter(s => s.id !== id));
  };

  return {
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    removeRecentSearch
  };
}