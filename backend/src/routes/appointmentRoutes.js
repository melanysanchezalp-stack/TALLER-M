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
  getMisAgendamientos,
  agendarComoCliente,
} from '../controllers/appointmentController.js';
import { confirmarAgendamiento, cancelarAgendamiento, completarAgendamiento } from '../controllers/otController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { appointmentValidator } from '../validators/appointmentValidator.js';
import { upload } from '../utils/multerConfig.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(protect);

router.route('/')
  .get(getAppointments)
  .post(upload.single('image'), appointmentValidator, createAppointment);

router.get('/mis', getMisAgendamientos);
router.post('/mis', agendarComoCliente);

router.route('/status/:status')
  .get(getAppointmentsByStatus);

router.put('/:id/confirmar', confirmarAgendamiento);
router.put('/:id/cancelar', cancelarAgendamiento);
router.put('/:id/completar', completarAgendamiento);

router.route('/:id')
  .get(getAppointmentById)
  .put(upload.single('image'), updateAppointment)
  .delete(deleteAppointment);

export default router;
