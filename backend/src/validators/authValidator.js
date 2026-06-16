// ============================================
// VALIDACIONES DE AUTENTICACIÓN
// ============================================
import { body, validationResult } from 'express-validator';
import { HTTP_CODES } from '../utils/httpCodes.js';

// Middleware para revisar errores de validación
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

// Validación para registro
export const registerValidator = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('apellido')
    .trim()
    .notEmpty().withMessage('El apellido es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El apellido debe tener entre 2 y 100 caracteres'),
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Ingresa un email válido'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rolNombre')
    .optional()
    .isIn(['admin', 'mechanic', 'ADMIN', 'MECHANIC', 'cliente', 'CLIENTE']).withMessage('Rol inválido'),
  body('role')
    .optional()
    .isIn(['admin', 'mechanic', 'cliente']).withMessage('El rol debe ser admin, mechanic o cliente'),
  body('telefono').optional().trim(),
  body('direccion').optional().trim(),
  body('rut').optional().trim(),
  validate,
];

// Validación para login
export const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Ingresa un email válido'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria'),
  validate,
];
