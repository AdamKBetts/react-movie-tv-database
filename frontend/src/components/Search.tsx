import React, { useState } from 'react';
import axios from 'axios';

interface MediaResult {
    id: number;
    title?: string;
    name?: string;
    media_type: 'movie' | 'tv' | 'person';
    poster_path?: string;
    release_date?: string;
    first_air_date?: string;
    overview: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

const Search: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<MediaResult[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResults([]);

        if (!query.trim()) {
            setError('Please enter a search query.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/search`, {
                params: { query },
            });

            const filteredResults = response.data.results.filter(
                (item: MediaResult) => item.media_type === 'movie' || item.media_type === 'tv'
            );
            setResults(filteredResults);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'An error occurred during search.');
            } else {
                setError('An unexpected error occurred.');
            }
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for movies or TV shows..."
                    className="search-input"
                />
                <button type="submit" className="search-button" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && <p className="error-message">{error}</p>}

            <div className="resilts-grid">
                {results.length > 0 ? (
                    results.map((item) => (
                        <div key={item.id} className="result-item">
                            {item.poster_path ? (
                                <img
                                    src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                                    alt={item.title || item.name}
                                    className="result-poster"
                                />
                            ) : (
                                <div className="no-poster">No Poster Available</div>
                            )}
                            <h3 className="result-title">{item.title || item.name} ({item.media_type === 'movie' ? 'Movie' : 'TV'})</h3>
                            <p className="result-overview">{item.overview ? `${item.overview.substring(0, 150)}...` : 'No overview available.'}</p>
                            <p className="result-release">
                                {item.media_type === 'movie'
                                    ? `Release: ${item.release_date || 'N/A'}`
                                    : `First Air: ${item.first_air_date || 'N/A'}`}
                            </p>
                        </div>
                    ))
                ) : (
                    !loading && !error && query.trim() && <p>No results found.</p>
                )}
            </div>
        </div>
    );
};

export default Search;