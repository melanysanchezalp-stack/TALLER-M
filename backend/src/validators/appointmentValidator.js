// ============================================
// VALIDACIONES DE CITAS / ÓRDENES DE SERVICIO
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

export const appointmentValidator = [
  body('client')
    .notEmpty().withMessage('El ID del cliente es obligatorio')
    .isMongoId().withMessage('ID de cliente inválido'),
  body('vehicle')
    .notEmpty().withMessage('El ID del vehículo es obligatorio')
    .isMongoId().withMessage('ID de vehículo inválido'),
  body('service')
    .notEmpty().withMessage('El ID del servicio es obligatorio')
    .isMongoId().withMessage('ID de servicio inválido'),
  body('cost')
    .notEmpty().withMessage('El costo es obligatorio')
    .isFloat({ min: 0 }).withMessage('El costo debe ser un número positivo'),
  body('status')
    .optional()
    .isIn(['pendiente', 'en_proceso', 'terminado', 'cancelado'])
    .withMessage('Estatus inválido'),
  body('priority')
    .optional()
    .isIn(['baja', 'media', 'alta'])
    .withMessage('Prioridad inválida'),
  body('diagnosis')
    .optional()
    .trim(),
  body('notes')
    .optional()
    .trim(),
  body('deliveryDate')
    .optional()
    .isISO8601().withMessage('Fecha de entrega inválida'),
  body('assignedTo')
    .optional()
    .isMongoId().withMessage('ID de mecánico inválido'),
  validate,
];
