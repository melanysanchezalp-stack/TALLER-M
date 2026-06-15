// ============================================
// RUTAS DE VEHÍCULOS
// ============================================
import { Router } from 'express';
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  getVehiclesByClient,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicleController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { vehicleValidator } from '../validators/vehicleValidator.js';
import { upload } from '../utils/multerConfig.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(protect);

router.route('/')
  .get(getVehicles)
  .post(upload.single('image'), vehicleValidator, createVehicle);

router.route('/client/:clientId')
  .get(getVehiclesByClient);

router.route('/:id')
  .get(getVehicleById)
  .put(upload.single('image'), vehicleValidator, updateVehicle)
  .delete(deleteVehicle);

export default router;
