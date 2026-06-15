// ============================================
// CONTROLADOR DE CLIENTES
// ============================================
import Client from '../models/Client.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import { HTTP_CODES } from '../utils/httpCodes.js';

// @desc    Crear un nuevo cliente
// @route   POST /api/clients
export const createClient = asyncHandler(async (req, res) => {
  const { name, phone, email, address } = req.body;

  const client = await Client.create({
    name,
    phone,
    email,
    address,
    createdBy: req.user._id,
  });

  res.status(HTTP_CODES.CREATED).json({
    success: true,
    message: 'Cliente creado exitosamente',
    data: client,
  });
});

// @desc    Obtener todos los clientes
// @route   GET /api/clients
export const getClients = asyncHandler(async (req, res) => {
  const clients = await Client.find().populate('createdBy', 'name email');

  res.status(HTTP_CODES.OK).json({
    success: true,
    count: clients.length,
    data: clients,
  });
});

// @desc    Obtener un cliente por ID
// @route   GET /api/clients/:id
export const getClientById = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id).populate('createdBy', 'name email');

  if (!client) {
    throw new AppError('Cliente no encontrado', HTTP_CODES.NOT_FOUND);
  }

  res.status(HTTP_CODES.OK).json({
    success: true,
    data: client,
  });
});

// @desc    Actualizar un cliente
// @route   PUT /api/clients/:id
export const updateClient = asyncHandler(async (req, res) => {
  const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!client) {
    throw new AppError('Cliente no encontrado', HTTP_CODES.NOT_FOUND);
  }

  res.status(HTTP_CODES.OK).json({
    success: true,
    message: 'Cliente actualizado exitosamente',
    data: client,
  });
});

// @desc    Eliminar un cliente
// @route   DELETE /api/clients/:id
export const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findByIdAndDelete(req.params.id);

  if (!client) {
    throw new AppError('Cliente no encontrado', HTTP_CODES.NOT_FOUND);
  }

  res.status(HTTP_CODES.OK).json({
    success: true,
    message: 'Cliente eliminado exitosamente',
  });
});
