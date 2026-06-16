import { Router } from 'express';
import { getOTs, getOTDetalle } from '../controllers/otController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();
router.use(protect);

router.get('/', getOTs);
router.get('/:codigo', getOTDetalle);

export default router;
