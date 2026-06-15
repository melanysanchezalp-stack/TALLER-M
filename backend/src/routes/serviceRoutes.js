// ============================================
// RUTAS DE SERVICIOS
// ============================================
import { Router } from 'express';
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { serviceValidator } from '../validators/serviceValidator.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(protect);

router.route('/')
  .get(getServices)
  .post(serviceValidator, createService);

router.route('/:id')
  .get(getServiceById)
  .put(serviceValidator, updateService)
  .delete(deleteService);

export default router;
