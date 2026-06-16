import { Router } from 'express';
import {
  getDashboard,
  getConfiguracion, updateConfiguracion,
  getCategorias, createCategoria, updateCategoria, deleteCategoria,
} from '../controllers/adminController.js';
import {
  getUsuarios, createUsuario, updateUsuario, toggleUsuario, cambiarPassword,
} from '../controllers/usuarioController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();
router.use(protect);

router.get('/dashboard', getDashboard);

router.route('/configuracion')
  .get(getConfiguracion)
  .put(updateConfiguracion);

router.route('/categorias-servicio')
  .get(getCategorias)
  .post(createCategoria);

router.route('/categorias-servicio/:id')
  .put(updateCategoria)
  .delete(deleteCategoria);

router.route('/usuarios')
  .get(getUsuarios)
  .post(createUsuario);

router.route('/usuarios/:id')
  .put(updateUsuario);

router.put('/usuarios/:id/toggle', toggleUsuario);
router.put('/usuarios/:id/cambiar-password', cambiarPassword);

export default router;
