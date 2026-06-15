// ============================================
// WRAPPER PARA MANEJAR ERRORES ASYNC
// ============================================
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
