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
  const clients = await Client.find().populate('createdBy', 'nombre apellido email').lean();

  const data = clients.map(c => {
    const nameParts = (c.name || '').split(' ');
    return {
      id: c._id.toString(),
      usuario: {
        nombre:   c.createdBy?.nombre   || nameParts[0]               || '',
        apellido: c.createdBy?.apellido || nameParts.slice(1).join(' ')|| '',
        email:    c.email || c.createdBy?.email || '',
        activo:   true,
      },
      nivelFidelizacion: c.nivelFidelizacion || 'BASICO',
      puntos:    c.puntos    || 0,
      descuento: c.descuento ?? null,
    };
  });

  res.status(HTTP_CODES.OK).json({
    success: true,
    count: clients.length,
    data,
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

// @desc    Ajustar puntos de fidelización
// @route   PATCH /api/clientes/:id/puntos
export const ajustarPuntos = asyncHandler(async (req, res) => {
  const puntos = parseInt(req.query.puntos ?? req.body.puntos ?? 0, 10);
  const client = await Client.findByIdAndUpdate(
    req.params.id,
    { $inc: { puntos } },
    { new: true }
  );
  if (!client) throw new AppError('Cliente no encontrado', HTTP_CODES.NOT_FOUND);
  res.json({ success: true, data: client });
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
