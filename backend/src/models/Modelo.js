import mongoose from 'mongoose';

const modeloSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del modelo es obligatorio'],
    trim: true,
  },
  marca: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Marca',
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Modelo', modeloSchema);
