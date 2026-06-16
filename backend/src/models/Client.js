// ============================================
// MODELO DE CLIENTE
// ============================================
import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del cliente es obligatorio'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'El teléfono es obligatorio'],
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  puntos: {
    type: Number,
    default: 0,
  },
  nivelFidelizacion: {
    type: String,
    enum: ['BASICO', 'SILVER', 'GOLD', 'PLATINUM'],
    default: 'BASICO',
  },
  descuento: {
    type: Number,
    default: null,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Client', clientSchema);
