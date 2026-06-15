// ============================================
// CONTROLADOR DE AUTENTICACIÓN
// ============================================
import User from '../models/User.js';
import { generateToken } from '../utils/tokenGenerator.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import { HTTP_CODES } from '../utils/httpCodes.js';

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Verificar si el usuario ya existe
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('El email ya está registrado', HTTP_CODES.BAD_REQUEST);
  }

  // Crear usuario
  const user = await User.create({ name, email, password, role });

  // Generar token
  const token = generateToken(user._id);

  res.status(HTTP_CODES.CREATED).json({
    success: true,
    message: 'Usuario registrado exitosamente',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    },
  });
});

// @desc    Iniciar sesión
// @route   POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Buscar usuario e incluir password
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Credenciales inválidas', HTTP_CODES.UNAUTHORIZED);
  }

  // Verificar contraseña
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Credenciales inválidas', HTTP_CODES.UNAUTHORIZED);
  }

  // Generar token
  const token = generateToken(user._id);

  res.status(HTTP_CODES.OK).json({
    success: true,
    message: 'Inicio de sesión exitoso',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    },
  });
});

// @desc    Obtener perfil del usuario autenticado
// @route   GET /api/auth/profile
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(HTTP_CODES.OK).json({
    success: true,
    data: user,
  });
});
