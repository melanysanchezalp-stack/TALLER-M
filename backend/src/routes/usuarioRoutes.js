import { Router } from 'express';
import { getUsuarios, getMiPerfil, actualizarMiPerfil, cambiarMiPassword } from '../controllers/usuarioController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();
router.use(protect);

router.get('/me', getMiPerfil);
router.put('/me/perfil', actualizarMiPerfil);
router.put('/me/password', cambiarMiPassword);

router.get('/', getUsuarios);

export default router;
