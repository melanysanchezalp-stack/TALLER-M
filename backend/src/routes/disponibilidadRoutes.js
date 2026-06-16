import { Router } from 'express';
import { getDisponibilidad } from '../controllers/disponibilidadController.js';

const router = Router();

router.get('/', getDisponibilidad);

export default router;
