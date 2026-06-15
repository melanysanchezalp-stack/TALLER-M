// ============================================
// RUTAS DE CITAS / ÓRDENES DE SERVICIO
// ============================================
import { Router } from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByStatus,
} from '../controllers/appointmentController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { appointmentValidator } from '../validators/appointmentValidator.js';
import { upload } from '../utils/multerConfig.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(protect);

router.route('/')
  .get(getAppointments)
  .post(upload.single('image'), appointmentValidator, createAppointment);

router.route('/status/:status')
  .get(getAppointmentsByStatus);

router.route('/:id')
  .get(getAppointmentById)
  .put(upload.single('image'), updateAppointment)
  .delete(deleteAppointment);

export default router;
