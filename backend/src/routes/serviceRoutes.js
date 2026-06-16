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

// Rutas públicas (catálogo)
router.get('/', getServices);
router.get('/todos', getServices);
router.get('/:id', getServiceById);

// Rutas protegidas (administración)
router.post('/', protect, serviceValidator, createService);
router.put('/:id', protect, serviceValidator, updateService);
router.delete('/:id', protect, deleteService);

export default router;
