import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {type SearchFormData} from "../types";
import {SERVERS} from "../constants/servers";
import { searchAccount } from '../services/api';


const Home: React.FC = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<SearchFormData>({
        gameName: '',
        tagLine: '',
        server: 'euw1'
    });


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
            const data = await searchAccount(
                formData.server,
                formData.gameName.trim(),
                formData.tagLine.trim(),
            );

            navigate('/profile', {
                state: { 
                    profileData: data,
                    searchParams: {
                        server: formData.server,
                        gameName: formData.gameName.trim(),
                        tagLine: formData.tagLine.trim()
                    }
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

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
            {/* Logo */}
            <div className="mb-8">
                <h1 className="text-8xl font-bold text-white mb-2">WHGG</h1>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="w-full max-w-2xl">
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
            </form>


        </div>
    );
};

export default Home;