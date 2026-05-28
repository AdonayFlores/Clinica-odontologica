require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const pacienteRoutes = require('./routes/paciente.routes');
const medicamentoRoutes = require('./routes/medicamento.routes');
const insumoRoutes = require('./routes/insumo.routes');
const proveedorRoutes = require('./routes/proveedor.routes');
const loteRoutes = require('./routes/lote.routes');
const movimientoRoutes = require('./routes/movimiento.routes');
const consultaRoutes = require('./routes/consulta.routes');
const recetaRoutes = require('./routes/receta.routes');
const notificacionRoutes = require('./routes/notificacion.routes');
const odontologoRoutes = require('./routes/odontologo.routes');
const statsRoutes = require('./routes/stats.routes');
const citaRoutes = require('./routes/cita.routes');
const odontogramaRoutes = require('./routes/odontograma.routes');
const notaRoutes = require('./routes/nota.routes');
const logRoutes = require('./routes/log.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: '*', // Permite cualquier origen
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware global
const logMiddleware = require('./middlewares/log.middleware');
app.use(logMiddleware);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Clínica Odontológica funcionando correctamente', timestamp: new Date().toISOString() });
});

// Registrar rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/medicamentos', medicamentoRoutes);
app.use('/api/insumos', insumoRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/lotes', loteRoutes);
app.use('/api/movimientos', movimientoRoutes);
app.use('/api/consultas', consultaRoutes);
app.use('/api/recetas', recetaRoutes);
app.use('/api/notificaciones', notificacionRoutes);
app.use('/api/odontologos', odontologoRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/odontograma', odontogramaRoutes);
app.use('/api/notas', notaRoutes);
app.use('/api/logs', logRoutes);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor', details: err.message });
});

app.listen(PORT, () => {
  console.log(`🦷 API Clínica Odontológica corriendo en http://localhost:${PORT}`);
  console.log(`📋 Documentación: http://localhost:${PORT}/api/health`);
});

module.exports = app;
