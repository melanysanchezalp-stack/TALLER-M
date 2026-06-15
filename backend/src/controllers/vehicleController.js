// ============================================
// CONTROLADOR DE VEHÍCULOS
// ============================================
import Vehicle from '../models/Vehicle.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import { HTTP_CODES } from '../utils/httpCodes.js';

// @desc    Registrar un nuevo vehículo
// @route   POST /api/vehicles
export const createVehicle = asyncHandler(async (req, res) => {
  const { client, brand, model, year, plate, color } = req.body;

  const vehicleData = { client, brand, model, year, plate, color };

  // Si se sube una imagen con Multer
  if (req.file) {
    vehicleData.image = `/uploads/${req.file.filename}`;
  }

  const vehicle = await Vehicle.create(vehicleData);

  res.status(HTTP_CODES.CREATED).json({
    success: true,
    message: 'Vehículo registrado exitosamente',
    data: vehicle,
  });
});

// @desc    Obtener todos los vehículos
// @route   GET /api/vehicles
export const getVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find().populate('client', 'name phone');

  res.status(HTTP_CODES.OK).json({
    success: true,
    count: vehicles.length,
    data: vehicles,
  });
});

// @desc    Obtener vehículos de un cliente específico
// @route   GET /api/vehicles/client/:clientId
export const getVehiclesByClient = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({ client: req.params.clientId })
    .populate('client', 'name phone');

  res.status(HTTP_CODES.OK).json({
    success: true,
    count: vehicles.length,
    data: vehicles,
  });
});

// @desc    Obtener un vehículo por ID
// @route   GET /api/vehicles/:id
export const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id).populate('client', 'name phone');

  if (!vehicle) {
    throw new AppError('Vehículo no encontrado', HTTP_CODES.NOT_FOUND);
  }

  res.status(HTTP_CODES.OK).json({
    success: true,
    data: vehicle,
  });
});

// @desc    Actualizar un vehículo
// @route   PUT /api/vehicles/:id
export const updateVehicle = asyncHandler(async (req, res) => {
  const updateData = { ...req.body };

  if (req.file) {
    updateData.image = `/uploads/${req.file.filename}`;
  }

  const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!vehicle) {
    throw new AppError('Vehículo no encontrado', HTTP_CODES.NOT_FOUND);
  }

  res.status(HTTP_CODES.OK).json({
    success: true,
    message: 'Vehículo actualizado exitosamente',
    data: vehicle,
  });
});

// @desc    Eliminar un vehículo
// @route   DELETE /api/vehicles/:id
export const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

  if (!vehicle) {
    throw new AppError('Vehículo no encontrado', HTTP_CODES.NOT_FOUND);
  }

  res.status(HTTP_CODES.OK).json({
    success: true,
    message: 'Vehículo eliminado exitosamente',
  });
});
