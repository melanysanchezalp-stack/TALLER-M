// ============================================
// CONTROLADOR DE SERVICIOS (Catálogo)
// ============================================
import Service from '../models/Service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import { HTTP_CODES } from '../utils/httpCodes.js';

// @desc    Crear un nuevo servicio
// @route   POST /api/services
export const createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);

  res.status(HTTP_CODES.CREATED).json({
    success: true,
    message: 'Servicio creado exitosamente',
    data: service,
  });
});

// @desc    Obtener todos los servicios
// @route   GET /api/services
export const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find();

  res.status(HTTP_CODES.OK).json({
    success: true,
    count: services.length,
    data: services,
  });
});

// @desc    Obtener un servicio por ID
// @route   GET /api/services/:id
export const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    throw new AppError('Servicio no encontrado', HTTP_CODES.NOT_FOUND);
  }

  res.status(HTTP_CODES.OK).json({
    success: true,
    data: service,
  });
});

// @desc    Actualizar un servicio
// @route   PUT /api/services/:id
export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!service) {
    throw new AppError('Servicio no encontrado', HTTP_CODES.NOT_FOUND);
  }

  res.status(HTTP_CODES.OK).json({
    success: true,
    message: 'Servicio actualizado exitosamente',
    data: service,
  });
});

// @desc    Eliminar un servicio
// @route   DELETE /api/services/:id
export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);

  if (!service) {
    throw new AppError('Servicio no encontrado', HTTP_CODES.NOT_FOUND);
  }

  res.status(HTTP_CODES.OK).json({
    success: true,
    message: 'Servicio eliminado exitosamente',
  });
});
