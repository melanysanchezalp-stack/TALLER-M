// ============================================
// CONTROLADOR DE CITAS / ÓRDENES DE SERVICIO
// ============================================
import Appointment from '../models/Appointment.js';
import Client      from '../models/Client.js';
import Service     from '../models/Service.js';
import User        from '../models/User.js';
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

const STATUS_LABEL = {
  pendiente:  'PENDIENTE',
  en_proceso: 'CONFIRMADO',
  terminado:  'COMPLETADO',
  cancelado:  'CANCELADO',
};

// @desc    Obtener todas las citas
// @route   GET /api/appointments
export const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find()
    .populate('client', 'name phone email')
    .populate('vehicle', 'brand model plate year')
    .populate('service', 'nombre precioBase')
    .populate('assignedTo', 'nombre apellido')
    .lean();

  const data = appointments.map(a => ({
    idAgendamiento:     a._id.toString(),
    nombreCliente:      a.client?.name   || '—',
    emailCliente:       a.client?.email  || '',
    telefonoCliente:    a.client?.phone  || '',
    patenteVehiculo:    a.vehicle?.plate || '—',
    marcaVehiculo:      a.vehicle?.brand || '',
    modeloVehiculo:     a.vehicle?.model || '',
    anioVehiculo:       a.vehicle?.year  || null,
    nombreServicio:     a.service?.nombre || '—',
    fechaInicio:        a.entryDate,
    fechaFin:           a.deliveryDate || null,
    estadoAgendamiento: STATUS_LABEL[a.status] || a.status?.toUpperCase() || 'PENDIENTE',
    nombreTecnico:      a.assignedTo ? `${a.assignedTo.nombre} ${a.assignedTo.apellido}`.trim() : null,
    precioAcordado:     a.cost,
    diagnostico:        a.diagnosis || null,
  }));

  res.status(HTTP_CODES.OK).json({
    success: true,
    count: appointments.length,
    data,
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

// @desc    Cliente autenticado agenda un servicio
// @route   POST /api/agendamientos/mis
export const agendarComoCliente = asyncHandler(async (req, res) => {
  const { idVehiculo, idServicio, fechaInicio } = req.body;

  if (!idVehiculo || !idServicio) {
    throw new AppError('Vehículo y servicio son requeridos', HTTP_CODES.BAD_REQUEST);
  }

  // Resolve or auto-create Client record
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

  const servicio = await Service.findById(idServicio).lean();

  const appointment = await Appointment.create({
    client:    cliente._id,
    vehicle:   idVehiculo,
    service:   idServicio,
    cost:      servicio?.precioBase ?? 0,
    entryDate: fechaInicio ? new Date(fechaInicio) : new Date(),
    status:    'pendiente',
  });

  res.status(HTTP_CODES.CREATED).json({ success: true, data: appointment });
});

// @desc    Obtener las citas del cliente autenticado
// @route   GET /api/agendamientos/mis
export const getMisAgendamientos = asyncHandler(async (req, res) => {
  const cliente = await Client.findOne({ email: req.user.email });
  if (!cliente) {
    return res.json({ success: true, data: [] });
  }

  const appointments = await Appointment.find({ client: cliente._id })
    .populate('vehicle', 'plate brand model year')
    .populate('service', 'nombre precioBase')
    .populate('assignedTo', 'nombre apellido')
    .sort({ createdAt: -1 })
    .lean();

  const data = appointments.map(a => ({
    idAgendamiento: a._id.toString(),
    nombreServicio: a.service?.nombre || '—',
    patenteVehiculo: a.vehicle?.plate || '—',
    vehiculoDescripcion: [a.vehicle?.brand, a.vehicle?.model, a.vehicle?.year].filter(Boolean).join(' '),
    estadoAgendamiento: a.status || 'pendiente',
    fechaInicio: a.entryDate,
    nombreTecnico: a.assignedTo ? `${a.assignedTo.nombre} ${a.assignedTo.apellido}`.trim() : null,
    precioAcordado: a.cost,
    diagnostico: a.diagnosis,
  }));

  res.json({ success: true, data });
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
