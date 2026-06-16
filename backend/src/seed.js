import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

import User        from './models/User.js';
import Marca       from './models/Marca.js';
import Modelo      from './models/Modelo.js';
import Service     from './models/Service.js';
import Client      from './models/Client.js';
import Vehicle     from './models/Vehicle.js';
import Appointment from './models/Appointment.js';
import Categoria   from './models/Categoria.js';

// ── Helpers ────────────────────────────────────────────────────────
const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d; };

// ── Marcas y modelos ───────────────────────────────────────────────
const MARCAS_MODELOS = [
  { nombre: 'Toyota',     modelos: ['Corolla', 'Yaris', 'Hilux', 'RAV4', 'Fortuner'] },
  { nombre: 'Hyundai',    modelos: ['Accent', 'Elantra', 'Tucson', 'Santa Fe', 'i10'] },
  { nombre: 'Kia',        modelos: ['Rio', 'Cerato', 'Sportage', 'Sorento', 'Stonic'] },
  { nombre: 'Nissan',     modelos: ['Versa', 'Sentra', 'Frontier', 'Kicks', 'X-Trail'] },
  { nombre: 'Ford',       modelos: ['Fiesta', 'Focus', 'Ranger', 'Explorer', 'EcoSport'] },
  { nombre: 'Chevrolet',  modelos: ['Spark', 'Aveo', 'Tracker', 'Equinox', 'S10'] },
  { nombre: 'Mazda',      modelos: ['Mazda2', 'Mazda3', 'CX-3', 'CX-5', 'BT-50'] },
  { nombre: 'Honda',      modelos: ['Fit', 'Civic', 'HR-V', 'CR-V', 'Pilot'] },
  { nombre: 'Mitsubishi', modelos: ['Lancer', 'Outlander', 'ASX', 'L200', 'Eclipse Cross'] },
];

// ── Categorías de servicio ─────────────────────────────────────────
const CATEGORIAS = [
  { nombre: 'Mantenimiento Preventivo', descripcion: 'Servicios periódicos para mantener el vehículo en óptimas condiciones', activa: true },
  { nombre: 'Frenos',                   descripcion: 'Reparación y mantenimiento del sistema de frenado', activa: true },
  { nombre: 'Motor',                    descripcion: 'Reparaciones y diagnóstico del motor', activa: true },
  { nombre: 'Suspensión y Dirección',   descripcion: 'Mantenimiento de amortiguadores, muelles y sistema de dirección', activa: true },
  { nombre: 'Sistema Eléctrico',        descripcion: 'Instalaciones y reparaciones eléctricas del vehículo', activa: true },
  { nombre: 'Diagnóstico',              descripcion: 'Revisión computarizada y diagnóstico de fallas con scanner profesional', activa: true },
];

// ── Servicios ──────────────────────────────────────────────────────
const SERVICIOS = [
  { nombre: 'Cambio de aceite y filtro',          descripcion: 'Cambio completo de aceite de motor con filtro. Incluye revisión de niveles.',                     precioBase: 35000,  categoria: 'Mantenimiento Preventivo', tiempoEstimado: '45 minutos' },
  { nombre: 'Mantención 5.000 km',                descripcion: 'Cambio de aceite, filtro de aire y revisión general de 20 puntos.',                               precioBase: 55000,  categoria: 'Mantenimiento Preventivo', tiempoEstimado: '1 hora' },
  { nombre: 'Mantención completa 10.000 km',      descripcion: 'Cambio de aceite, filtros, bujías y revisión general de 30 puntos.',                              precioBase: 95000,  categoria: 'Mantenimiento Preventivo', tiempoEstimado: '3 horas' },
  { nombre: 'Frenos delanteros',                  descripcion: 'Cambio de pastillas y discos de freno delanteros. Incluye sangrado del sistema hidráulico.',      precioBase: 120000, categoria: 'Frenos',                   tiempoEstimado: '2 horas' },
  { nombre: 'Frenos traseros',                    descripcion: 'Cambio de pastillas y tambores o discos traseros. Revisión de freno de mano.',                    precioBase: 110000, categoria: 'Frenos',                   tiempoEstimado: '2 horas' },
  { nombre: 'Cambio de correa de distribución',   descripcion: 'Reemplazo de correa de distribución, tensor y bomba de agua. Recomendado cada 60.000 km.',       precioBase: 180000, categoria: 'Motor',                    tiempoEstimado: '4 horas' },
  { nombre: 'Revisión de motor',                  descripcion: 'Inspección completa del motor: culata, juntas, pistones y sistema de enfriamiento.',              precioBase: 250000, categoria: 'Motor',                    tiempoEstimado: '6 horas' },
  { nombre: 'Cambio de radiador',                 descripcion: 'Desmontaje e instalación de nuevo radiador. Incluye líquido refrigerante.',                       precioBase: 145000, categoria: 'Motor',                    tiempoEstimado: '3 horas' },
  { nombre: 'Revisión de suspensión',             descripcion: 'Inspección completa de amortiguadores, resortes, rótulas y hojas de dirección.',                  precioBase: 30000,  categoria: 'Suspensión y Dirección',   tiempoEstimado: '1 hora' },
  { nombre: 'Cambio de amortiguadores',           descripcion: 'Reemplazo de amortiguadores delanteros y/o traseros con piezas de primera línea.',                precioBase: 160000, categoria: 'Suspensión y Dirección',   tiempoEstimado: '2 horas' },
  { nombre: 'Alineación y balanceo',              descripcion: 'Alineación de dirección computarizada y balanceo de las 4 ruedas.',                               precioBase: 28000,  categoria: 'Suspensión y Dirección',   tiempoEstimado: '1 hora' },
  { nombre: 'Cambio de batería',                  descripcion: 'Reemplazo de batería y revisión del sistema de carga. Prueba de alternador y arranque.',          precioBase: 15000,  categoria: 'Sistema Eléctrico',        tiempoEstimado: '30 minutos' },
  { nombre: 'Revisión sistema eléctrico',         descripcion: 'Diagnóstico completo del sistema eléctrico: fusibles, alternador, arranque y cableado.',          precioBase: 45000,  categoria: 'Sistema Eléctrico',        tiempoEstimado: '2 horas' },
  { nombre: 'Diagnóstico electrónico',            descripcion: 'Lectura de códigos de falla con scanner profesional. Informe detallado de fallas.',               precioBase: 20000,  categoria: 'Diagnóstico',              tiempoEstimado: '30 minutos' },
  { nombre: 'Cambio de neumáticos',               descripcion: 'Desmontaje, montaje y equilibrado de 4 neumáticos. No incluye costo de neumáticos.',             precioBase: 24000,  categoria: 'Suspensión y Dirección',   tiempoEstimado: '1 hora' },
];

