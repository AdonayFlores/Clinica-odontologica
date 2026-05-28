const pool = require('../database/connection');

// GET /api/recetas
const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, cc.motivo_consulta, cc.diagnostico,
              p.nombres AS paciente_nombres, p.apellidos AS paciente_apellidos
       FROM RECETA r
       JOIN CONSULTA_CLINICA cc ON r.id_consulta = cc.id_consulta
       JOIN HISTORIAL_CLINICO hc ON cc.id_historial = hc.id_historial
       JOIN PACIENTE p ON hc.id_paciente = p.id_paciente
       ORDER BY r.fecha_receta DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener recetas.' });
  }
};

// GET /api/recetas/:id con detalles
const getById = async (req, res) => {
  try {
    const [receta] = await pool.query(
      `SELECT r.*, cc.motivo_consulta, cc.diagnostico
       FROM RECETA r JOIN CONSULTA_CLINICA cc ON r.id_consulta = cc.id_consulta
       WHERE r.id_receta = ?`,
      [req.params.id]
    );
    if (receta.length === 0) return res.status(404).json({ error: 'Receta no encontrada.' });

    const [detalles] = await pool.query(
      `SELECT rd.*, m.nombre AS medicamento_nombre, m.presentacion, m.via_administracion
       FROM RECETA_DETALLE rd
       JOIN MEDICAMENTO m ON rd.id_medicamento = m.id_medicamento
       WHERE rd.id_receta = ?`,
      [req.params.id]
    );

    res.json({ ...receta[0], detalles });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener receta.' });
  }
};

// POST /api/recetas
const create = async (req, res) => {
  const { id_consulta, indicaciones_generales, detalles } = req.body;
  if (!id_consulta || !detalles || !Array.isArray(detalles) || detalles.length === 0) {
    return res.status(400).json({ error: 'Se requiere id_consulta y al menos un detalle de medicamento.' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [recetaResult] = await conn.query(
      `INSERT INTO RECETA (id_consulta, indicaciones_generales) VALUES (?,?)`,
      [id_consulta, indicaciones_generales || null]
    );
    const id_receta = recetaResult.insertId;

    for (const det of detalles) {
      let resolvedIdMedicamento = det.id_medicamento;

      // Si no viene id_medicamento o es null, intentar resolver por nombre
      if ((!resolvedIdMedicamento || resolvedIdMedicamento === 0) && det.nombre) {
        const [existing] = await conn.query('SELECT id_medicamento FROM MEDICAMENTO WHERE LOWER(nombre) = LOWER(?)', [det.nombre]);
        if (existing.length > 0) {
          resolvedIdMedicamento = existing[0].id_medicamento;
        } else {
          // Si no existe, lo creamos automáticamente
          const [insertMed] = await conn.query(
            'INSERT INTO MEDICAMENTO (nombre, descripcion, presentacion, estado) VALUES (?, ?, ?, ?)',
            [det.nombre, 'Creado automáticamente desde receta libre', 'N/A', 'activo']
          );
          resolvedIdMedicamento = insertMed.insertId;
        }
      }

      await conn.query(
        `INSERT INTO RECETA_DETALLE (id_receta, id_medicamento, dosis, frecuencia, duracion, cantidad_indicada, instrucciones)
         VALUES (?,?,?,?,?,?,?)`,
        [id_receta, resolvedIdMedicamento, det.dosis, det.frecuencia, det.duracion, det.cantidad_indicada, det.instrucciones || null]
      );
    }

    await conn.commit();
    const [created] = await conn.query('SELECT * FROM RECETA WHERE id_receta = ?', [id_receta]);
    res.status(201).json(created[0]);
  } catch (error) {
    await conn.rollback();
    console.error('Error al crear receta:', error);
    res.status(500).json({ error: 'Error al crear receta.' });
  } finally {
    conn.release();
  }
};

// GET /api/recetas/paciente/:id_paciente
const getByPaciente = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.id_receta, r.fecha_receta, r.indicaciones_generales,
              cc.motivo_consulta, cc.diagnostico,
              u.nombre AS odontologo_nombre, u.apellido AS odontologo_apellido,
              GROUP_CONCAT(CONCAT(m.nombre, ' — ', rd.dosis, ' — ', rd.frecuencia, ' por ', rd.duracion) SEPARATOR '\n') AS detalles_texto
       FROM RECETA r
       JOIN CONSULTA_CLINICA cc ON r.id_consulta = cc.id_consulta
       JOIN HISTORIAL_CLINICO hc ON cc.id_historial = hc.id_historial
       JOIN ODONTOLOGO o ON cc.id_odontologo = o.id_odontologo
       JOIN USUARIO u ON o.id_usuario = u.id_usuario
       LEFT JOIN RECETA_DETALLE rd ON rd.id_receta = r.id_receta
       LEFT JOIN MEDICAMENTO m ON rd.id_medicamento = m.id_medicamento
       WHERE hc.id_paciente = ?
       GROUP BY r.id_receta
       ORDER BY r.fecha_receta DESC`,
      [req.params.id_paciente]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener recetas del paciente:', error);
    res.status(500).json({ error: 'Error al obtener recetas.' });
  }
};

module.exports = { getAll, getById, create, getByPaciente };
