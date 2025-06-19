import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import authRoutes from '@/routes/auth.routes';
import bidRoutes from '@/routes/bid.routes';
import deliverableRoutes from '@/routes/deliverable.routes';
import projectRoutes from '@/routes/project.routes';
import reviewRoutes from '@/routes/review.routes';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/deliverables', deliverableRoutes);
app.use('/api/reviews', reviewRoutes);

app.use('*', (req: express.Request, res: express.Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

export default app;
