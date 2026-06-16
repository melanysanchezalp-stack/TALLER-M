// ============================================
// CONTROLADOR DE VEHÍCULOS
// ============================================
import Vehicle from '../models/Vehicle.js';
import Client  from '../models/Client.js';
import Marca   from '../models/Marca.js';
import Modelo  from '../models/Modelo.js';
import User    from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import { HTTP_CODES } from '../utils/httpCodes.js';

// @desc    Obtener vehículos del cliente autenticado
// @route   GET /api/vehiculos/mis-vehiculos
export const getMisVehiculos = asyncHandler(async (req, res) => {
  const cliente = await Client.findOne({ email: req.user.email });
  if (!cliente) {
    return res.json({ success: true, data: [] });
  }

  const vehicles = await Vehicle.find({ client: cliente._id }).lean();

  const data = vehicles.map(v => ({
    id: v._id.toString(),
    patente: v.plate,
    marcaNombre: v.brand,
    modeloNombre: v.model,
    anio: v.year,
    alias: null,
  }));

  res.json({ success: true, data });
});

// @desc    Cliente registra su propio vehículo
// @route   POST /api/vehiculos/registrar
export const registrarMiVehiculo = asyncHandler(async (req, res) => {
  const { patente, marcaId, modeloId, anio, alias } = req.body;

  if (!patente) throw new AppError('La patente es obligatoria', HTTP_CODES.BAD_REQUEST);
  if (!anio)    throw new AppError('El año es obligatorio', HTTP_CODES.BAD_REQUEST);

  // Resolve or auto-create Client record for this user
  let cliente = await Client.findOne({ email: req.user.email });
  if (!cliente) {
    const user = await User.findById(req.user._id).lean();
    cliente = await Client.create({
      name: `${user.nombre} ${user.apellido}`.trim(),
      email: user.email,
      phone: user.telefono || 'Sin teléfono',
      createdBy: user._id,
    });
  }

  const marca  = marcaId  ? await Marca.findById(marcaId).lean()  : null;
  const modelo = modeloId ? await Modelo.findById(modeloId).lean() : null;

  const vehicle = await Vehicle.create({
    client: cliente._id,
    plate:  patente.toUpperCase().trim(),
    brand:  marca?.nombre  || 'Sin marca',
    model:  modelo?.nombre || 'Sin modelo',
    year:   Number(anio),
  });

  res.status(HTTP_CODES.CREATED).json({ success: true, data: vehicle });
});

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
