import { Router } from 'express';
import userRoutes from './users.routes';
import apartmentRoutes from './apartments.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/apartments', apartmentRoutes);

export default router; 