// ============================================
// VALIDACIONES DE VEHÍCULOS
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

export const vehicleValidator = [
  body('client')
    .notEmpty().withMessage('El ID del cliente es obligatorio')
    .isMongoId().withMessage('ID de cliente inválido'),
  body('brand')
    .trim()
    .notEmpty().withMessage('La marca es obligatoria'),
  body('model')
    .trim()
    .notEmpty().withMessage('El modelo es obligatorio'),
  body('year')
    .notEmpty().withMessage('El año es obligatorio')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Ingresa un año válido'),
  body('plate')
    .trim()
    .notEmpty().withMessage('La placa es obligatoria')
    .isLength({ min: 3, max: 15 }).withMessage('Placa inválida'),
  body('color')
    .optional()
    .trim(),
  validate,
];
