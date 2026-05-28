const pool = require('../database/connection');

// GET /api/stats — estadísticas para el dashboard y reportes
const getStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Si es dentista, segmentar estadísticas por odontólogo
    if (req.user.rol === 'dentista') {
      const [odontologos] = await pool.query('SELECT id_odontologo FROM ODONTOLOGO WHERE id_usuario = ?', [req.user.id_usuario]);
      if (odontologos.length === 0) {
        return res.status(403).json({ error: 'No tienes perfil de odontólogo asignado.' });
      }
      const myOdontologoId = odontologos[0].id_odontologo;

      // 1. Total pacientes únicos atendidos o agendados por este odontólogo
      const [[totalPacientes]] = await pool.query(
        'SELECT COUNT(DISTINCT id_paciente) AS total FROM CITA WHERE id_odontologo = ?',
        [myOdontologoId]
      );

      // 2. Citas de hoy asignadas a este odontólogo
      const [[citasHoy]] = await pool.query(
        `SELECT COUNT(*) AS total FROM CITA 
         WHERE DATE(fecha_cita) = ? AND id_odontologo = ? 
         AND id_estado_cita NOT IN (
           SELECT id_estado_cita FROM ESTADO_CITA WHERE codigo IN ('CANCELADA','NO_ASISTIO')
         )`, 
        [today, myOdontologoId]
      );

      // 3. Stock bajo no es relevante para el doctor, lo devolvemos como 0
      const stockBajoValue = 0;

      // 4. Citas por mes de este odontólogo (últimos 6 meses)
      const [citasPorMes] = await pool.query(
        `SELECT DATE_FORMAT(fecha_cita, '%Y-%m') AS mes,
                COUNT(*) AS total_citas
         FROM CITA
         WHERE fecha_cita >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH) AND id_odontologo = ?
         GROUP BY mes ORDER BY mes ASC`,
        [myOdontologoId]
      );

      // 5. Citas por tipo (motivo) de este odontólogo
      const [citasPorTipo] = await pool.query(
        `SELECT COALESCE(motivo, 'Sin especificar') AS tipo, COUNT(*) AS count
         FROM CITA
         WHERE id_odontologo = ?
         GROUP BY motivo ORDER BY count DESC LIMIT 8`,
        [myOdontologoId]
      );

      // 6. Top medicamentos prescritos por este odontólogo
      const [topMedicamentos] = await pool.query(
        `SELECT m.nombre, COUNT(rd.id_receta_detalle) AS recetado
         FROM RECETA_DETALLE rd
         JOIN MEDICAMENTO m ON rd.id_medicamento = m.id_medicamento
         JOIN RECETA r ON rd.id_receta = r.id_receta
         JOIN CONSULTA_CLINICA c ON r.id_consulta = c.id_consulta
         WHERE c.id_odontologo = ?
         GROUP BY m.id_medicamento, m.nombre
         ORDER BY recetado DESC LIMIT 5`,
        [myOdontologoId]
      );

      // 7. Nuevos pacientes únicos asignados por mes a este doctor (últimos 6 meses)
      const [pacientesPorMes] = await pool.query(
        `SELECT DATE_FORMAT(fecha_cita, '%Y-%m') AS mes, COUNT(DISTINCT id_paciente) AS nuevos
         FROM CITA
         WHERE fecha_cita >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH) AND id_odontologo = ?
         GROUP BY mes ORDER BY mes ASC`,
        [myOdontologoId]
      );

      // 8. Insumos alerta no es relevante para el doctor, devolvemos array vacío
      const insumosAlerta = [];

      return res.json({
        totalPacientes: totalPacientes.total,
        citasHoy: citasHoy.total,
        stockBajo: stockBajoValue,
        citasPorMes,
        citasPorTipo,
        topMedicamentos,
        pacientesPorMes,
        insumosAlerta,
      });
    }

    // Si es admin o asistente, ver estadísticas globales
    const [[totalPacientes]] = await pool.query('SELECT COUNT(*) AS total FROM PACIENTE');
    const [[citasHoy]] = await pool.query(
      `SELECT COUNT(*) AS total FROM CITA WHERE DATE(fecha_cita) = ? AND id_estado_cita NOT IN (
        SELECT id_estado_cita FROM ESTADO_CITA WHERE codigo IN ('CANCELADA','NO_ASISTIO')
      )`, [today]
    );
    const [[stockBajo]] = await pool.query(
      `SELECT COUNT(*) AS total FROM INSUMO_CLINICO i
       WHERE (SELECT COALESCE(SUM(l.cantidad_disponible),0) FROM LOTE_INSUMO l WHERE l.id_insumo = i.id_insumo) <= i.stock_minimo`
    );

    // Citas por mes (últimos 6 meses)
    const [citasPorMes] = await pool.query(
      `SELECT DATE_FORMAT(fecha_cita, '%Y-%m') AS mes,
              COUNT(*) AS total_citas
       FROM CITA
       WHERE fecha_cita >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
       GROUP BY mes ORDER BY mes ASC`
    );

    // Citas por tipo (motivo)
    const [citasPorTipo] = await pool.query(
      `SELECT COALESCE(motivo, 'Sin especificar') AS tipo, COUNT(*) AS count
       FROM CITA
       GROUP BY motivo ORDER BY count DESC LIMIT 8`
    );

    // Top medicamentos (por recetas)
    const [topMedicamentos] = await pool.query(
      `SELECT m.nombre, COUNT(rd.id_receta_detalle) AS recetado
       FROM RECETA_DETALLE rd
       JOIN MEDICAMENTO m ON rd.id_medicamento = m.id_medicamento
       GROUP BY m.id_medicamento, m.nombre
       ORDER BY recetado DESC LIMIT 5`
    );

    // Nuevos pacientes por mes (últimos 6 meses)
    const [pacientesPorMes] = await pool.query(
      `SELECT DATE_FORMAT(fecha_registro, '%Y-%m') AS mes, COUNT(*) AS nuevos
       FROM PACIENTE
       WHERE fecha_registro >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
       GROUP BY mes ORDER BY mes ASC`
    );

    // Insumos con stock bajo
    const [insumosAlerta] = await pool.query(
      `SELECT i.nombre, i.stock_minimo,
              COALESCE(SUM(l.cantidad_disponible),0) AS stock_actual
       FROM INSUMO_CLINICO i
       LEFT JOIN LOTE_INSUMO l ON l.id_insumo = i.id_insumo
       GROUP BY i.id_insumo, i.nombre, i.stock_minimo
       HAVING stock_actual <= i.stock_minimo
       ORDER BY stock_actual ASC LIMIT 5`
    );

    res.json({
      totalPacientes: totalPacientes.total,
      citasHoy: citasHoy.total,
      stockBajo: stockBajo.total,
      citasPorMes,
      citasPorTipo,
      topMedicamentos,
      pacientesPorMes,
      insumosAlerta,
    });
  } catch (error) {
    console.error('Error al obtener stats:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas.' });
  }
};

module.exports = { getStats };
