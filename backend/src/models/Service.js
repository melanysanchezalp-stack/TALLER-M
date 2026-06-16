// ============================================
// MODELO DE SERVICIO (Catálogo)
// ============================================
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del servicio es obligatorio'],
    trim: true,
  },
  descripcion: {
    type: String,
    trim: true,
  },
  precioBase: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo'],
  },
  categoria: {
    type: String,
    trim: true,
  },
  tiempoEstimado: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Service', serviceSchema);
