// ============================================
// MIDDLEWARE GLOBAL DE MANEJO DE ERRORES
// ============================================

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';

  // Error de Mongoose: ID inválido
  if (err.name === 'CastError') {
    message = 'Recurso no encontrado (ID inválido)';
    statusCode = 404;
  }

  // Error de Mongoose: Duplicado
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ');
    message = `El campo ${field} ya existe. Valor duplicado.`;
    statusCode = 400;
  }

  // Error de Mongoose: Validación
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((val) => val.message);
    message = errors.join('. ');
    statusCode = 400;
  }

  // Error de JWT expirado
  if (err.name === 'TokenExpiredError') {
    message = 'Token expirado. Inicia sesión nuevamente.';
    statusCode = 401;
  }

  // Error de JWT inválido
  if (err.name === 'JsonWebTokenError') {
    message = 'Token inválido.';
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
