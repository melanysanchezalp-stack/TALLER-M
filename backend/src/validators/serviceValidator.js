// ============================================
// VALIDACIONES DE SERVICIOS
// ============================================
import { body, validationResult } from 'express-validator';
import { HTTP_CODES } from '../utils/httpCodes.js';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HTTP_CODES.BAD_REQUEST).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

export const serviceValidator = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre del servicio es obligatorio')
    .isLength({ min: 2, max: 150 }).withMessage('El nombre debe tener entre 2 y 150 caracteres'),
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción no debe exceder 500 caracteres'),
  body('precioBase')
    .notEmpty().withMessage('El precio es obligatorio')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('categoria')
    .optional()
    .trim(),
  body('tiempoEstimado')
    .optional()
    .trim(),
  validate,
];
