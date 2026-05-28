const pool = require('../database/connection');

// GET /api/pacientes
const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, u.correo AS correo_usuario, u.nombre AS nombre_usuario
       FROM PACIENTE p
       LEFT JOIN USUARIO u ON p.id_usuario = u.id_usuario
       ORDER BY p.fecha_registro DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ error: 'Error al obtener pacientes.' });
  }
};

// GET /api/pacientes/perfil/me
const getMiPerfil = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;
    const [rows] = await pool.query(
      `SELECT p.*, u.correo AS correo_usuario
       FROM PACIENTE p
       LEFT JOIN USUARIO u ON p.id_usuario = u.id_usuario
       WHERE p.id_usuario = ?`,
      [id_usuario]
    );
    if (rows.length === 0) {
      // Si el usuario paciente no tiene perfil clínico creado (ej: creado por admin)
      // Lo creamos automáticamente con sus datos básicos
      const [uRows] = await pool.query('SELECT nombre, apellido, correo FROM USUARIO WHERE id_usuario = ?', [id_usuario]);
      if (uRows.length > 0) {
        const u = uRows[0];
        const [insert] = await pool.query(
          `INSERT INTO PACIENTE (id_usuario, nombres, apellidos, correo, fecha_nacimiento, sexo) VALUES (?, ?, ?, ?, ?, ?)`,
          [id_usuario, u.nombre, u.apellido, u.correo, '2000-01-01', 'No espec.']
        );
        const [newRows] = await pool.query(
          `SELECT p.*, u.correo AS correo_usuario
           FROM PACIENTE p
           LEFT JOIN USUARIO u ON p.id_usuario = u.id_usuario
           WHERE p.id_paciente = ?`,
          [insert.insertId]
        );
        return res.json(newRows[0]);
      }
      return res.status(404).json({ error: 'Perfil de paciente no encontrado.' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener mi perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil.' });
  }
};

// GET /api/pacientes/:id
const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT p.*, u.correo AS correo_usuario
       FROM PACIENTE p
       LEFT JOIN USUARIO u ON p.id_usuario = u.id_usuario
       WHERE p.id_paciente = ?`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Paciente no encontrado.' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener paciente.' });
  }
};

// POST /api/pacientes
const create = async (req, res) => {
  const {
    nombres, apellidos, fecha_nacimiento, sexo,
    telefono, correo, direccion,
    contacto_emergencia_nombre, contacto_emergencia_telefono,
    id_usuario
  } = req.body;

  if (!nombres || !apellidos || !fecha_nacimiento || !sexo) {
    return res.status(400).json({ error: 'Campos requeridos: nombres, apellidos, fecha_nacimiento, sexo.' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO PACIENTE (id_usuario, nombres, apellidos, fecha_nacimiento, sexo, telefono, correo, direccion, contacto_emergencia_nombre, contacto_emergencia_telefono)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_usuario, nombres, apellidos, fecha_nacimiento, sexo, telefono || null, correo || null, direccion || null, contacto_emergencia_nombre || null, contacto_emergencia_telefono || null]
    );

    // Crear historial clínico automáticamente
    await pool.query(
      `INSERT INTO HISTORIAL_CLINICO (id_paciente) VALUES (?)`,
      [result.insertId]
    );

    const [newPatient] = await pool.query('SELECT * FROM PACIENTE WHERE id_paciente = ?', [result.insertId]);
    res.status(201).json(newPatient[0]);
  } catch (error) {
    console.error('Error al crear paciente:', error);
    res.status(500).json({ error: 'Error al crear paciente.' });
  }
};

// PUT /api/pacientes/:id
const update = async (req, res) => {
  const { id } = req.params;
  const {
    nombres, apellidos, documento_identidad, fecha_nacimiento, sexo, alergias, tipo_sangre,
    telefono, correo, direccion,
    contacto_emergencia_nombre, contacto_emergencia_telefono
  } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE PACIENTE SET nombres=?, apellidos=?, documento_identidad=?, fecha_nacimiento=?, sexo=?, alergias=?, tipo_sangre=?, 
       telefono=?, correo=?, direccion=?, contacto_emergencia_nombre=?, contacto_emergencia_telefono=?
       WHERE id_paciente=?`,
      [nombres, apellidos, documento_identidad, fecha_nacimiento, sexo, alergias, tipo_sangre, telefono, correo, direccion, contacto_emergencia_nombre, contacto_emergencia_telefono, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Paciente no encontrado.' });
    const [updated] = await pool.query('SELECT * FROM PACIENTE WHERE id_paciente = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar paciente.' });
  }
};

// DELETE /api/pacientes/:id
const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM PACIENTE WHERE id_paciente = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Paciente no encontrado.' });
    res.json({ message: 'Paciente eliminado correctamente.' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ error: 'No se puede eliminar: el paciente tiene citas, historial o documentos asociados.' });
    }
    res.status(500).json({ error: 'Error al eliminar paciente.' });
  }
};

