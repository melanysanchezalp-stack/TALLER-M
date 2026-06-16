import { Router } from 'express';
import Categoria from '../models/Categoria.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/categorias-servicio', asyncHandler(async (req, res) => {
  const categorias = await Categoria.find({ activa: true }).sort({ nombre: 1 });
  res.json({ success: true, data: categorias });
}));

router.get('/niveles-fidelizacion', (req, res) => {
  res.json({
    success: true,
    data: [
      { nombre: 'Bronce', puntosMin: 0,    puntosMax: 499,  descuento: 0  },
      { nombre: 'Plata',  puntosMin: 500,   puntosMax: 1499, descuento: 5  },
      { nombre: 'Oro',    puntosMin: 1500,  puntosMax: 2999, descuento: 10 },
      { nombre: 'Platino',puntosMin: 3000,  puntosMax: null, descuento: 15 },
    ],
  });
});

export default router;
