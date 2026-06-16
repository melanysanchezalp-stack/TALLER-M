import Appointment from '../models/Appointment.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import { HTTP_CODES } from '../utils/httpCodes.js';

const HORA_INICIO   = 9;   // 09:00
const HORA_FIN      = 18;  // 18:00
const DURACION_MIN  = 60;  // 1 hour slots

export const getDisponibilidad = asyncHandler(async (req, res) => {
  const { fecha } = req.query;

  if (!fecha) throw new AppError('La fecha es requerida', HTTP_CODES.BAD_REQUEST);

  const fechaObj = new Date(fecha + 'T00:00:00.000Z');
  if (isNaN(fechaObj.getTime())) throw new AppError('Fecha inválida', HTTP_CODES.BAD_REQUEST);

  const inicioDelDia = new Date(fecha + 'T00:00:00.000Z');
  const finDelDia    = new Date(fecha + 'T23:59:59.999Z');

  const citasDelDia = await Appointment.find({
    entryDate: { $gte: inicioDelDia, $lte: finDelDia },
    status: { $nin: ['cancelado'] },
  }).lean();

  // Build a set of occupied hours (UTC)
  const ocupados = new Set(
    citasDelDia.map(a => new Date(a.entryDate).getUTCHours())
  );

  const slots = [];
  for (let hora = HORA_INICIO; hora < HORA_FIN; hora += DURACION_MIN / 60) {
    const slotDate = new Date(fecha + `T${String(hora).padStart(2, '0')}:00:00.000Z`);
    slots.push({
      fechaHoraInicio: slotDate.toISOString(),
      disponible: !ocupados.has(hora),
    });
  }

  res.json({ success: true, data: slots });
});
