// ============================================
// RUTAS DE CLIENTES
// ============================================
import { Router } from 'express';
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
  ajustarPuntos,
} from '../controllers/clientController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { clientValidator } from '../validators/clientValidator.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(protect);

router.route('/')
  .get(getClients)
  .post(clientValidator, createClient);

router.patch('/:id/puntos', ajustarPuntos);

router.route('/:id')
  .get(getClientById)
  .put(clientValidator, updateClient)
  .delete(deleteClient);

export default router;