// GET /api/pacientes/:id/historial
const getHistorial = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT cc.*, o.id_usuario AS id_usuario_odontologo,
              u.nombre AS odontologo_nombre, u.apellido AS odontologo_apellido
       FROM CONSULTA_CLINICA cc
       JOIN HISTORIAL_CLINICO hc ON cc.id_historial = hc.id_historial
       JOIN ODONTOLOGO o ON cc.id_odontologo = o.id_odontologo
       JOIN USUARIO u ON o.id_usuario = u.id_usuario
       WHERE hc.id_paciente = ?
       ORDER BY cc.fecha_consulta DESC`,
      [id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener historial.' });
  }
};

// POST /api/pacientes/:id/crear-acceso
// Crea un usuario con rol "paciente" y lo vincula al paciente existente
const crearAcceso = async (req, res) => {
  const { id } = req.params;
  const { correo, password } = req.body;

  if (!correo) {
    return res.status(400).json({ error: 'El correo es requerido.' });
  }

  let finalPassword = password;
  let requiereCambio = 0;
  if (!finalPassword || finalPassword.trim() === '') {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let temp = '';
    for (let i = 0; i < 8; i++) {
      temp += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    finalPassword = temp;
    requiereCambio = 1;
  } else if (finalPassword.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Verificar que el paciente existe y no tiene usuario aún
    const [pacs] = await conn.query('SELECT * FROM PACIENTE WHERE id_paciente = ?', [id]);
    if (pacs.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'Paciente no encontrado.' });
    }
    if (pacs[0].id_usuario) {
      await conn.rollback();
      return res.status(409).json({ error: 'Este paciente ya tiene una cuenta de acceso.' });
    }

    const paciente = pacs[0];
    const bcrypt = require('bcryptjs');
    const password_hash = await bcrypt.hash(finalPassword, 10);

    // Crear usuario con los datos del paciente
    const [userResult] = await conn.query(
      `INSERT INTO USUARIO (nombre, apellido, correo, password_hash, rol, id_estado_usuario, requiere_cambio_password) VALUES (?,?,?,?,?,?,?)`,
      [paciente.nombres, paciente.apellidos, correo, password_hash, 'paciente', 1, requiereCambio]
    );

    // Vincular el usuario al paciente
    await conn.query(
      'UPDATE PACIENTE SET id_usuario = ?, correo = ? WHERE id_paciente = ?',
      [userResult.insertId, correo, id]
    );

    await conn.commit();
    res.status(201).json({ 
      message: 'Acceso creado y vinculado al paciente correctamente.',
      passwordTemp: requiereCambio ? finalPassword : null
    });
  } catch (error) {
    await conn.rollback();
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El correo ya está registrado en el sistema.' });
    }
    console.error('Error al crear acceso:', error);
    res.status(500).json({ error: 'Error al crear acceso.' });
  } finally {
    conn.release();
  }
};

// GET /api/pacientes/perfil/me/citas
const getMisCitas = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;
    const [rows] = await pool.query(
      `SELECT c.*, ec.codigo AS estado_codigo, ec.nombre AS estado_nombre, 
              u.nombre AS odontologo_nombre, u.apellido AS odontologo_apellido
       FROM CITA c
       JOIN ESTADO_CITA ec ON c.id_estado_cita = ec.id_estado_cita
       JOIN PACIENTE p ON c.id_paciente = p.id_paciente
       LEFT JOIN ODONTOLOGO o ON c.id_odontologo = o.id_odontologo
       LEFT JOIN USUARIO u ON o.id_usuario = u.id_usuario
       WHERE p.id_usuario = ?
       ORDER BY c.fecha_cita DESC`,
      [id_usuario]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener citas del paciente:', error);
    res.status(500).json({ error: 'Error al obtener citas.' });
  }
};

// GET /api/pacientes/perfil/me/historial
const getMiHistorial = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;
    const [rows] = await pool.query(
      `SELECT cc.*, u.nombre AS odontologo_nombre, u.apellido AS odontologo_apellido
       FROM CONSULTA_CLINICA cc
       JOIN HISTORIAL_CLINICO hc ON cc.id_historial = hc.id_historial
       JOIN PACIENTE p ON hc.id_paciente = p.id_paciente
       JOIN ODONTOLOGO o ON cc.id_odontologo = o.id_odontologo
       JOIN USUARIO u ON o.id_usuario = u.id_usuario
       WHERE p.id_usuario = ?
       ORDER BY cc.fecha_consulta DESC`,
      [id_usuario]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener historial del paciente:', error);
    res.status(500).json({ error: 'Error al obtener historial.' });
  }
};

// GET /api/pacientes/perfil/me/recetas
const getMisRecetas = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;
    const [rows] = await pool.query(
      `SELECT r.*, cc.fecha_consulta, u.nombre AS odontologo_nombre, u.apellido AS odontologo_apellido
       FROM RECETA r
       JOIN CONSULTA_CLINICA cc ON r.id_consulta = cc.id_consulta
       JOIN HISTORIAL_CLINICO hc ON cc.id_historial = hc.id_historial
       JOIN PACIENTE p ON hc.id_paciente = p.id_paciente
       JOIN ODONTOLOGO o ON cc.id_odontologo = o.id_odontologo
       JOIN USUARIO u ON o.id_usuario = u.id_usuario
       WHERE p.id_usuario = ?
       ORDER BY r.fecha_receta DESC`,
      [id_usuario]
    );

    const recetas = [];
    for (const receta of rows) {
      const [detalles] = await pool.query(
        `SELECT rd.*, m.nombre AS medicamento_nombre 
         FROM RECETA_DETALLE rd
         JOIN MEDICAMENTO m ON rd.id_medicamento = m.id_medicamento
         WHERE rd.id_receta = ?`,
        [receta.id_receta]
      );
      recetas.push({ ...receta, detalles });
    }

    res.json(recetas);
  } catch (error) {
    console.error('Error al obtener recetas del paciente:', error);
    res.status(500).json({ error: 'Error al obtener recetas.' });
  }
};

module.exports = { getAll, getById, create, update, remove, getHistorial, crearAcceso, getMiPerfil, getMisCitas, getMiHistorial, getMisRecetas };

