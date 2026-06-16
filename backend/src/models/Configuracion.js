import mongoose from 'mongoose';

const configuracionSchema = new mongoose.Schema({
  nombreTaller: { type: String, default: 'Taller Mecánico' },
  telefono: { type: String, default: '' },
  email: { type: String, default: '' },
  direccion: { type: String, default: '' },
  horarioApertura: { type: String, default: '08:30' },
  horarioCierre: { type: String, default: '18:30' },
  diasHabiles: { type: [String], default: ['Lunes','Martes','Miércoles','Jueves','Viernes'] },
  moneda: { type: String, default: 'CLP' },
}, { timestamps: true });

export default mongoose.model('Configuracion', configuracionSchema);
