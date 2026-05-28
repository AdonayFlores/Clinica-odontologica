const pool = require('../database/connection');

// GET /api/citas
const getAll = async (req, res) => {
  try {
    let query = `
      SELECT c.*, ec.codigo AS estado_codigo, ec.nombre AS estado_nombre,
             p.nombres AS paciente_nombres, p.apellidos AS paciente_apellidos,
             u.nombre AS odontologo_nombre, u.apellido AS odontologo_apellido
      FROM CITA c
      JOIN ESTADO_CITA ec ON c.id_estado_cita = ec.id_estado_cita
      JOIN PACIENTE p ON c.id_paciente = p.id_paciente
      LEFT JOIN ODONTOLOGO o ON c.id_odontologo = o.id_odontologo
      LEFT JOIN USUARIO u ON o.id_usuario = u.id_usuario
    `;
    let params = [];

    if (req.user.rol === 'dentista') {
      const [odontologos] = await pool.query('SELECT id_odontologo FROM ODONTOLOGO WHERE id_usuario = ?', [req.user.id_usuario]);
      if (odontologos.length > 0) {
        query += ' WHERE c.id_odontologo = ?';
        params.push(odontologos[0].id_odontologo);
      } else {
        return res.json([]);
      }
    }

    query += ' ORDER BY c.fecha_cita DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({ error: 'Error al obtener citas.' });
  }
};

// GET /api/citas/:id
const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT c.*, ec.codigo AS estado_codigo, ec.nombre AS estado_nombre,
              p.nombres AS paciente_nombres, p.apellidos AS paciente_apellidos,
              u.nombre AS odontologo_nombre, u.apellido AS odontologo_apellido
       FROM CITA c
       JOIN ESTADO_CITA ec ON c.id_estado_cita = ec.id_estado_cita
       JOIN PACIENTE p ON c.id_paciente = p.id_paciente
       LEFT JOIN ODONTOLOGO o ON c.id_odontologo = o.id_odontologo
       LEFT JOIN USUARIO u ON o.id_usuario = u.id_usuario
       WHERE c.id_cita = ?`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Cita no encontrada.' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cita.' });
  }
};

// POST /api/citas
const create = async (req, res) => {
  // If the user is a patient, they can only create appointments for themselves.
  let { id_paciente, id_odontologo, fecha_cita, motivo, notas } = req.body;

  // Pacientes → siempre PENDIENTE (1) para que el staff confirme
  // Staff (admin/doctor/recepcionista) → usa el estado enviado o CONFIRMADA (2) por defecto
  const esStaff = ['admin', 'doctor', 'recepcionista'].includes(req.user.rol);
  const id_estado_cita = req.user.rol === 'paciente'
    ? 1
    : (req.body.id_estado_cita || 2);

  if (req.user.rol === 'paciente') {
    // Buscar id_paciente del usuario logueado
    const [pacientes] = await pool.query('SELECT id_paciente FROM PACIENTE WHERE id_usuario = ?', [req.user.id_usuario]);
    if (pacientes.length === 0) {
      return res.status(404).json({ error: 'Paciente no encontrado.' });
    }
    id_paciente = pacientes[0].id_paciente;
  } else {
    if (!id_paciente) {
      return res.status(400).json({ error: 'id_paciente es requerido.' });
    }
  }

  if (!fecha_cita || !motivo) {
    return res.status(400).json({ error: 'Campos requeridos: fecha_cita, motivo.' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO CITA (id_paciente, id_odontologo, id_estado_cita, fecha_cita, motivo, notas)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_paciente, id_odontologo || null, id_estado_cita, fecha_cita, motivo, notas || null]
    );

    const [newCita] = await pool.query('SELECT * FROM CITA WHERE id_cita = ?', [result.insertId]);
    res.status(201).json(newCita[0]);
  } catch (error) {
    console.error('Error al crear cita:', error);
    res.status(500).json({ error: 'Error al crear cita.' });
  }
};

// PUT /api/citas/:id
const update = async (req, res) => {
  const { id } = req.params;
  const { id_odontologo, id_estado_cita, fecha_cita, motivo, notas } = req.body;

  try {
    // Validar permisos según el rol
    if (req.user.rol === 'dentista') {
      const [odontologos] = await pool.query('SELECT id_odontologo FROM ODONTOLOGO WHERE id_usuario = ?', [req.user.id_usuario]);
      if (odontologos.length === 0) {
        return res.status(403).json({ error: 'No tienes perfil de odontólogo asignado.' });
      }
      const myOdontologoId = odontologos[0].id_odontologo;

      const [citas] = await pool.query('SELECT id_odontologo FROM CITA WHERE id_cita = ?', [id]);
      if (citas.length === 0) {
        return res.status(404).json({ error: 'Cita no encontrada.' });
      }
      
      if (citas[0].id_odontologo !== myOdontologoId) {
        return res.status(403).json({ error: 'No tienes permisos para modificar esta cita.' });
      }
    } else if (req.user.rol === 'paciente') {
      const [pacientes] = await pool.query('SELECT id_paciente FROM PACIENTE WHERE id_usuario = ?', [req.user.id_usuario]);
      if (pacientes.length === 0) {
        return res.status(403).json({ error: 'No tienes perfil de paciente.' });
      }
      const myPacienteId = pacientes[0].id_paciente;

      const [citas] = await pool.query('SELECT id_paciente FROM CITA WHERE id_cita = ?', [id]);
      if (citas.length === 0) {
        return res.status(404).json({ error: 'Cita no encontrada.' });
      }
      if (citas[0].id_paciente !== myPacienteId) {
        return res.status(403).json({ error: 'No tienes permisos para modificar esta cita.' });
      }
    }

    const [result] = await pool.query(
      `UPDATE CITA SET id_odontologo=?, id_estado_cita=?, fecha_cita=?, motivo=?, notas=? WHERE id_cita=?`,
      [id_odontologo || null, id_estado_cita, fecha_cita, motivo, notas || null, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Cita no encontrada.' });
    const [updated] = await pool.query('SELECT * FROM CITA WHERE id_cita = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Error al actualizar cita:', error);
    res.status(500).json({ error: 'Error al actualizar cita.' });
  }
};

// DELETE /api/citas/:id
const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM CITA WHERE id_cita = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Cita no encontrada.' });
    res.json({ message: 'Cita eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cita.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
