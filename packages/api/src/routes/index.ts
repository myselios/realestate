import { Router } from 'express';
import apartmentRoutes from './apartments.routes';

const router = Router();

router.use('/apartments', apartmentRoutes);

export default router; 