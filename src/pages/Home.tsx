import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {type SearchFormData} from "../types";
import {SERVERS} from "../constants/servers";
import { searchAccount } from '../services/api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useRecentSearches, type RecentSearch } from '../hooks/useRecentSearches';


const Home: React.FC = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showRecentSearches, setShowRecentSearches] = useState(false);
    
    const [formData, setFormData] = useLocalStorage<SearchFormData>('whgg-form-data', {
        gameName: '',
        tagLine: '',
        server: 'euw1'
    });
    
    const { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } = useRecentSearches();


    const handleInputChange = (

        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {

        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // para limpiar el error al escribir
        if (error) setError(null);
        
        // Hide recent searches when user starts typing
        if (showRecentSearches) setShowRecentSearches(false);
    };

    const validateForm = (): boolean => {
        if (!formData.gameName.trim()) {

            setError("Game name is required");
            return false;
        }

        if (!formData.tagLine.trim()) {
            setError("Tag Line is required");
            return false;
        }

        if (formData.tagLine.includes('#')) {
            setError("TagLine shouldn't include #");
            return false;
        }

        if (formData.tagLine.length < 2 || formData.tagLine.length > 5) {

            setError("Tag line must be between 2 and 5 characters")
            return false;
        }

        return true;
    }

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        if (!validateForm()) {
            return
        }

        setLoading(true);
        setError(null);

        try {
            const searchData = {
                server: formData.server,
                gameName: formData.gameName.trim(),
                tagLine: formData.tagLine.trim()
            };
            
            const data = await searchAccount(
                searchData.server,
                searchData.gameName,
                searchData.tagLine,
            );
            
            // Add to recent searches on successful search
            addRecentSearch(searchData);

            navigate(`/profile/${searchData.server}/${searchData.gameName}-${searchData.tagLine}/overview`, {
                state: { 
                    profileData: data,
                    searchParams: searchData
                }
            });
        } catch (err) {
            console.error('Search failed: ', err);

            if (err instanceof Error) {
                if (err.message.includes('404')) {
                    setError(`Player "${formData.gameName}#${formData.tagLine}" not found on ${formData.server.toUpperCase()}`);
                } else if (err.message.includes('network')) {
                    setError('Connection error. Please try again.');
                } else {
                    setError('Search failed 🥀🥀');
                }

            } else {
                setError('An unexpected error occurred');
            }

        } finally {
            setLoading(false);
        }
    }


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {

        if (e.key === 'Enter') {
            e.preventDefault();
            const form = e.currentTarget.form;
            if (form) {
                const inputs = Array.from(form.elements) as HTMLElement[];
                const index = inputs.indexOf(e.currentTarget);

                if (index < inputs.length - 2) { // -2 porque el último es el botón
                    const nextInput = inputs[index + 1] as HTMLInputElement;
                    nextInput?.focus();
                } else {
                    handleSubmit(e as never);
                }
            }
        }
    };
    
    const handleRecentSearchClick = (search: RecentSearch) => {
        setFormData({
            gameName: search.gameName || '',
            tagLine: search.tagLine || '',
            server: search.server || 'euw1'
        });
        setShowRecentSearches(false);
        if (error) setError(null);
    };
    
    const handleInputFocus = () => {
        if (recentSearches.length > 0) {
            setShowRecentSearches(true);
        }
    };
    
    const handleInputBlur = () => {
        // Use a small delay to allow clicking on recent search items
        setTimeout(() => {
            setShowRecentSearches(false);
        }, 150);
    };
    
    const getServerLabel = (serverValue: string) => {
        return SERVERS.find(s => s.value === serverValue)?.label || serverValue.toUpperCase();
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
            {/* Logo */}
            <div className="mb-8">
                <h1 className="text-8xl font-bold text-white mb-2">WHGG</h1>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="w-full max-w-2xl relative">
                <div className="flex items-center bg-gray-800 rounded-lg p-2 shadow-lg">
                    {/* Game Name */}
                    <input
                        type="text"
                        id="gameName"
                        name="gameName"
                        placeholder="Game Name"
                        autoComplete="off"
                        spellCheck="false"
                        autoFocus
                        aria-label="Game Name"
                        value={formData.gameName}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        className="flex-1 bg-transparent text-white px-4 py-3 focus:outline-none placeholder-gray-500"
                        disabled={loading}
                        maxLength={16}
                    />

                    <div className="w-px h-8 bg-gray-600"></div>

                    {/* Tag Line */}
                    <input
                        type="text"
                        id="tagLine"
                        name="tagLine"
                        placeholder="Tag Line"
                        autoComplete="off"
                        spellCheck="false"
                        aria-label="Tag Line"
                        value={formData.tagLine}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        className="w-40 bg-transparent text-white px-4 py-3 focus:outline-none placeholder-gray-500"
                        disabled={loading}
                        maxLength={5}
                    />

                    <div className="w-px h-8 bg-gray-600"></div>

                    {/* Server Combobox */}
                    <select
                        id="server"
                        name="server"
                        aria-label="Server"
                        value={formData.server}
                        onChange={handleInputChange}
                        className="appearance-none bg-transparent text-white mx-2 px-4 py-3 focus:outline-none cursor-pointer hover:bg-gray-700 rounded"
                        disabled={loading}
                    >
                        {SERVERS.map(server => (
                            <option key={server.value} value={server.value} className="bg-gray-800">
                                {server.label}
                            </option>
                        ))}
                    </select>

                    {/* Botón buscar */}
                    <button
                        type="submit"
                        disabled={loading || !formData.gameName || !formData.tagLine}
                        className="ml-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Search"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        )}
                    </button>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-lg">
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    </div>
                )}
                
                {/* Recent Searches */}
                {showRecentSearches && recentSearches.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 max-h-60 overflow-y-auto z-10">
                        <div className="flex items-center justify-between p-3 border-b border-gray-700">
                            <h3 className="text-sm font-medium text-gray-300">Recent Searches</h3>
                            <button
                                onClick={clearRecentSearches}
                                className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                            >
                                Clear All
                            </button>
                        </div>
                        <div className="py-1">
                            {recentSearches.map((search) => (
                                <div key={search.id} className="group flex items-center justify-between px-3 py-2 hover:bg-gray-700 cursor-pointer">
                                    <div 
                                        onClick={() => handleRecentSearchClick(search)}
                                        className="flex-1 flex items-center space-x-2 min-w-0"
                                    >
                                        <span className="text-sm text-white truncate">
                                            {search.gameName}#{search.tagLine}
                                        </span>
                                        <span className="text-xs text-gray-400 px-2 py-1 bg-gray-600 rounded">
                                            {getServerLabel(search.server || '')}
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeRecentSearch(search.id);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all p-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </form>


        </div>
    );
};

export default Home;