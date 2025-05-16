import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

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

interface MediaDetails {
    id: number;
    title?: string;
    name?: string;
    media_type?: 'movie' | 'tv';
    overview?: string;
    poster_path?: string;
    backdrop_path?: string;
    release_date?: string;
    first_air_date?: string;
    runtime?: number;
    episode_run_time?: number[];
    genres?: Genre[];
    vote_average?: number;
    tagline?: string;
    status?: string;
    production_companies?: ProductionCompany[];
}

const API_BASE_URL = 'http://localhost:5000/ap';

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
        return <div>Loading detials...</div>;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    if (!details) {
        return <div>No details available.</div>;
    }

    if (!details) {
        return <div>No details available.</div>;
    }

    const title = details.title || details.name;
    const releaseOrAirDate = details.release_date || details.first_air_date;
    const runtime = details.runtime || (details.episode_run_time ? details.episode_run_time[0] : undefined);

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
                    {releaseOrAirDate && <p><strong>Release/First air Date:</strong> {releaseOrAirDate}</p>}
                    {runtime && <p><strong>Runtime:</strong> {runtime} minutes</p>}
                    {details.vote_average !== undefined && details.vote_average !== null && (
                        <p><strong>Rating:</strong> {details.vote_average.toFixed(1)} / 10</p>
                    )}
                    {details.genres && details.genres.length > 0 && (
                        <p><strong>Genres:</strong> {details.genres.map(g => g.name).join(', ')}</p>
                    )}
                    <p className="overview"><strong>Overview:</strong> {details.overview || 'No overview available.'}</p>
                </div>
            </div>
        </div>
    );
};

export default Details;