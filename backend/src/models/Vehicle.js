// ============================================
// MODELO DE VEHÍCULO
// ============================================
import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'El cliente es obligatorio'],
  },
  brand: {
    type: String,
    required: [true, 'La marca es obligatoria'],
    trim: true,
  },
  model: {
    type: String,
    required: [true, 'El modelo es obligatorio'],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, 'El año es obligatorio'],
  },
  plate: {
    type: String,
    required: [true, 'La placa es obligatoria'],
    uppercase: true,
    trim: true,
  },
  color: {
    type: String,
    trim: true,
  },
  image: {
    type: String, // URL de la imagen subida con Multer
  },
}, {
  timestamps: true,
});

export default mongoose.model('Vehicle', vehicleSchema);
