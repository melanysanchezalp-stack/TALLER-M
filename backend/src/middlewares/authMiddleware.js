// ============================================
// MIDDLEWARE DE AUTENTICACIÓN (JWT)
// ============================================
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import { HTTP_CODES } from '../utils/httpCodes.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Verificar si el token viene en el header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('No autorizado. Token no proporcionado.', HTTP_CODES.UNAUTHORIZED);
  }

  // Verificar token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Buscar usuario en la BD
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError('El usuario asociado a este token ya no existe.', HTTP_CODES.UNAUTHORIZED);
  }

  // Adjuntar usuario al request
  req.user = user;
  next();
});

// Middleware para verificar roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        'No tienes permisos para realizar esta acción.',
        HTTP_CODES.FORBIDDEN
      );
    }
    next();
  };
};
