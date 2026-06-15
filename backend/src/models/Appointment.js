// ============================================
// MODELO DE CITA / ORDEN DE SERVICIO
// ============================================
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'El cliente es obligatorio'],
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'El vehículo es obligatorio'],
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'El servicio es obligatorio'],
  },
  diagnosis: {
    type: String,
    trim: true,
  },
  cost: {
    type: Number,
    required: [true, 'El costo es obligatorio'],
    min: 0,
  },
  status: {
    type: String,
    enum: ['pendiente', 'en_proceso', 'terminado', 'cancelado'],
    default: 'pendiente',
  },
  priority: {
    type: String,
    enum: ['baja', 'media', 'alta'],
    default: 'media',
  },
  entryDate: {
    type: Date,
    default: Date.now,
  },
  deliveryDate: {
    type: Date,
  },
  image: {
    type: String, // Imagen del diagnóstico
  },
  notes: {
    type: String,
    trim: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

export default mongoose.model('Appointment', appointmentSchema);
