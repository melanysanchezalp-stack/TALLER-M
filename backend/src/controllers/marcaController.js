import Marca from '../models/Marca.js';
import Modelo from '../models/Modelo.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getMarcas = asyncHandler(async (req, res) => {
  const marcas = await Marca.find().sort({ nombre: 1 });
  res.json({ success: true, data: marcas });
});

export const getModelosByMarca = asyncHandler(async (req, res) => {
  const modelos = await Modelo.find({ marca: req.params.marcaId }).sort({ nombre: 1 });
  res.json({ success: true, data: modelos });
});

export const createMarca = asyncHandler(async (req, res) => {
  const marca = await Marca.create({ nombre: req.body.nombre });
  res.status(201).json({ success: true, data: marca });
});

export const getAllModelos = asyncHandler(async (req, res) => {
  const modelos = await Modelo.find().populate('marca', 'nombre').sort({ nombre: 1 });
  res.json({ success: true, data: modelos });
});

export const createModelo = asyncHandler(async (req, res) => {
  const modelo = await Modelo.create({ nombre: req.body.nombre, marca: req.body.marcaId });
  res.status(201).json({ success: true, data: modelo });
});
