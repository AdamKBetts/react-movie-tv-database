import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './routes/api';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON request bodies (for future POST/PUT requests if we add them)
app.use(express.json());

// Basic route to test the server
app.get('/', (req: Request, res: Response) => {
    res.send('Movie/TV Database Backend API is running!');
});

// Mount the API router under the /api path
app.use('/api', apiRoutes);

// Error Handling
app.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).send('Something broke on the server!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Access search API at http://localhost:${PORT}/api/search?query=inception`);
    console.log(`Access details API at http://localhost:${PORT}/api/details/movie/27205`);
});