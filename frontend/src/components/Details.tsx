import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/Details.css';

interface Genre {
    id: number;
    name: string;
}

interface ProductionCompany {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
}

interface Language {
    english_name: string;
    iso_639_1: string;
    name: string;
}

interface MediaDetails {
    id: number;
    title?: string;
    name?: string;
    overview?: string;
    poster_path?: string;
    backdrop_path?: string;
    release_date?: string;
    first_air_date?: string;
    runtime?: number;
    episode_run_time?: number[];
    genres?: Genre[];
    vote_average?: number;
    vote_count?: number;
    tagline?: string;
    status?: string;
    production_companies?: ProductionCompany[];
    spoken_languages?: Language[];
    budget?: number;
    revenue?: number;
    homepage?: string;
    number_of_seasons?: number;
    number_of_episodes?: number;
}

const API_BASE_URL = 'http://localhost:5000/api';

const Details: React.FC = () => {
    const { mediaType, id } = useParams<{ mediaType: 'movie' | 'tv', id: string }>();

    const [details, setDetails] = useState<MediaDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            setError(null);
            setDetails(null);

            if (!mediaType || !id || !['movie', 'tv'].includes(mediaType)) {
                setError('Invalid media type or ID.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_BASE_URL}/details/${mediaType}/${id}`);
                setDetails(response.data);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    if (err.response?.status === 404) {
                        setError(`${mediaType === 'movie' ? 'Movie' : 'TV show'} not found.`)
                    } else {
                        setError(err.response?.data?.message || `Error fetching ${mediaType} details.`);
                    }
                } else {
                    setError('An unexpected error occurred.')
                }
                console.error(`Error fetching ${mediaType} details:`, err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [mediaType, id]);

    if (loading) {
        return <div style={{textAlign: 'center', padding: '20px'}}>Loading detials...</div>;
    }

    if (error) {
        return <div className="error-message" style={{textAlign: 'center', padding: '20px', color: 'red'}}>Error: {error}</div>;
    }

    if (!details) {
        return <div style={{textAlign: 'center', padding: '20px'}}>Select a movie or TV show to see details.</div>;
    }

    const title = details.title || details.name;
    const releaseOrAirDate = details.release_date || details.first_air_date;
    const runtimeDisplay = details.runtime ? `${details.runtime} minutes` : (details.episode_run_time && details.episode_run_time.length > 0 ? `${details.episode_run_time[0]} minutes/episode` : 'N/A');

    return (
        <div className="details-container">
            {details.backdrop_path && (
                <div className="backdrop" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w1280${details.backdrop_path})` }}></div>
            )}
            <div className="details-content">
                <div className="poster-section">
                    {details.poster_path ? (
                        <img
                            src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                            alt={title}
                            className="details-poster"
                        />
                    ) : (
                        <div className="no-poster-details">No Poster Available</div>
                    )}
                </div>
                <div className="info-section">
                    <h2>{title}</h2>
                    {details.tagline && <p className="tagline">{details.tagline}</p>}
                    <p><strong>Type:</strong> {mediaType === 'movie' ? 'Movie' : 'TV Show'}</p>

                    {releaseOrAirDate && (
                        <p><strong>Release/First air Date:</strong> {releaseOrAirDate}</p>
                    )}

                    {runtimeDisplay !== 'N/A' && (
                        <p><strong>Runtime:</strong> {runtimeDisplay}</p>
                    )}

                    {details.vote_average !== undefined && details.vote_average !== null && (
                        <p><strong>Rating:</strong> {details.vote_average.toFixed(1)} / 10 ({details.vote_count} votes)</p>
                    )}

                    {details.genres && details.genres.length > 0 && (
                        <p><strong>Genres:</strong> {details.genres.map(g => g.name).join(', ')}</p>
                    )}

                    {details.spoken_languages && details.spoken_languages.length > 0 && (
                        <p><strong>Languages:</strong> {details.spoken_languages.map(lang => lang.english_name).join(', ')}</p>
                    )}

                    {details.production_companies && details.production_companies.length > 0 && (
                        <p><strong>Production:</strong> {details.production_companies.map(company => company.name).join(', ')}</p>
                    )}

                    {details.status && <p><strong>Status:</strong> {details.status}</p>}

                    {mediaType === 'tv' && details.number_of_seasons && (
                        <p><strong>Seasons:</strong> {details.number_of_seasons}</p>
                    )}

                    {mediaType === 'tv' && details.number_of_episodes && (
                        <p><strong>Total Episodes:</strong> {details.number_of_episodes}</p>
                    )}

                    <p className="overview"><strong>Overview:</strong> {details.overview || 'No overview available.'}</p>

                    {details.homepage && (
                        <p><strong>Homepage:</strong> <a href={details.homepage} target="_blank" rel="noopener noreferrer">{details.homepage}</a></p>
                    )}

                    {mediaType === 'movie' && details.budget != null && details.budget > 0 && (
                        <p><strong>Budget:</strong> ${details.budget.toLocaleString()}</p>
                    )}

                    {mediaType === 'movie' && details.revenue != null && details.revenue > 0 && (
                        <p><strong>Revenue:</strong> ${details.revenue.toLocaleString()}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Details;