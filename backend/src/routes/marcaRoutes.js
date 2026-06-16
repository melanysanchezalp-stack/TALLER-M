import { Router } from 'express';
import { getMarcas, getAllModelos, getModelosByMarca, createMarca, createModelo } from '../controllers/marcaController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

// Rutas públicas
router.get('/marcas', getMarcas);
router.get('/marcas/listar', getMarcas);
router.get('/modelos/marca/:marcaId', getModelosByMarca);
router.get('/modelos/listar', getAllModelos);

// Rutas protegidas (administración)
router.post('/marcas', protect, createMarca);
router.post('/marcas/save/marca', protect, createMarca);
router.post('/modelos', protect, createModelo);
router.post('/modelos/save/modelo', protect, createModelo);

export default router;
