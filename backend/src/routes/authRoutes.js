// ============================================
// RUTAS DE AUTENTICACIÓN
// ============================================
import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { registerValidator, loginValidator } from '../validators/authValidator.js';

const router = Router();

// Rutas públicas
router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);

// Rutas protegidas
router.get('/profile', protect, getProfile);

export default router;
