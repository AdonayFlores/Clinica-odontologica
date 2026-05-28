const pool = require('../database/connection');

// GET /api/logs — obtener registros de auditoría/actividad
const getLogs = async (req, res) => {
  // Asegurar que solo el admin pueda ver los logs de auditoría
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Solo administradores pueden ver la auditoría.' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT l.*, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido, u.correo AS usuario_correo, u.rol AS usuario_rol
       FROM LOG_ACTIVIDAD l
       LEFT JOIN USUARIO u ON l.id_usuario = u.id_usuario
       ORDER BY l.fecha_registro DESC
       LIMIT 500`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener logs de auditoría:', error);
    res.status(500).json({ error: 'Error al obtener logs de auditoría.' });
  }
};

module.exports = { getLogs };
