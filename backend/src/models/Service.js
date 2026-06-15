// ============================================
// MODELO DE SERVICIO (Catálogo)
// ============================================
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del servicio es obligatorio'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo'],
  },
  estimatedTime: {
    type: String, // Ej: "2 horas", "1 día"
    trim: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Service', serviceSchema);
