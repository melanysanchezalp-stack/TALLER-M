import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import { connectDB } from './src/database/connection.js';

const PORT = process.env.PORT || 4000;

console.log('Iniciando servidor...');

connectDB()
  .then(() => {
    console.log('Base de datos conectada');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('ERROR EN connectDB:', err);
  });

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
});
