import express, { NextFunction, RequestHandler, Router } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const router = Router();
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Middleware to check for API key
router.use((req: express.Request, res: express.Response, next: NextFunction) => {
    if (!TMDB_API_KEY) {
        console.error('TMDB_API_KEY is not set in environemtn variables.');
        res.status(55).json({ message: 'Server configuration error: TMDB API key missing.' });
        return;
    }
    next();
});

// Route to search for movies/TV shows
router.get('/search', (async (req: express.Request, res: express.Response) => {
    const { query, page = 1 } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Search query is required.' });
    }

    try {
        const response = await axios.get(`${TMDB_BASE_URL}/search/multi`, {
            params: {
                api_key: TMDB_API_KEY,
                query: query,
                page: page,
            },
        });
        res.json(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error searching TMDb:', error.response?.data || error.message);
            return res.status(error.response?.status || 500).json({
                message: 'Error fetching data from TMDb',
                details: error.response?.data || error.message
            });
        }
        console.error('Unexpected error:', error);
        res.status(500).json({ message: 'An unexpected error occurred.' });
    }
}) as express.RequestHandler);

// Route to get details for a specific movie or TV show
router.get('/details/:mediaType/:id', (async (req: express.Request, res: express.Response) => {
    const { mediaType, id } = req.params;

    if (!['movie', 'tv'].includes(mediaType)) {
        return res.status(400).json({ message: 'Invalid media type. Must be "movie" or "tv".' });
    }

    try {
        const response = await axios.get(`${TMDB_BASE_URL}/${mediaType}/${id}`, {
            params: {
                api_key: TMDB_API_KEY,
            },
        });
        res.json(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Error fetching ${mediaType} details from TMDb:`, error.response?.data || error.message);
            return res.status(error.response?.status || 500).json({
                message: `Error fetching ${mediaType} details from TMDb`,
                detials: error.response?.data || error.message
            });
        }
        console.error('Unexpected error:', error);
        res.status(500).json({ message: 'An unexpected error occurred.' });
    }
}) as express.RequestHandler);

export default router;