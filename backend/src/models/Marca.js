import mongoose from 'mongoose';

const marcaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la marca es obligatorio'],
    unique: true,
    trim: true,
  },
}, { timestamps: true });

export default mongoose.model('Marca', marcaSchema);