// ── SEED ───────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Conectado a MongoDB');

  // Limpiar todas las colecciones
  await Promise.all([
    User.deleteMany({}),
    Marca.deleteMany({}),
    Modelo.deleteMany({}),
    Service.deleteMany({}),
    Client.deleteMany({}),
    Vehicle.deleteMany({}),
    Appointment.deleteMany({}),
    Categoria.deleteMany({}),
  ]);
  console.log('🗑️  Colecciones limpiadas');

  // ── Usuarios ──────────────────────────────────────────────────────
  const admin = await User.create({
    nombre: 'Melany', apellido: 'Sánchez',
    email: 'admin@taller.cl', password: 'admin1234',
    role: 'admin', telefono: '+56912345678',
  });

  const [mec1, mec2] = await User.insertMany([
    { nombre: 'Juan',  apellido: 'Pérez',  email: 'mecanico1@taller.cl', password: 'admin1234', role: 'mechanic', telefono: '+56911112222' },
    { nombre: 'Pedro', apellido: 'Silva',  email: 'mecanico2@taller.cl', password: 'admin1234', role: 'mechanic', telefono: '+56933334444' },
  ]);

  await User.insertMany([
    { nombre: 'Carlos',   apellido: 'González',  email: 'cliente@taller.cl',  password: 'admin1234', role: 'cliente', telefono: '+56987654321', direccion: 'Av. Providencia 1234, Santiago' },
    { nombre: 'María',    apellido: 'López',     email: 'cliente2@taller.cl', password: 'admin1234', role: 'cliente', telefono: '+56976543210', direccion: 'Las Condes 567, Santiago' },
    { nombre: 'Roberto',  apellido: 'Fernández', email: 'cliente3@taller.cl', password: 'admin1234', role: 'cliente', telefono: '+56965432109', direccion: 'Ñuñoa 890, Santiago' },
  ]);

  console.log('👥 Usuarios creados (1 admin, 2 mecánicos, 3 clientes)');

  // ── Categorías ────────────────────────────────────────────────────
  await Categoria.insertMany(CATEGORIAS);
  console.log(`📁 ${CATEGORIAS.length} categorías de servicio creadas`);

  // ── Marcas y modelos ──────────────────────────────────────────────
  for (const { nombre, modelos } of MARCAS_MODELOS) {
    const marca = await Marca.create({ nombre });
    for (const nombreModelo of modelos) {
      await Modelo.create({ nombre: nombreModelo, marca: marca._id });
    }
  }
  console.log(`🚗 ${MARCAS_MODELOS.length} marcas con modelos creadas`);

  // ── Servicios ─────────────────────────────────────────────────────
  const servicios = await Service.insertMany(SERVICIOS);
  console.log(`🔧 ${servicios.length} servicios creados`);

  const [
    svcAceite, svcMant5k, svcMant10k,
    svcFrenosD, svcFrenosT,
    svcCorrea, svcMotor, svcRadiador,
    svcSuspension, svcAmortiguadores, svcAlineacion,
    svcBateria, svcElectrico,
    svcDiagnostico, svcNeumaticos,
  ] = servicios;

  // ── Clientes (Client model) ───────────────────────────────────────
  const [clienteCarlos, clienteMaria, clienteRoberto, clienteAna] = await Client.insertMany([
    { name: 'Carlos González',  phone: '+56987654321', email: 'cliente@taller.cl',  address: 'Av. Providencia 1234, Santiago', createdBy: admin._id },
    { name: 'María López',      phone: '+56976543210', email: 'cliente2@taller.cl', address: 'Las Condes 567, Santiago',        createdBy: admin._id },
    { name: 'Roberto Fernández',phone: '+56965432109', email: 'cliente3@taller.cl', address: 'Ñuñoa 890, Santiago',             createdBy: admin._id },
    { name: 'Ana Muñoz',        phone: '+56954321098', email: 'ana.munoz@gmail.com', address: 'Maipú 1122, Santiago',           createdBy: admin._id },
  ]);
  console.log('👤 4 clientes (Client) creados');

  // ── Vehículos ─────────────────────────────────────────────────────
  const [
    autoCarlos1, autoCarlos2,
    autoMaria1, autoMaria2,
    autoRoberto,
    autoAna,
  ] = await Vehicle.insertMany([
    { client: clienteCarlos._id,  brand: 'Toyota',   model: 'Corolla',  year: 2020, plate: 'ABCD12', color: 'Blanco' },
    { client: clienteCarlos._id,  brand: 'Hyundai',  model: 'Accent',   year: 2019, plate: 'EFGH34', color: 'Gris'   },
    { client: clienteMaria._id,   brand: 'Kia',      model: 'Sportage', year: 2021, plate: 'IJKL56', color: 'Rojo'   },
    { client: clienteMaria._id,   brand: 'Mazda',    model: 'CX-3',     year: 2023, plate: 'UVWX11', color: 'Azul'   },
    { client: clienteRoberto._id, brand: 'Ford',     model: 'Ranger',   year: 2022, plate: 'MNOP78', color: 'Negro'  },
    { client: clienteAna._id,     brand: 'Nissan',   model: 'Versa',    year: 2018, plate: 'QRST90', color: 'Plata'  },
  ]);
  console.log('🚙 6 vehículos creados');

  // ── Agendamientos ─────────────────────────────────────────────────
  // Hoy
  const hoy = new Date();

  await Appointment.insertMany([

    // HOY - pendientes (aparecen en "Próximos hoy")
    {
      client: clienteCarlos._id, vehicle: autoCarlos1._id, service: svcMant10k._id,
      cost: svcMant10k.precioBase, status: 'pendiente', priority: 'media',
      entryDate: hoy,
      diagnosis: 'Cliente solicita mantención de 10.000 km. Última revisión hace 6 meses.',
      notes: 'Cliente llega a las 9:00 AM',
    },
    {
      client: clienteMaria._id, vehicle: autoMaria1._id, service: svcFrenosD._id,
      cost: svcFrenosD.precioBase, status: 'pendiente', priority: 'alta',
      entryDate: hoy,
      diagnosis: 'Ruido metálico al frenar. Posible desgaste de pastillas.',
      notes: 'Revisión urgente solicitada por el cliente',
    },

    // HOY - en proceso
    {
      client: clienteRoberto._id, vehicle: autoRoberto._id, service: svcDiagnostico._id,
      cost: svcDiagnostico.precioBase, status: 'en_proceso', priority: 'media',
      entryDate: hoy, assignedTo: mec1._id,
      diagnosis: 'Luz de check engine encendida. Se realiza diagnóstico con scanner.',
    },

    // ESTA SEMANA - pendientes
    {
      client: clienteAna._id, vehicle: autoAna._id, service: svcAceite._id,
      cost: svcAceite.precioBase, status: 'pendiente', priority: 'baja',
      entryDate: daysAgo(1),
      diagnosis: 'Cambio de aceite de rutina.',
    },
    {
      client: clienteMaria._id, vehicle: autoMaria2._id, service: svcAlineacion._id,
      cost: svcAlineacion.precioBase, status: 'pendiente', priority: 'baja',
      entryDate: daysAgo(2),
      diagnosis: 'Vehículo jala hacia la derecha. Se solicita alineación y balanceo.',
    },

    // EN PROCESO - asignados a mecánicos
    {
      client: clienteCarlos._id, vehicle: autoCarlos2._id, service: svcFrenosT._id,
      cost: svcFrenosT.precioBase, status: 'en_proceso', priority: 'alta',
      entryDate: daysAgo(1), assignedTo: mec2._id,
      diagnosis: 'Frenos traseros con desgaste crítico. Tambores desgastados.',
      notes: 'Se reemplaza tambores y zapatas',
    },
    {
      client: clienteRoberto._id, vehicle: autoRoberto._id, service: svcCorrea._id,
      cost: svcCorrea.precioBase, status: 'en_proceso', priority: 'alta',
      entryDate: daysAgo(3), assignedTo: mec1._id,
      diagnosis: 'Correa de distribución con 75.000 km. Reemplazo preventivo.',
      notes: 'Se reemplaza correa, tensor y bomba de agua',
    },

    // TERMINADOS
    {
      client: clienteCarlos._id, vehicle: autoCarlos1._id, service: svcMant5k._id,
      cost: svcMant5k.precioBase, status: 'terminado', priority: 'baja',
      entryDate: daysAgo(7), deliveryDate: daysAgo(7), assignedTo: mec1._id,
      diagnosis: 'Mantención de 5.000 km completada. Sin novedades.',
    },
    {
      client: clienteMaria._id, vehicle: autoMaria1._id, service: svcBateria._id,
      cost: svcBateria.precioBase, status: 'terminado', priority: 'media',
      entryDate: daysAgo(10), deliveryDate: daysAgo(10), assignedTo: mec2._id,
      diagnosis: 'Batería sin carga. Reemplazo de batería 60 Ah realizado.',
    },
    {
      client: clienteAna._id, vehicle: autoAna._id, service: svcSuspension._id,
      cost: svcSuspension.precioBase, status: 'terminado', priority: 'media',
      entryDate: daysAgo(14), deliveryDate: daysAgo(14), assignedTo: mec1._id,
      diagnosis: 'Revisión de suspensión. Rótulas desgastadas reemplazadas.',
    },
    {
      client: clienteRoberto._id, vehicle: autoRoberto._id, service: svcElectrico._id,
      cost: svcElectrico.precioBase, status: 'terminado', priority: 'media',
      entryDate: daysAgo(20), deliveryDate: daysAgo(19), assignedTo: mec2._id,
      diagnosis: 'Falla en el alternador. Reemplazo realizado. Sistema verificado.',
    },
    {
      client: clienteCarlos._id, vehicle: autoCarlos2._id, service: svcAceite._id,
      cost: svcAceite.precioBase, status: 'terminado', priority: 'baja',
      entryDate: daysAgo(30), deliveryDate: daysAgo(30), assignedTo: mec1._id,
      diagnosis: 'Cambio de aceite 5W-30 sintético y filtro de aceite.',
    },
    {
      client: clienteMaria._id, vehicle: autoMaria2._id, service: svcDiagnostico._id,
      cost: svcDiagnostico.precioBase, status: 'terminado', priority: 'baja',
      entryDate: daysAgo(45), deliveryDate: daysAgo(45), assignedTo: mec2._id,
      diagnosis: 'Diagnóstico electrónico. Código P0420 catalizador. Falla borrada.',
    },

    // CANCELADOS
    {
      client: clienteAna._id, vehicle: autoAna._id, service: svcMotor._id,
      cost: svcMotor.precioBase, status: 'cancelado', priority: 'alta',
      entryDate: daysAgo(5),
      diagnosis: 'Cliente canceló la revisión de motor por presupuesto.',
      notes: 'Cliente reprogramará para el mes próximo',
    },
    {
      client: clienteCarlos._id, vehicle: autoCarlos1._id, service: svcAmortiguadores._id,
      cost: svcAmortiguadores.precioBase, status: 'cancelado', priority: 'media',
      entryDate: daysAgo(15),
      diagnosis: 'Agendamiento cancelado. Cliente no se presentó.',
    },
  ]);

  console.log('📋 15 agendamientos creados (2 pendientes hoy, 1 en proceso hoy, 4 pendientes/en proceso, 6 terminados, 2 cancelados)');

  await mongoose.disconnect();

  console.log('\n✅ Seed completado exitosamente');
  console.log('══════════════════════════════════════════════════');
  console.log('  CREDENCIALES DE ACCESO');
  console.log('──────────────────────────────────────────────────');
  console.log('  Admin:      admin@taller.cl      / admin1234');
  console.log('  Mecánico 1: mecanico1@taller.cl  / admin1234');
  console.log('  Mecánico 2: mecanico2@taller.cl  / admin1234');
  console.log('  Cliente 1:  cliente@taller.cl    / admin1234');
  console.log('  Cliente 2:  cliente2@taller.cl   / admin1234');
  console.log('  Cliente 3:  cliente3@taller.cl   / admin1234');
  console.log('══════════════════════════════════════════════════');
}

seed().catch((err) => {
  console.error('❌ Error en seed:', err.message);
  process.exit(1);
});
