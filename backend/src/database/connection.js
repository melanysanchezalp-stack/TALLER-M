// ============================================
// CONEXIÓN A MONGODB
// ============================================
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    console.log('URI:', process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error de conexión a MongoDB: ${error.message}`);
    process.exit(1);
  }
};
