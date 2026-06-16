import Appointment from '../models/Appointment.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError }     from '../utils/appError.js';
import { HTTP_CODES }   from '../utils/httpCodes.js';

export const getOTs = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filtro = status ? { status } : {};
  const ots = await Appointment.find(filtro)
    .populate('service', 'nombre precioBase categoria')
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .lean();
  const total = await Appointment.countDocuments(filtro);
  res.json({ success: true, data: ots, total });
});

export const getOTDetalle = asyncHandler(async (req, res) => {
  const ot = await Appointment.findById(req.params.codigo)
    .populate('service', 'nombre precioBase categoria tiempoEstimado')
    .lean();
  if (!ot) throw new AppError('OT no encontrada', HTTP_CODES.NOT_FOUND);
  res.json({ success: true, data: ot });
});

export const confirmarAgendamiento = asyncHandler(async (req, res) => {
  const { tecnicoId } = req.body;
  const ot = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: 'en_proceso', assignedTo: tecnicoId || undefined },
    { new: true }
  );
  if (!ot) throw new AppError('Agendamiento no encontrado', HTTP_CODES.NOT_FOUND);
  res.json({ success: true, data: ot });
});

export const cancelarAgendamiento = asyncHandler(async (req, res) => {
  const ot = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: 'cancelado' },
    { new: true }
  );
  if (!ot) throw new AppError('Agendamiento no encontrado', HTTP_CODES.NOT_FOUND);
  res.json({ success: true, data: ot });
});

export const completarAgendamiento = asyncHandler(async (req, res) => {
  const ot = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: 'terminado', deliveryDate: new Date() },
    { new: true }
  );
  if (!ot) throw new AppError('Agendamiento no encontrado', HTTP_CODES.NOT_FOUND);
  res.json({ success: true, data: ot });
});
