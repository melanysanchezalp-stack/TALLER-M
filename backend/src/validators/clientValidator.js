// ============================================
// VALIDACIONES DE CLIENTES
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

export const clientValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre del cliente es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('phone')
    .trim()
    .notEmpty().withMessage('El teléfono es obligatorio')
    .isLength({ min: 7, max: 20 }).withMessage('El teléfono debe tener entre 7 y 20 caracteres'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Ingresa un email válido'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('La dirección no debe exceder 200 caracteres'),
  validate,
];
