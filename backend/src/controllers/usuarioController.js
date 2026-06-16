import User   from '../models/User.js';
import bcrypt  from 'bcryptjs';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError }     from '../utils/appError.js';
import { HTTP_CODES }   from '../utils/httpCodes.js';

export const getMiPerfil = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json({ success: true, data: user });
});

export const actualizarMiPerfil = asyncHandler(async (req, res) => {
  const { nombre, apellido, telefono, direccion, rut } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { nombre, apellido, telefono, direccion, rut },
    { new: true, runValidators: true }
  ).select('-password');
  res.json({ success: true, data: user });
});

export const cambiarMiPassword = asyncHandler(async (req, res) => {
  const { passwordActual, nuevaPassword } = req.body;
  if (!nuevaPassword || nuevaPassword.length < 6)
    throw new AppError('La nueva contraseña debe tener al menos 6 caracteres', HTTP_CODES.BAD_REQUEST);
  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.comparePassword(passwordActual);
  if (!isMatch) throw new AppError('Contraseña actual incorrecta', HTTP_CODES.BAD_REQUEST);
  user.password = nuevaPassword;
  await user.save();
  res.json({ success: true, message: 'Contraseña actualizada' });
});

export const getUsuarios = asyncHandler(async (req, res) => {
  const usuarios = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ success: true, data: usuarios });
});

export const createUsuario = asyncHandler(async (req, res) => {
  const usuario = await User.create(req.body);
  res.status(HTTP_CODES.CREATED).json({
    success: true,
    data: { ...usuario.toObject(), password: undefined },
  });
});

export const updateUsuario = asyncHandler(async (req, res) => {
  const { password, ...datos } = req.body;
  const usuario = await User.findByIdAndUpdate(req.params.id, datos, { new: true, runValidators: true }).select('-password');
  if (!usuario) throw new AppError('Usuario no encontrado', HTTP_CODES.NOT_FOUND);
  res.json({ success: true, data: usuario });
});

export const toggleUsuario = asyncHandler(async (req, res) => {
  const usuario = await User.findById(req.params.id);
  if (!usuario) throw new AppError('Usuario no encontrado', HTTP_CODES.NOT_FOUND);
  usuario.activo = !usuario.activo;
  await usuario.save();
  res.json({ success: true, data: { activo: usuario.activo } });
});

export const cambiarPassword = asyncHandler(async (req, res) => {
  const { nuevaPassword } = req.body;
  if (!nuevaPassword || nuevaPassword.length < 6)
    throw new AppError('La contraseña debe tener al menos 6 caracteres', HTTP_CODES.BAD_REQUEST);
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(nuevaPassword, salt);
  await User.findByIdAndUpdate(req.params.id, { password: hash });
  res.json({ success: true, message: 'Contraseña actualizada' });
});
