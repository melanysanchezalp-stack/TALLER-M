// ============================================
// CONTROLADOR DE CITAS / ÓRDENES DE SERVICIO
// ============================================
import Appointment from '../models/Appointment.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import { HTTP_CODES } from '../utils/httpCodes.js';

// @desc    Crear una nueva cita/orden
// @route   POST /api/appointments
export const createAppointment = asyncHandler(async (req, res) => {
  const appointmentData = { ...req.body };

  // Si se sube imagen de diagnóstico con Multer
  if (req.file) {
    appointmentData.image = `/uploads/${req.file.filename}`;
  }

  const appointment = await Appointment.create(appointmentData);

  res.status(HTTP_CODES.CREATED).json({
    success: true,
    message: 'Cita creada exitosamente',
    data: appointment,
  });
});

// @desc    Obtener todas las citas
// @route   GET /api/appointments
export const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find()
    .populate('client', 'name phone')
    .populate('vehicle', 'brand model plate')
    .populate('service', 'name price')
    .populate('assignedTo', 'name');

  res.status(HTTP_CODES.OK).json({
    success: true,
    count: appointments.length,
    data: appointments,
  });
});

// @desc    Obtener una cita por ID
// @route   GET /api/appointments/:id
export const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('client', 'name phone email address')
    .populate('vehicle', 'brand model year plate color image')
    .populate('service', 'name description price estimatedTime')
    .populate('assignedTo', 'name email');

  if (!appointment) {
    throw new AppError('Cita no encontrada', HTTP_CODES.NOT_FOUND);
  }

  res.status(HTTP_CODES.OK).json({
    success: true,
    data: appointment,
  });
});

// @desc    Actualizar una cita (cambiar estatus, agregar diagnóstico, etc.)
// @route   PUT /api/appointments/:id
export const updateAppointment = asyncHandler(async (req, res) => {
  const updateData = { ...req.body };

  if (req.file) {
    updateData.image = `/uploads/${req.file.filename}`;
  }

  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!appointment) {
    throw new AppError('Cita no encontrada', HTTP_CODES.NOT_FOUND);
  }

  res.status(HTTP_CODES.OK).json({
    success: true,
    message: 'Cita actualizada exitosamente',
    data: appointment,
  });
});

// @desc    Eliminar una cita
// @route   DELETE /api/appointments/:id
export const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id);

  if (!appointment) {
    throw new AppError('Cita no encontrada', HTTP_CODES.NOT_FOUND);
  }

  res.status(HTTP_CODES.OK).json({
    success: true,
    message: 'Cita eliminada exitosamente',
  });
});

// @desc    Obtener citas por estatus
// @route   GET /api/appointments/status/:status
export const getAppointmentsByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const validStatuses = ['pendiente', 'en_proceso', 'terminado', 'cancelado'];

  if (!validStatuses.includes(status)) {
    throw new AppError('Estatus inválido', HTTP_CODES.BAD_REQUEST);
  }

  const appointments = await Appointment.find({ status })
    .populate('client', 'name phone')
    .populate('vehicle', 'brand model plate')
    .populate('service', 'name price');

  res.status(HTTP_CODES.OK).json({
    success: true,
    count: appointments.length,
    data: appointments,
  });
});
