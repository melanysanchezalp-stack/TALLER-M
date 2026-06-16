import User          from '../models/User.js';
import Appointment   from '../models/Appointment.js';
import Service       from '../models/Service.js';
import Vehicle       from '../models/Vehicle.js';
import Categoria     from '../models/Categoria.js';
import Configuracion from '../models/Configuracion.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError }     from '../utils/appError.js';
import { HTTP_CODES }   from '../utils/httpCodes.js';

// ── Dashboard ────────────────────────────────────────────────────

export const getDashboard = asyncHandler(async (req, res) => {
  const inicioHoy = new Date();
  inicioHoy.setHours(0, 0, 0, 0);
  const finHoy = new Date();
  finHoy.setHours(23, 59, 59, 999);

  const [
    totalClientes,
    totalVehiculos,
    totalServicios,
    totalAgendamientos,
    pendientes,
    enProceso,
    terminados,
    cancelados,
    agendamientosHoy,
    tecnicosDisponibles,
    ultimosRaw,
    proximosRaw,
    topServicios,
  ] = await Promise.all([
    User.countDocuments({ role: 'cliente' }),
    Vehicle.countDocuments(),
    Service.countDocuments(),
    Appointment.countDocuments(),
    Appointment.countDocuments({ status: 'pendiente' }),
    Appointment.countDocuments({ status: 'en_proceso' }),
    Appointment.countDocuments({ status: 'terminado' }),
    Appointment.countDocuments({ status: 'cancelado' }),
    Appointment.countDocuments({ entryDate: { $gte: inicioHoy, $lte: finHoy } }),
    User.countDocuments({ role: 'mechanic' }),
    Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('client', 'name')
      .populate('vehicle', 'plate')
      .populate('service', 'nombre')
      .lean(),
    Appointment.find({
      entryDate: { $gte: inicioHoy, $lte: finHoy },
      status: { $in: ['pendiente', 'en_proceso'] },
    })
      .sort({ entryDate: 1 })
      .limit(5)
      .populate('client', 'name')
      .populate('vehicle', 'plate')
      .populate('service', 'nombre')
      .lean(),
    Appointment.aggregate([
      { $group: { _id: '$service', conteo: { $sum: 1 } } },
      { $sort: { conteo: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'services', localField: '_id', foreignField: '_id', as: 'info' } },
      { $unwind: { path: '$info', preserveNullAndEmptyArrays: true } },
      { $project: { nombre: { $ifNull: ['$info.nombre', 'Sin servicio'] }, conteo: 1 } },
    ]),
  ]);

  const mapAg = (a) => ({
    id: a._id.toString(),
    clienteNombre: a.client?.name || '—',
    servicioNombre: a.service?.nombre || '—',
    vehiculoPatente: a.vehicle?.plate || '—',
    estado: (a.status || '').toUpperCase(),
    fechaInicio: a.entryDate,
  });

  res.json({
    success: true,
    data: {
      totalClientes,
      totalVehiculos,
      totalServicios,
      totalAgendamientos,
      agendamientosHoy,
      agendamientosPendientes: pendientes,
      tecnicosDisponibles,
      agendamientosPorEstado: {
        PENDIENTE: pendientes,
        EN_PROCESO: enProceso,
        TERMINADO: terminados,
        CANCELADO: cancelados,
      },
      ultimosAgendamientos: ultimosRaw.map(mapAg),
      proximosHoy: proximosRaw.map(mapAg),
      serviciosMasSolicitados: topServicios.map(s => ({ nombre: s.nombre, conteo: s.conteo })),
    },
  });
});

// ── Configuración ────────────────────────────────────────────────

export const getConfiguracion = asyncHandler(async (req, res) => {
  let config = await Configuracion.findOne();
  if (!config) config = await Configuracion.create({});
  res.json({ success: true, data: config });
});

export const updateConfiguracion = asyncHandler(async (req, res) => {
  let config = await Configuracion.findOne();
  if (!config) {
    config = await Configuracion.create(req.body);
  } else {
    Object.assign(config, req.body);
    await config.save();
  }
  res.json({ success: true, data: config });
});

// ── Categorías de servicio ────────────────────────────────────────

export const getCategorias = asyncHandler(async (req, res) => {
  const categorias = await Categoria.find().sort({ nombre: 1 });
  res.json({ success: true, data: categorias });
});

export const createCategoria = asyncHandler(async (req, res) => {
  const categoria = await Categoria.create(req.body);
  res.status(HTTP_CODES.CREATED).json({ success: true, data: categoria });
});

export const updateCategoria = asyncHandler(async (req, res) => {
  const categoria = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!categoria) throw new AppError('Categoría no encontrada', HTTP_CODES.NOT_FOUND);
  res.json({ success: true, data: categoria });
});

export const deleteCategoria = asyncHandler(async (req, res) => {
  const categoria = await Categoria.findByIdAndDelete(req.params.id);
  if (!categoria) throw new AppError('Categoría no encontrada', HTTP_CODES.NOT_FOUND);
  res.json({ success: true, message: 'Categoría eliminada' });
});
