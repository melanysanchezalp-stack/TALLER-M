// ============================================
// CONFIGURACIÓN DE EXPRESS
// ============================================
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar rutas
import authRoutes        from './routes/authRoutes.js';
import clientRoutes      from './routes/clientRoutes.js';
import vehicleRoutes     from './routes/vehicleRoutes.js';
import serviceRoutes     from './routes/serviceRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import marcaRoutes       from './routes/marcaRoutes.js';
import adminRoutes       from './routes/adminRoutes.js';
import otRoutes          from './routes/otRoutes.js';
import usuarioRoutes     from './routes/usuarioRoutes.js';
import catalogoRoutes        from './routes/catalogoRoutes.js';
import disponibilidadRoutes  from './routes/disponibilidadRoutes.js';

// Importar middleware de errores
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- Middlewares Globales ----
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ---- Rutas ----
app.use('/api/auth',         authRoutes);
app.use('/api/clientes',    clientRoutes);
app.use('/api/vehiculos',   vehicleRoutes);
app.use('/api/servicios',   serviceRoutes);
app.use('/api/agendamientos', appointmentRoutes);
app.use('/api',             marcaRoutes);
app.use('/api/admin',       adminRoutes);
app.use('/api/ot',          otRoutes);
app.use('/api/usuarios',    usuarioRoutes);
app.use('/api/catalogos',      catalogoRoutes);
app.use('/api/disponibilidad', disponibilidadRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Taller Mecánico funcionando correctamente 🚗' });
});

// ---- Middleware de errores (siempre al final) ----
app.use(errorHandler);

export default app;
